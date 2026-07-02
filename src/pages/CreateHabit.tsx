import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Dropdown } from "../components/ui/Dropdown";

const days = [
  { label: "Mondays", value: "Mondays" },
  { label: "Sundays", value: "Sundays" }
];

export default function CreateHabit() {
  const { user, loading } = useAuth();

  if (loading) {
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />
  }

  return (
    <div className="min-h-screen pt-14 pb-12 px-48">
      <h1 className="font-bold text-3xl pb-12">Track a new habit</h1>

      <div className="flex flex-col gap-y-4">
        <Input
          id="title"
          caption="Enter a title for your habit"
          captionClassName="text-accent-ash"
          className="p-1 w-full border border-accent-taupe text-md font-light text-accent-ash"
        />

        <Input
          id="title"
          caption="Choose a metric, i.e. kilometer, minute, step:"
          captionClassName="text-accent-ash"
          className="p-1 w-full border border-accent-taupe text-md font-light text-accent-ash"
        />


        <div className="flex flex-col gap-y-1">
          <h2 className="text-accent-ash">Pick a day to start your week:</h2>
          <Dropdown options={days} placeholder="Choose Date" containerPos="" />
        </div>
      </div>
    </div>
  )
}
