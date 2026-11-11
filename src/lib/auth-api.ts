import { api, ApiError } from "@/lib/api";
import { syncBackendToken } from "@/lib/backend-token";

// Same as api(), but if the secure cookie is missing (401) it asks for a
// fresh one once and retries the request.
export async function authApi<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  try {
    return await api<T>(path, options);
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === 401 &&
      (await syncBackendToken())
    ) {
      return api<T>(path, options);
    }
    throw error;
  }
}