import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User } from "../types"
import { authClient } from "../lib/auth";

interface AuthContextType {
  user: User;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null)

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [neonUser, setNeonUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Need to call the auth client if a user has already signed in
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await authClient.getSession()
        if (res && res.data?.user) {
          setNeonUser(res.data.user)
        }
      } catch (err) {
        console.log("Failed to load session");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [])

  async function signOut() {
    setNeonUser(null);
    await authClient.signOut();
  }

  return (
    <AuthContext.Provider value={{ user: neonUser, loading: loading, signOut: signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must have an AuthProvider");
  }

  return context;
}
