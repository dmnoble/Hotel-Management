// DEV-ONLY STUB FOR Franken-JRPG
// This bypasses Supabase/react-query and always returns
// a logged-in user so the rest of the app can run.

export function useUser() {
  return {
    isLoading: false,
    isAuthenticated: true,
    user: {
      id: "dev-user-1",
      email: "dev@example.com",
      role: "authenticated",
      user_metadata: {
        fullName: "Dev User",
        avatar: "",
      },
      created_at: new Date().toISOString(),
    },
  };
}