import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Called by the browser after login. We first check the BetterAuth
// session, then ask the Express server for the token cookie using
// our secret key, and pass the cookie on to the browser.
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return NextResponse.json(
      { message: "Please log in first." },
      { status: 401 },
    );
  }

  const backendUrl = process.env.BACKEND_URL;
  const internalKey = process.env.INTERNAL_API_KEY;

  if (!backendUrl || !internalKey) {
    return NextResponse.json(
      { message: "Server configuration error." },
      { status: 500 },
    );
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${backendUrl}/api/auth/jwt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-key": internalKey,
      },
      body: JSON.stringify({
        email: session.user.email,
        name: session.user.name,
      }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "Could not reach the StudioSpace server." },
      { status: 502 },
    );
  }

  if (!backendResponse.ok) {
    return NextResponse.json(
      { message: "Could not start a secure session." },
      { status: 502 },
    );
  }

  const response = NextResponse.json({ message: "Secure session started." });
  for (const cookie of backendResponse.headers.getSetCookie()) {
    response.headers.append("set-cookie", cookie);
  }
  return response;
}

// Called on logout to remove the token cookie.
export async function DELETE() {
  const isProduction = process.env.NODE_ENV === "production";
  const response = NextResponse.json({ message: "Secure session ended." });
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}