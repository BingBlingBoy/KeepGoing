import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import profile_pic from "../assets/profile_pic.png"
import { useEffect } from "react";

export default function Profile() {
  const { user, loading } = useAuth();

  if (loading) {
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />
  }

  useEffect(() => {
    console.log("user: ", user)
  }, [user])

  return (
    <div className="p-20 flex items-center justify-center">
      <div className="w-full flex justify-start items-center gap-x-4">
        <img className="w-20 h-20 p-1 rounded-full ring-2 ring-accent-taupe" src={profile_pic} alt="Rounded Avatar" />
        <div className="flex flex-col">
          <h1 className="text-3xl font-semibold">{user.name}</h1>
          <p>asdfas</p>
        </div>
      </div>
    </div>
  )
}
