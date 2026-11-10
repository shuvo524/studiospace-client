export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Always talks to the Express server through the /backend proxy,
// so the secure token cookie is sent automatically.
// Use it inside client components (e.g. api<Studio[]>("/api/studios")).
export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`/backend${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      (data as { message?: string } | null)?.message ||
      "Something went wrong. Please try again.";
    throw new ApiError(message, response.status);
  }

  return data as T;
}