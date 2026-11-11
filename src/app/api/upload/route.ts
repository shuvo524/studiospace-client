import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

// Receives an image from the browser, checks that the user is logged in,
// uploads it to imgbb with our secret key and returns the public URL.
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return NextResponse.json(
      { message: "Please log in to upload images." },
      { status: 401 },
    );
  }

  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { message: "Image upload is not configured." },
      { status: 500 },
    );
  }

  let file: FormDataEntryValue | null = null;
  try {
    const formData = await request.formData();
    file = formData.get("file");
  } catch {
    return NextResponse.json(
      { message: "Could not read the uploaded file." },
      { status: 400 },
    );
  }

  if (!(file instanceof File)) {
    return NextResponse.json(
      { message: "Please choose an image to upload." },
      { status: 400 },
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { message: "Only image files are allowed." },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { message: "Image is too large. Please choose one under 5 MB." },
      { status: 400 },
    );
  }

  const body = new FormData();
  body.append("image", file);

  let response: Response;
  try {
    response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body,
    });
  } catch {
    return NextResponse.json(
      { message: "Could not reach the image host. Please try again." },
      { status: 502 },
    );
  }

  if (!response.ok) {
    return NextResponse.json(
      { message: "Image upload failed. Please try again." },
      { status: 502 },
    );
  }

  const result = (await response.json()) as { data?: { url?: string } };
  const url = result.data?.url;

  if (!url) {
    return NextResponse.json(
      { message: "Image upload failed. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ url });
}