import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Dropdown } from "../components/ui/Dropdown";
import HeatMap from '@uiw/react-heat-map';
import { Button } from "../components/ui/Button";
import { useState } from "react";

const days = [
  { label: "Mondays", value: "Mondays" },
  { label: "Sundays", value: "Sundays" }
];

const colours = [
  { label: "Amber", value: "amber", bgClass: "bg-amber-300" },
  { label: "Red", value: "red", bgClass: "bg-red-400" },
]

const value = [
  { date: '2016/01/11', count: 2 },
  { date: '2016/01/12', count: 20 },
  { date: '2016/01/13', count: 10 },
  ...[...Array(17)].map((_, idx) => ({
    date: `2016/02/${idx + 10}`, count: idx, content: ''
  })),
  { date: '2016/04/11', count: 2 },
  { date: '2016/05/01', count: 5 },
  { date: '2016/05/02', count: 5 },
  { date: '2016/05/04', count: 11 },
  { date: '2016/12/04', count: 11 },
  { date: '2017/03/09', count: 11 },
];

export default function CreateHabit() {
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    metric: "",
    startDate: "",
    average: false,
    sd: false,
    total: false,
    numOfDays: false,
    colour: "red"
  })

  function updateForm(field: string, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  if (loading) {
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />
  }

  async function handleForm(e: React.SubmitEvent) {
    e.preventDefault();
    console.log("HELLO")
  }

  return (
    <div className="min-h-screen pt-14 pb-12 px-48">
      <h1 className="font-bold text-3xl pb-12">Track a new habit</h1>

      <form onSubmit={handleForm} className="flex flex-col gap-y-4">
        <Input
          id="title"
          caption="Enter a title for your habit"
          captionClassName="text-accent-ash"
          value={formData.title}
          onChange={(e) => { updateForm("title", e.target.value) }}
          className="p-1 w-full border border-accent-taupe text-md font-light text-accent-ash"
        />

        <Input
          id="metric"
          caption="Choose a metric, i.e. kilometer, minute, step:"
          captionClassName="text-accent-ash"
          value={formData.metric}
          onChange={(e) => { updateForm("metric", e.target.value) }}
          className="p-1 w-full border border-accent-taupe text-md font-light text-accent-ash"
        />


        <div className="flex flex-col gap-y-1">
          <h2 className="text-accent-ash">Pick a day to start your week:</h2>
          <Dropdown
            options={days}
            placeholder="Choose Date"
            containerPos=""
            value={formData.startDate}
            onChange={(e) => { updateForm("startDate", e) }}
          />
        </div>

        <h2 className="text-accent-ash">Select your desired statistics:</h2>
        <label className="flex flex-col items-start p-3 -ml-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors group has-[:checked]:bg-gray-100">
          <div className="flex flex-row items-center gap-x-3">
            <input
              type="checkbox"
              name="average"
              className="w-5 h-5 cursor-pointer"
              value="average"
              onChange={(e) => { updateForm("average", e.currentTarget.checked) }}
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
              name="sd"
              className="w-5 h-5 cursor-pointer"
              value="sd"
              onChange={(e) => { updateForm("sd", e.currentTarget.checked) }}
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
              name="total"
              className="w-5 h-5 cursor-pointer"
              value="total"
              onChange={(e) => { updateForm("total", e.currentTarget.checked) }}
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
              name="numOfDays"
              className="w-5 h-5 cursor-pointer"
              value="numOfDays"
              onChange={(e) => { updateForm("numOfDays", e.currentTarget.checked) }}
            />
            <h2 className="text-xl font-bold">Number of Days</h2>
          </div>
          <p className="text-sm pl-8 text-gray-600 group-hover:text-gray-900 transition-colors">
            Number of entries recorded.
          </p>
        </label>

        <div className="flex flex-col gap-y-1">
          <h2 className="text-accent-ash">Pick a colour:</h2>
          <Dropdown
            options={colours}
            placeholder="Choose a colour"
            containerPos=""
            value={formData.colour}
            onChange={(e) => { updateForm("colour", e) }}
          />
        </div>

        <h2 className="font-bold text-2xl pt-8 pb-4">Preview</h2>
        <div className="border border-accent-ash p-5 flex items-center justify-center">
          <HeatMap
            value={value}
            weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
            startDate={new Date('2016/01/01')}
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-end pt-8">
          <Button type="submit" variant="primary" size="md" className="rounded-md">
            Create Habit
          </Button>
        </div>
      </form>

    </div>
  )
}
