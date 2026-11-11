"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";
import { authApi } from "@/lib/auth-api";

interface WishlistContextValue {
  ids: Set<string>;
  ready: boolean;
  toggle: (studioId: string) => Promise<void>;
}

const EMPTY_IDS = new Set<string>();

const WishlistContext = createContext<WishlistContextValue>({
  ids: EMPTY_IDS,
  ready: false,
  toggle: async () => {},
});

export function useWishlist() {
  return useContext(WishlistContext);
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useCurrentUser();
  const email = user?.email ?? null;
  const [stored, setStored] = useState<{
    email: string;
    ids: Set<string>;
  } | null>(null);

  useEffect(() => {
    if (!email) return;
    let ignore = false;

    authApi<string[]>("/api/wishlist/ids")
      .then((list) => {
        if (!ignore) setStored({ email, ids: new Set(list) });
      })
      .catch(() => {
        if (!ignore) setStored({ email, ids: new Set() });
      });

    return () => {
      ignore = true;
    };
  }, [email]);

  const ready = Boolean(email && stored && stored.email === email);
  const ids = ready && stored ? stored.ids : EMPTY_IDS;

  const toggle = useCallback(
    async (studioId: string) => {
      if (!email) {
        toast.info("Please log in to save studios to your wishlist.");
        return;
      }
      if (!ready) {
        toast.info("Your wishlist is still loading. Please try again.");
        return;
      }

      try {
        const result = await authApi<{ saved: boolean; message: string }>(
          `/api/wishlist/${studioId}`,
          { method: "POST" },
        );
        setStored((current) => {
          if (!current) return current;
          const next = new Set(current.ids);
          if (result.saved) next.add(studioId);
          else next.delete(studioId);
          return { ...current, ids: next };
        });
        toast.success(result.message);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Could not update your wishlist.",
        );
      }
    },
    [email, ready],
  );

  const value = useMemo(() => ({ ids, ready, toggle }), [ids, ready, toggle]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}