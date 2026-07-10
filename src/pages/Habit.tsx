import { Link, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext"
import { Searchbar } from "../components/ui/Searchbar";
import { Dropdown } from "../components/ui/Dropdown";
import HeatMap from "@uiw/react-heat-map";
import { useEffect, useState } from "react";

const myOptions = [
  {
    label:
      <Link to="/create-habit" className="w-full h-8 bg-red-300 flex items-center justify-center">Create Habit</Link>,
    value: "create-habit"
  },
];

export default function Habit() {
  const { user, loading, getHabit } = useAuth();
  const [habits, setHabits] = useState();

  if (loading) {
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />
  }

  useEffect(() => {
    try {
      async function loadHabit() {
        const res = await getHabit()
        console.log(`res: ${res}`)
        setHabits(res)
      }
      loadHabit()
    } catch (err) {
      console.log(`${err}`)
    }
  }, [])

  return (
    <>
      <div className="p-20 flex flex-col items-center">

        <div className="flex items-center justify-center w-full max-w-[40rem]">
          <Searchbar className="border border-amber-200" />
          <Dropdown options={myOptions} placeholder="Create Habit" containerPos="right-1 top-12" />
        </div>

        <div className="flex flex-col p-10 justify-center max-w-[40rem] w-full flex-1 mx-auto">
          <div className="border border-accent-ash p-5 flex items-center justify-center">
            <HeatMap
              weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
              startDate={new Date('2016/01/01')}
              className="w-full"
            />
            {habits && (
              habits.map((habit) => {
                console.log(habit)
              })
            )}
          </div>
        </div>

      </div>
    </>
  )
}
