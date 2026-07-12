import { Link, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext"
import { Searchbar } from "../components/ui/Searchbar";
import { Dropdown } from "../components/ui/Dropdown";
import HeatMap from "@uiw/react-heat-map";
import { useEffect, useState } from "react";
import type { UserHabit } from "../types";
import { Modal } from "../components/ui/Modal";
import { formatCustomDate } from "../lib/helper";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

const myOptions = [
  {
    label:
      <Link to="/create-habit" className="w-full h-8 bg-red-300 flex items-center justify-center">Create Habit</Link>,
    value: "create-habit"
  },
];

export default function Habit() {
  const { user, loading, getHabit } = useAuth();
  const [habits, setHabits] = useState<UserHabit[]>();
  const [storeDate, setStoreDate] = useState<{ habitId: string, dateStr: string } | null>(null);
  const [openModal, setOpenModal] = useState(false)
  const [query, setQuery] = useState("")

  function triggerModal(habitId: string, dateStr: string) {
    setStoreDate({ habitId, dateStr })
    console.log(storeDate)
    setOpenModal(true)
  }

  if (loading) {
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />
  }

  useEffect(() => {
    try {
      async function loadHabit() {
        const res = await getHabit()
        setHabits(res)
        console.log(res)
      }
      loadHabit()
    } catch (err) {
      console.log(`${err}`)
    }
  }, [])

  function submitEntry() {

  }

  return (
    <>
      <div className="p-20 flex flex-col items-center">

        <div className="flex items-center justify-center w-full max-w-[40rem]">
          <Searchbar className="border border-black-200" />
          <Dropdown options={myOptions} placeholder="Create Habit" containerPos="right-1 top-12" />
        </div>

        <div className="flex flex-col p-10 justify-center max-w-[40rem] w-full flex-1 mx-auto gap-y-10">
          {habits && (
            habits.map((habit) => (
              <>
                <div key={habit.habit_id} >
                  <p>{habit.title}</p>
                  <div className="border border-accent-ash p-5 flex items-center justify-center">
                    <HeatMap
                      weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
                      startDate={new Date('2024/01/01')}
                      className="w-full"
                      rectRender={(props, data) => {

                        return (
                          <rect
                            {...props}
                            onClick={() => triggerModal(habit.habit_id, data.date)}
                            className="cursor-pointer transition-colors duration-200"
                          />
                        );
                      }}
                    />
                  </div>
                </div>
                <Modal open={openModal} onClose={() => setOpenModal(false)}>
                  <form onSubmit={submitEntry} className="w-full flex justify-between items-start flex-col gap-y-2">
                    <h1>{habit.title}</h1>
                    <div className="flex justify-start gap-x-8 w-full">
                      <p>Date:</p>
                      <p>{storeDate && formatCustomDate(storeDate.dateStr)}</p>
                    </div>
                    <div className="flex justify-start gap-x-8 w-full">
                      <p>{habit.title}:</p>
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full px-2"
                        placeholder="HELLO"
                      />
                    </div>
                    <div className="w-full flex items-center justify-end pt-8">
                      <Button type="submit" variant="primary" size="md" className="rounded-md">
                        Save
                      </Button>
                    </div>
                  </form>
                </Modal>
              </>
            ))
          )}
        </div>

      </div>
    </>
  )
}
