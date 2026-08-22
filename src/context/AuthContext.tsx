import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { DisplayForm, HabitBuckets, NewUsernameForm, ProfileData, User, UserHabit } from "../types"
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
  // getProfileData: (habitId: string) => Promise<ProfileData[]>;
  getProfileData: (habitId: string) => Promise<void>;
  updateNewUsername: (
    userData: NewUsernameForm
  ) => Promise<void>;
  deleteUser: () => Promise<void>;
  updateDisplayPref: (
    userData: DisplayForm
  ) => Promise<void>;
  deleteHabit: (
    habitId: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null)

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [neonUser, setNeonUser] = useState<any>(null)
  const [neonToken, setNeonToken] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState<ProfileData>()

  // Need to call the auth client if a user has already signed in
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await authClient.getSession()
        setLoading(true);
        if (res && res.data?.user) {
          const currentToken = res.data.session.token
          console.log('currentToken', currentToken)
          setNeonUser(res.data.user)
          setNeonToken(currentToken)
          await saveProfileData(res.data.user.id, currentToken)
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

    return await api.saveHabit(habit_uuid, neonUser.id, habitData, neonToken);
  }

  async function getHabit(): Promise<UserHabit[]> {
    if (!neonUser) {
      throw new Error("User must be authenticated to save habit")
    }

    return await api.getHabit(neonUser.id, neonToken)
  }

  async function getHabitDates(
    habitId: string
  ): Promise<HabitBuckets[]> {
    return await api.getHabitDates(habitId, neonToken)
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
    return await api.updateHabit(habitData, neonToken)
  }

  // Profile
  async function saveProfileData(userId: string, token: string) {
    await api.saveProfile(userId, token)
  }

  async function getProfileData(userId: string) {
    if (profileData) {
      return profileData
    }

    const res = await api.getProfile(userId, neonToken)
    setProfileData(res)
    return res
  }

  // Settings
  async function updateNewUsername(
    userData: NewUsernameForm
  ) {
    const userId = neonUser.id
    await api.updateUsername(userData, userId, neonToken)
  }

  async function deleteUser() {
    const userId = neonUser.id
    await api.deleteUser(userId, neonToken)
    await authClient.signOut();
  }

  async function updateDisplayPref(
    displayData: DisplayForm
  ) {
    const userId = neonUser.id
    await api.updateUserPref(displayData, userId, neonToken)
  }

  async function deleteHabit(
    habitId: string
  ) {
    const userId = neonUser.id
    const res = await api.deleteHabit(habitId, neonToken, { userId })
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
        getProfileData: getProfileData,
        updateNewUsername: updateNewUsername,
        deleteUser: deleteUser,
        updateDisplayPref: updateDisplayPref,
        deleteHabit: deleteHabit
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
