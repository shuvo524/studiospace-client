"use client";

import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { syncBackendToken } from "@/lib/backend-token";

export function TokenSync() {
  const { user } = useCurrentUser();
  const email = user?.email;

  useEffect(() => {
    if (email) {
      void syncBackendToken();
    }
  }, [email]);

  return null;
}