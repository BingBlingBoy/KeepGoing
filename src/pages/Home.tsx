import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/habit" replace />
  }

  return <div>Home page</div>
}
