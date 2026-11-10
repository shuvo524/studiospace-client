export async function syncBackendToken(): Promise<boolean> {
  try {
    const response = await fetch("/api/backend-token", {
      method: "POST",
      credentials: "include",
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function clearBackendToken(): Promise<void> {
  try {
    await fetch("/api/backend-token", {
      method: "DELETE",
      credentials: "include",
    });
  } catch {
    // Nothing to do: the cookie will expire by itself.
  }
}