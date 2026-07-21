import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import profile_pic from "../assets/profile_pic.png"
import { useCallback, useEffect, useRef, useState } from "react";
import { colourPalette, type ProfileData, type UserHabit } from "../types";
import HeatMap from "@uiw/react-heat-map";
import { calcAverage, calcStdDev, calcTotal, formatCustomDate } from "../lib/helper";
import { Modal } from "../components/ui/Modal";

export default function Profile() {
  const { user, loading, getProfileData, getHabit, getHabitDates } = useAuth();
  const [profile, setProfile] = useState<ProfileData>()
  const [habit, setHabit] = useState<UserHabit[]>()
  const [countEntry, setCountEntry] = useState(1)
  const [habitDates, setHabitDates] = useState<Record<string, any>>()
  const [storeDate, setStoreDate] = useState<{ habitId: string, dateStr: string } | null>(null);
  const [openModal, setOpenModal] = useState(false)

  const fileInputRef = useRef(null)

  if (loading) {
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />
  }

  function handleProfileClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      console.log("Selected file:", file)
      console.log("filepath:", file.filepath)
    }
  }


  function triggerModal(habitId: string, dateStr: string) {
    const currentHabitData = habitDates[habitId] || [];

    const existingEntry = currentHabitData.find(entry => entry.date === dateStr);

    if (existingEntry) {
      setCountEntry(existingEntry.count);
    } else {
      setCountEntry(1);
    }

    setStoreDate({ habitId, dateStr })
    setOpenModal(true)
  }

  const loadProfileData = useCallback(async () => {
    try {
      const res = await getProfileData(user.id);
      setProfile(res[0])
    } catch (err) {
      console.error(`Error has occured when getting profile data: ${err}`)
    }
  }, [getProfileData])

  const loadHabitData = useCallback(async () => {
    try {
      const resHabits = await getHabit();
      setHabit(resHabits);

      const datesPerHabit: Record<string, any> = {}
      for (const habit of resHabits) {
        const dates = await getHabitDates(habit.habit_id)
        if (!dates || dates.length === 0) continue;

        const collectedDates = []

        for (const date of dates) {
          const d = new Date(date.bucket_date)
          const year = String(d.getFullYear())
          const month = String(d.getMonth() + 1).padStart(2, "0")
          const day = String(d.getDate()).padStart(2, "0")

          const formattedDate = `${year}/${month}/${day}`
          collectedDates.push(
            {
              date: formattedDate,
              count: date.event_count
            }
          )
        }
        datesPerHabit[habit.habit_id] = collectedDates
      }
      setHabitDates(datesPerHabit)
    } catch (err) {
      console.error(`Error has occured when getting habit data: ${err}`)
    }
  }, [getHabit, getHabitDates])

  useEffect(() => {
    if (user) {
      loadProfileData()
      loadHabitData()
    }
  }, [user, loadProfileData, loadHabitData])

  const activeHabitForModal = habit?.find(h => h.habit_id === storeDate?.habitId);

  return (
    <div className="p-20 flex items-center justify-center flex-col gap-y-8">
      <div className="w-full flex justify-start items-center gap-x-4">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <img
          onClick={handleProfileClick}
          className="w-20 h-20 p-1 rounded-full ring-2 ring-accent-taupe cursor-pointer"
          src={profile_pic}
          alt="Rounded Avatar"
        />
        <div className="flex flex-col">
          <h1 className="text-3xl font-semibold">{user.name}</h1>
          <p>Login Count: {profile && profile.login_count}</p>
        </div>
      </div>
      {habit && habitDates && (
        habit.map((h) => (
          <>
            <div className="w-full" key={h.habit_id}>
              <p>{h.title}</p>
              <div className="border border-accent-ash p-5 flex items-center justify-center flex-col">
                <HeatMap
                  value={habitDates[h.habit_id] || []}
                  weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
                  startDate={new Date(h.startDate)}
                  className="w-full"
                  panelColors={colourPalette[h.colour]}
                  rectRender={(props, data) => {

                    return (
                      <rect
                        {...props}
                        onClick={() => triggerModal(h.habit_id, data.date)}
                        className="cursor-pointer transition-colors duration-200"
                      />
                    );
                  }}
                />
                <div className="w-full flex flex-col">
                  {h.average && (
                    <p>Average: {String(calcAverage(habitDates[h.habit_id] || []).toFixed(2))}</p>
                  )}
                  {h.sd && (
                    <p>Standard Deviation: {String(calcStdDev(habitDates[h.habit_id] || []).toFixed(2))}</p>
                  )}
                  {h.total && (
                    <p>Total: {String(calcTotal(habitDates[h.habit_id] || []))}</p>
                  )}
                  {h.numOfDays && (
                    <p>Number of Days: {habitDates[h.habit_id] || []}</p>
                  )}
                </div>
              </div>
            </div>
          </>
        ))
      )}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        {activeHabitForModal && storeDate && (
          <form className="w-full flex justify-between items-start flex-col gap-y-2">
            <h1 className="text-xl font-bold">{activeHabitForModal.title}</h1>
            <div className="flex justify-start gap-x-8 w-full mt-4">
              <p className="font-semibold">Date:</p>
              <p>{formatCustomDate(storeDate.dateStr)}</p>
            </div>
            <div className="flex justify-start gap-x-8 w-full">
              <p className="font-semibold">Count:</p>
              <p>{countEntry}</p>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
