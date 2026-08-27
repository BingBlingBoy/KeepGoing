import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext"
import { Searchbar } from "../components/ui/Searchbar";
import { Dropdown } from "../components/ui/Dropdown";
import HeatMap from "@uiw/react-heat-map";
import React, { useCallback, useEffect, useState } from "react";
import { colourPalette, type HabitBuckets, type UserHabit } from "../types";
import { Modal } from "../components/ui/Modal";
import { calcAverage, calcStdDev, calcTotal, formatCustomDate } from "../lib/helper";
import { Button } from "../components/ui/Button";
import { Check, CircleCheckBig, Hash, Menu, Pencil, Trash, TriangleAlert, X } from "lucide-react";
import { Input } from "../components/ui/Input";

const myOptions = [
  {
    label: (
      <>
        <Link
          to="/create-habit"
          className="w-full flex flex-col items-start justify-center gap-y-1 whitespace-normal"
          state={{ habit_type: "numbered" }}
        >
          <div className="flex flex-row items-center justify-center gap-x-2 text-md font-semibold">
            <Hash className="w-5 h-5 font-semibold" />
            Numbered
          </div>
          <p className="max-w-50 text-xs">Customisable unit, i.e. miles walked, pages read, or minutes meditated</p>
        </Link>
      </>
    ),
    value: "numbered"
  },
  {
    label: (
      <>
        <Link
          to="/create-habit"
          className="w-full flex flex-col items-start justify-center gap-y-1 whitespace-normal"
          state={{ habit_type: "checked" }}
        >
          <div className="flex flex-row items-center justify-center gap-x-2 text-md font-semibold">
            <CircleCheckBig className="w-5 h-5 font-semibold" />
            Checkbox
          </div>
          <p className="max-w-50 text-xs">Track a task that can only be done once i.e. Went to the gym, waking up before 7</p>
        </Link>
      </>
    ),
    value: "checked"
  },
];

