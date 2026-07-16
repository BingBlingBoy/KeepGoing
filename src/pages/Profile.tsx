import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import profile_pic from "../assets/profile_pic.png"
import { useCallback, useEffect, useState } from "react";
import type { ProfileData } from "../types";

export default function Profile() {
  const { user, loading, getProfileData } = useAuth();
  const [profile, setProfile] = useState<ProfileData>()

  if (loading) {
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />
  }

  const loadProfileData = useCallback(async () => {
    try {
      const res = await getProfileData(user.id);
      setProfile(res[0])
    } catch (err) {
      console.error(`Error has occured when getting profile data`)
    }
  }, [getProfileData])

  useEffect(() => {
    console.log("user: ", user)
    loadProfileData()
  }, [user, loadProfileData])

  return (
    <div className="p-20 flex items-center justify-center">
      <div className="w-full flex justify-start items-center gap-x-4">
        <img className="w-20 h-20 p-1 rounded-full ring-2 ring-accent-taupe" src={profile_pic} alt="Rounded Avatar" />
        <div className="flex flex-col">
          <h1 className="text-3xl font-semibold">{user.name}</h1>
          <p>Login Count: {profile && profile.login_count}</p>
        </div>
      </div>
    </div>
  )
}
