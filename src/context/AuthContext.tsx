import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User, UserHabit } from "../types"
import { authClient } from "../lib/auth";
import { api } from "../lib/api";

interface AuthContextType {
  user: User;
  loading: boolean;
  signOut: () => Promise<void>;
  saveHabit: (
    habitData: Omit<UserHabit, "userId" | "updatedAt">,
  ) => Promise<void>;
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
        setLoading(true);
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

  async function saveHabit(
    habitData: Omit<UserHabit, "userId" | "updatedAt">
  ) {
    if (!neonUser) {
      throw new Error("User must be authenticated to save habit")
    }

    await api.saveHabit(neonUser.id, habitData);
  }

  async function signOut() {
    setNeonUser(null);
    await authClient.signOut();
  }


  return (
    <AuthContext.Provider value={{ user: neonUser, loading: loading, signOut: signOut, saveHabit: saveHabit }}>
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
