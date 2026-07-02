import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Dropdown } from "../components/ui/Dropdown";

const days = [
  { label: "Mondays", value: "Mondays" },
  { label: "Sundays", value: "Sundays" }
];

const colours = [
  { label: "Amber", value: "amber", bgClass: "bg-amber-300" },
]

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

        <h2 className="text-accent-ash">Select your desired statistics:</h2>
        <label className="flex flex-col items-start p-3 -ml-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors group has-[:checked]:bg-gray-100">
          <div className="flex flex-row items-center gap-x-3">
            <input
              type="checkbox"
              name="average"
              className="w-5 h-5 cursor-pointer"
            />
            <h2 className="text-xl font-bold">Average</h2>
          </div>
          <p className="text-sm pl-8 text-gray-600 group-hover:text-gray-900 transition-colors">
            Statistical average of your entries.
          </p>
        </label>

        <label className="flex flex-col items-start p-3 -ml-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors group has-[:checked]:bg-gray-100">
          <div className="flex flex-row items-center gap-x-3">
            <input
              type="checkbox"
              name="average"
              className="w-5 h-5 cursor-pointer"
            />
            <h2 className="text-xl font-bold">Standard deviation</h2>
          </div>
          <p className="text-sm pl-8 text-gray-600 group-hover:text-gray-900 transition-colors">
            Statistical measure of dispersion, how much your entries vary.
          </p>
        </label>

        <label className="flex flex-col items-start p-3 -ml-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors group has-[:checked]:bg-gray-100">
          <div className="flex flex-row items-center gap-x-3">
            <input
              type="checkbox"
              name="average"
              className="w-5 h-5 cursor-pointer"
            />
            <h2 className="text-xl font-bold">Total</h2>
          </div>
          <p className="text-sm pl-8 text-gray-600 group-hover:text-gray-900 transition-colors">
            Sum of all your entries.
          </p>
        </label>

        <label className="flex flex-col items-start p-3 -ml-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors group has-[:checked]:bg-gray-100">
          <div className="flex flex-row items-center gap-x-3">
            <input
              type="checkbox"
              name="average"
              className="w-5 h-5 cursor-pointer"
            />
            <h2 className="text-xl font-bold">Number of Days</h2>
          </div>
          <p className="text-sm pl-8 text-gray-600 group-hover:text-gray-900 transition-colors">
            Number of entries recorded.
          </p>
        </label>

        <div className="flex flex-col gap-y-1">
          <h2 className="text-accent-ash">Pick a colour:</h2>
          <Dropdown options={colours} placeholder="Choose a colour" containerPos="" />
        </div>
      </div>
    </div>
  )
}
