import { Link, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext"
import { Searchbar } from "../components/ui/Searchbar";
import { Dropdown } from "../components/ui/Dropdown";

const myOptions = [
  {
    label:
      <Link to="/create-habit" className="w-full h-8 bg-red-300 flex items-center justify-center">Create Habit</Link>,
    value: "create-habit"
  },
];

export default function Habit() {
  const { user, loading } = useAuth();

  if (loading) {
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />
  }

  return (
    <>
      <div className="py-20">
        <div className="flex items-center justify-center">
          <Searchbar className="border border-amber-200" />
          <Dropdown options={myOptions} placeholder="Create Habit" />
        </div>
      </div>
    </>
  )
}
