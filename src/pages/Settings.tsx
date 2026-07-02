import { Navigate, useNavigate } from "react-router";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext"

export default function Settings() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  if (loading) {
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />
  }

  return (
    <Button variant="primary" size="md" onClick={handleSignOut}>Sign Out</Button>
  )
}
