import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext"

export default function Habit() {
  const { user, loading } = useAuth();

  if (loading) {
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />
  }

  return <div>Habit page</div>
}
