export type CurrentUser = {
  name: string;
  email: string;
  image?: string | null;
};

// Temporary version: nobody is logged in yet.
// When we set up BetterAuth, we will replace the inside of this
// function with the real session. Navbar will not need any change.
export function useCurrentUser(): {
  user: CurrentUser | null;
  isPending: boolean;
} {
  return { user: null, isPending: false };
}