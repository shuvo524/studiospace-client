"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Aperture } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

// Wraps private pages. While the session is still loading (for example
// right after a page reload) it shows a spinner instead of redirecting,
// so a logged-in user is never sent to the login page by mistake.
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isPending } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, user, router, pathname]);

  if (isPending || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Aperture
          className="size-10 animate-spin text-primary"
          aria-label="Loading"
        />
      </div>
    );
  }

  return <>{children}</>;
}