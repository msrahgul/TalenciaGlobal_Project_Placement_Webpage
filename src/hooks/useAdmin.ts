import { useAuth } from "@/context/AuthContext";

const ADMIN_EMAIL = "msrahgul@gmail.com" as const;

/**
 * Returns whether the currently logged-in user is the master admin.
 * The check is purely email-based; the server-side `is_admin()` SQL function
 * enforces the same constraint at the RLS layer.
 */
export function useAdmin() {
  const { user, isLoading } = useAuth();
  const isAdmin = user?.email === ADMIN_EMAIL;
  return { isAdmin, isLoading };
}
