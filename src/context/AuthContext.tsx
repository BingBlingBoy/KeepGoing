import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { HabitBuckets, ProfileData, User, UserHabit } from "../types"
import { authClient } from "../lib/auth";
import { api } from "../lib/api";

interface AuthContextType {
  user: User;
  loading: boolean;
  signOut: () => Promise<void>;
  saveHabit: (
    habitData: Omit<UserHabit, "habit_id" | "user_id" | "updatedAt" | "startDate">,
  ) => Promise<void>;
  getHabit: () => Promise<UserHabit[]>;
  getHabitDates: (habitId: string) => Promise<HabitBuckets[]>;
  updateHabit: (
    habitData: HabitBuckets
  ) => Promise<void>;
  getProfileData: (habitId: string) => Promise<ProfileData[]>;
}

const AuthContext = createContext<AuthContextType | null>(null)

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [neonUser, setNeonUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState<ProfileData>()
  const [habitData, setHabitData] = useState<UserHabit[]>()

  // Need to call the auth client if a user has already signed in
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await authClient.getSession()
        setLoading(true);
        if (res && res.data?.user) {
          setNeonUser(res.data.user)
          await saveProfileData(res.data.user.id)
        }
      } catch (err) {
        console.log("Failed to load session:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [])

  // Habit
  async function saveHabit(
    habitData: Omit<UserHabit, "user_id" | "habit_id" | "updatedAt" | "startDate">
  ) {
    if (!neonUser) {
      throw new Error("User must be authenticated to save habit")
    }

    let habit_uuid = crypto.randomUUID()

    await api.saveHabit(habit_uuid, neonUser.id, habitData);
  }

  async function getHabit(): Promise<UserHabit[]> {
    if (!neonUser) {
      throw new Error("User must be authenticated to save habit")
    }

    return await api.getHabit(neonUser.id)
  }

  async function getHabitDates(
    habitId: string
  ): Promise<HabitBuckets[]> {
    return await api.getHabitDates(habitId)
  }

  async function signOut() {
    setNeonUser(null);
    await authClient.signOut();
  }

  async function updateHabit(
    habitData: HabitBuckets
  ) {
    if (!neonUser) {
      throw new Error("User must be authenticated to save habit")
    }
    return await api.updateHabit(habitData)
  }

  // Profile
  async function saveProfileData(habitId: string) {
    await api.saveProfile(habitId)
  }

  async function getProfileData(habitId: string) {
    if (profileData) {
      return profileData
    }
    const res = await api.getProfile(habitId)
    setProfileData(res)
    return res
  }


  return (
    <AuthContext.Provider value={
      {
        user: neonUser,
        loading: loading,
        signOut: signOut,
        saveHabit: saveHabit,
        getHabit: getHabit,
        updateHabit: updateHabit,
        getHabitDates: getHabitDates,
        getProfileData: getProfileData
      }}>
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