export default function Habit() {
  const { user, getHabit, updateHabitDates, getHabitDates, deleteHabit } = useAuth();
  const [habits, setHabits] = useState<UserHabit[]>();
  const [storeDate, setStoreDate] = useState<{ habitId: string, dateStr: string, habitType: string } | null>(null);
  const [openModal, setOpenModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [countEntry, setCountEntry] = useState(1)
  const [habitDates, setHabitDates] = useState<Record<string, any>>({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [currentHabit, setCurrentHabit] = useState<UserHabit | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [subConfirmation, setSubConfirmation] = useState<boolean>(false)

  const navigate = useNavigate()

  const loadHabitData = useCallback(async () => {
    try {
      setErrorMessage(null)

      const resHabits = await getHabit()

      setHabits(resHabits)
      if (!resHabits || resHabits.length === 0) {
        setHabits([]);
        setHabitDates({});
        return;
      }

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
      setHabits([])
      setHabitDates({})
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
      await updateHabitDates(habit);
      await loadHabitData();
      setOpenModal(false)
    } catch (err) {
      setErrorMessage(err.message || "Unexpected error message")
    }
  }

  function triggerHabitModal(habitId: string, dateStr: string, habitType: string) {
    setCurrentHabit(null)
    const currentHabitData = habitDates[habitId] || [];

    const existingEntry = currentHabitData.find(entry => entry.date === dateStr);

    if (existingEntry) {
      setCountEntry(existingEntry.count);
    } else {
      setCountEntry(1);
    }

    setStoreDate({ habitId, dateStr, habitType })
    setOpenModal(true)
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />
  }

  function triggerEditModal(habitData: UserHabit) {
    navigate('/edit-habit', { state: { habitData } })
  }

  const filteredHabits = habits?.filter((habit) =>
    habit.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeHabitForModal = habits?.find(h => h.habit_id === storeDate?.habitId);

  async function handleHabitDelete(e: React.SubmitEvent) {
    e.preventDefault()
    try {
      await deleteHabit(currentHabit.habit_id)
      setSubConfirmation(true)
      setOpenModal(false)
    } catch (err) {
      setErrorMessage(err.message || "Unexpected error message")
      setOpenModal(true)
    } finally {
      await loadHabitData()
    }
  }

  return (
    <div className="p-8 md:p-20 flex flex-col max-w-240 items-center mx-auto">

      <div className="flex items-stretch justify-center w-full gap-x-2 md:gap-x-4">
        <Searchbar setSearchQuery={setSearchQuery} className="bg-background" />
        <Dropdown
          options={myOptions}
          placeholder="Create Habit"
          containerPos="right-1 top-12"
          buttonStyle="h-full"
        />
      </div>

      <div className="flex flex-col justify-center w-full flex-1 gap-y-10 py-10">
        {errorMessage && (
          errorMessage.includes('no habits found') ? (
            <div className="flex flex-col items-center justify-center py-10 text-accent-secondary">
              <p className="text-lg">You have no habits yet.</p>
              <p className="text-sm">Use the menu above to create your first one!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-y-2 w-full items-center justify-center">
              <X className="w-10 h-10 bg-red-300 text-red-100 text-xl rounded-full" />
              <p>Error: {errorMessage}</p>
            </div>
          )
        )}


        {filteredHabits && habitDates && (
          filteredHabits.map((habit) => {
            const currentDates = habitDates[habit.habit_id] || []
            const habitType = habit.habit_type

            function triggerDeleteModal() {
              setStoreDate(null)
              setCurrentHabit(habit)
              setOpenModal(true)
            }

            const menuOptions = [
              {
                label: (
                  <>
                    <Pencil className='w-5 h-5' />
                    <span className="">Edit</span>
                  </>
                ),
                value: 'edit-button'
              },
              {
                label: (
                  <>
                    <Trash className='w-5 h-5 text-red-500' />
                    <span className="text-red-500">Delete</span>
                  </>
                ),
                value: 'delete-button'
              }
            ];

            return (
              <div key={habit.habit_id} >
                <div className="flex flex-row justify-between items-center mb-2">
                  <p className="text-accent-primary">{habit.title}</p>
                  <Dropdown
                    options={menuOptions}
                    placeholder={<Menu className="w-6 h-6" />}
                    containerPos="right-0 top-12"
                    chevron={false}
                    buttonStyle="bg-transparent border-transparent"
                    onChange={(value) => {
                      switch (value) {
                        case 'delete-button':
                          triggerDeleteModal()
                          break
                        case 'edit-button':
                          triggerEditModal(habit)
                          break
                      }
                    }}
                  />
                </div>
                <div className="border border-accent-primary p-5 flex items-center justify-center flex-col">
                  <HeatMap
                    key={habit.habit_id}
                    value={currentDates}
                    weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
                    startDate={new Date(habit.startDate)}
                    style={{
                      color: 'var(--accent-primary-color)'
                    }}
                    className="w-full"
                    panelColors={colourPalette[habit.colour]}
                    rectRender={(props, data) => {

                      return (
                        <rect
                          {...props}
                          onClick={() => triggerHabitModal(habit.habit_id, data.date, habitType)}
                          className="cursor-pointer transition-colors duration-200"
                        />
                      );
                    }}
                  />
                  <div className="w-full flex flex-col">
                    {habit.average && (
                      <p className="text-sm"><span className="text-accent-primary">Average: </span> {String(calcAverage(currentDates).toFixed(2))}</p>
                    )}
                    {habit.sd && (
                      <p className="text-sm"><span className="text-accent-primary">Standard Deviation: </span> {String(calcStdDev(currentDates).toFixed(2))}</p>
                    )}
                    {habit.total && (
                      <p className="text-sm"><span className="text-accent-primary">Total: </span>{String(calcTotal(currentDates))}</p>
                    )}
                    {habit.numofdays && (
                      <p className="text-sm"><span className="text-accent-primary">Number of Days:</span> {currentDates.length}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <Modal open={openModal} onClose={() => {
          setOpenModal(false)
          return
        }}>
          {activeHabitForModal && storeDate && (
            <form onSubmit={submitEntry} className="w-full flex justify-between items-start flex-col gap-y-2 bg-background">
              <h1 className="text-xl font-bold">{activeHabitForModal.title}</h1>
              <div className="flex justify-start gap-x-8 w-full mt-4">
                <p className="font-semibold">Date:</p>
                <p>{formatCustomDate(storeDate.dateStr)}</p>
              </div>
              <div className="flex justify-start gap-x-8 w-full">
                {
                  storeDate.habitType === 'numbered' && (
                    <div>
                      <p>Count:</p>
                      <input
                        value={countEntry}
                        type="number"
                        min="0"
                        onChange={(e) => setCountEntry(Number(e.target.value))}
                        className="w-full px-2"
                      />
                    </div>
                  )
                }
              </div>
              <div className="w-full flex items-center justify-end pt-8">
                <Button type="submit" variant="primary" size="md" className="rounded-md bg-green-300">
                  Save
                </Button>
              </div>
            </form>
          )}
          {
            currentHabit && (
              <form onSubmit={handleHabitDelete} className="flex justify-between items-start flex-col gap-y-4 bg-background">
                <div>
                  <h1 className="text-red-300">Delete Habit</h1>
                  <p className="text-accent-secondary">Habit: {currentHabit.title}</p>
                </div>
                <p className="text-accent-primary">
                  <TriangleAlert className="inline-block w-6 h-6 text-orange-800 mr-1.5 align-text-bottom" />
                  Deleting this habit is permanent.
                  To proceed, type in the full name of your habit (case sensitive) in the input box below.
                </p>
                <Input
                  id='habit_name'
                  caption='Habit name:'
                  placeholder={currentHabit.title}
                  className="p-1 w-full border border-accent-secondary text-md font-light text-accent-primary"
                  captionClassName="text-accent-secondary"
                  divClass="w-full"
                  onChange={(e) => { setDeleteConfirmation(e.target.value) }}
                />
                <div className="w-full flex justify-end">
                  <Button
                    type='submit'
                    variant="primary"
                    size="md"
                    className="rounded-sm bg-red-300"
                    disabled={deleteConfirmation !== currentHabit.title}
                  >
                    Delete Habit
                  </Button>
                </div>
              </form>
            )
          }
        </Modal>
        <Modal open={subConfirmation} onClose={() => setSubConfirmation(false)}>
          <div className="flex flex-col gap-y-2 w-full items-center justify-center">
            <Check className="w-10 h-10 bg-green-300 text-green-100 rounded-full" />
            <div className="flex flex-col gap-y-1 w-full items-center">
              <h1 className="text-xl font-semibold">Success</h1>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
