import { useNavigate } from "react-router";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext"

export default function Settings() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  return (
    <Button variant="primary" size="md" onClick={handleSignOut}>Sign Out</Button>
  )
}
