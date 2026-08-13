import { Link, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext"
import { Searchbar } from "../components/ui/Searchbar";
import { Dropdown } from "../components/ui/Dropdown";
import HeatMap from "@uiw/react-heat-map";
import { useCallback, useEffect, useState } from "react";
import { colourPalette, dropdownColours, type HabitBuckets, type UserHabit } from "../types";
import { Modal } from "../components/ui/Modal";
import { calcAverage, calcStdDev, calcTotal, formatCustomDate } from "../lib/helper";
import { Button } from "../components/ui/Button";
import { X } from "lucide-react";

const myOptions = [
  {
    label:
      <Link to="/create-habit" className="w-full h-8 bg-red-300 flex items-center justify-center">Create Habit</Link>,
    value: "create-habit"
  },
];

export default function Habit() {
  const { user, loading, getHabit, updateHabit, getHabitDates } = useAuth();
  const [habits, setHabits] = useState<UserHabit[]>();
  const [storeDate, setStoreDate] = useState<{ habitId: string, dateStr: string } | null>(null);
  const [openModal, setOpenModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [countEntry, setCountEntry] = useState(1)
  const [habitDates, setHabitDates] = useState<Record<string, any>>({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null)


  function triggerModal(habitId: string, dateStr: string) {
    const currentHabitData = habitDates[habitId] || [];

    const existingEntry = currentHabitData.find(entry => entry.date === dateStr);

    if (existingEntry) {
      setCountEntry(existingEntry.count);
    } else {
      setCountEntry(1);
    }

    setStoreDate({ habitId, dateStr })
    console.log(storeDate)
    setOpenModal(true)
  }

  if (loading) {
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />
  }

  const loadHabitData = useCallback(async () => {
    try {
      const resHabits = await getHabit()
      setHabits(resHabits)

      const datesPerHabit: Record<string, any> = {}

      for (const habit of resHabits) {
        const dates = await getHabitDates(habit.habit_id)

        if (!dates || dates.length === 0) continue;

        const collectedDates = [];

        for (const date of dates) {
          const d = new Date(date.bucket_date)

          const year = d.getFullYear()
          const month = String(d.getMonth() + 1).padStart(2, "0")
          const day = String(d.getDate()).padStart(2, "0")

          const formattedDate = `${year}/${month}/${day}`
          collectedDates.push({
            date: formattedDate,
            count: date.event_count
          })
        }
        datesPerHabit[habit.habit_id] = collectedDates
      }
      setHabitDates(datesPerHabit);

    } catch (err) {
      console.error(`${err}`)
      setErrorMessage(err.message || "Unexpected Error Has Occured")
    }
  }, [getHabit, getHabitDates])

  useEffect(() => {
    if (user) {
      loadHabitData();
    }
  }, [user, loadHabitData])

  async function submitEntry(e: React.SubmitEvent) {
    e.preventDefault()

    const habit: HabitBuckets = {
      habit_id: storeDate.habitId as HabitBuckets['habit_id'],
      bucket_date: storeDate.dateStr as HabitBuckets['bucket_date'],
      event_count: countEntry as HabitBuckets['event_count']
    }
    try {
      await updateHabit(habit);
      await loadHabitData();
      setOpenModal(false)
    } catch (err) {
      console.log(`Error has occured: ${err}`)
    }
  }

  const filteredHabits = habits?.filter((habit) =>
    habit.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeHabitForModal = habits?.find(h => h.habit_id === storeDate?.habitId);

  return (
    <>
      <div className="p-20 flex flex-col items-center">

        <div className="flex items-center justify-center w-full max-w-160">
          <Searchbar setSearchQuery={setSearchQuery} className="border border-black-200" />
          <Dropdown options={myOptions} placeholder="Create Habit" containerPos="right-1 top-12" />
        </div>

        <div className="flex flex-col p-10 justify-center max-w-160 w-full flex-1 mx-auto gap-y-10">
          {
            errorMessage && (
              <div className="flex flex-col gap-y-2 w-full items-center justify-center">
                <X className="w-10 h-10 bg-red-300 text-red-100 text-xl rounded-full" />
                <p>Error: {errorMessage}</p>
              </div>
            )
          }
          {filteredHabits && habitDates && (
            filteredHabits.map((habit) => {
              const currentDates = habitDates[habit.habit_id] || []

              return (
                <div key={habit.habit_id} >
                  <p>{habit.title}</p>
                  <div className="border border-accent-ash p-5 flex items-center justify-center flex-col">
                    <HeatMap
                      value={currentDates}
                      weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
                      startDate={new Date(habit.startDate)}
                      className="w-full"
                      panelColors={colourPalette[habit.colour]}
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
                    <div className="w-full flex flex-col">
                      {habit.average && (
                        <p>Average: {String(calcAverage(currentDates).toFixed(2))}</p>
                      )}
                      {habit.sd && (
                        <p>Standard Deviation: {String(calcStdDev(currentDates).toFixed(2))}</p>
                      )}
                      {habit.total && (
                        <p>Total: {String(calcTotal(currentDates))}</p>
                      )}
                      {habit.numOfDays && (
                        <p>Number of Days: {currentDates.length}</p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            {activeHabitForModal && storeDate && (
              <form onSubmit={submitEntry} className="w-full flex justify-between items-start flex-col gap-y-2">
                <h1 className="text-xl font-bold">{activeHabitForModal.title}</h1>
                <div className="flex justify-start gap-x-8 w-full mt-4">
                  <p className="font-semibold">Date:</p>
                  <p>{formatCustomDate(storeDate.dateStr)}</p>
                </div>
                <div className="flex justify-start gap-x-8 w-full">
                  <p>Count:</p>
                  <input
                    value={countEntry}
                    type="number"
                    min="0"
                    onChange={(e) => setCountEntry(Number(e.target.value))}
                    className="w-full px-2"
                  />
                </div>
                <div className="w-full flex items-center justify-end pt-8">
                  <Button type="submit" variant="primary" size="md" className="rounded-md">
                    Save
                  </Button>
                </div>
              </form>
            )}
          </Modal>
        </div>

      </div>
    </>
  )
}
