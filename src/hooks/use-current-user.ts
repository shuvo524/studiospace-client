"use client";

import { authClient } from "@/lib/auth-client";

export type CurrentUser = {
  name: string;
  email: string;
  image?: string | null;
};

export function useCurrentUser(): {
  user: CurrentUser | null;
  isPending: boolean;
} {
  const { data, isPending } = authClient.useSession();

  const user: CurrentUser | null = data?.user
    ? {
        name: data.user.name,
        email: data.user.email,
        image: data.user.image,
      }
    : null;

  return { user, isPending };
}