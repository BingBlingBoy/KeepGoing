import { Navigate, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Dropdown } from "../components/ui/Dropdown";
import HeatMap from '@uiw/react-heat-map';
import { Button } from "../components/ui/Button";
import { useMemo, useState } from "react";
import { colourPalette, dropdownColours, type UserHabit } from "../types";
import { calcAverage, calcStdDev, calcTotal, generateRealistic } from "../lib/helper";
import { Modal } from "../components/ui/Modal";
import { Check, X } from "lucide-react";

interface IsBlank {
  isBlank: boolean;
}

interface FormError {
  title: IsBlank;
  metric: IsBlank;
}

export default function CreateHabit() {
  const { user, saveHabit } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formError, setFormError] = useState<FormError | null>(null);
  const [subConfirmation, setSubConfirmation] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    title: "",
    metric: "",
    startDate: "",
    average: false,
    sd: false,
    total: false,
    numofdays: false,
    colour: "red"
  })
  const [openModal, setOpenModal] = useState(false)

  const navigate = useNavigate();

  function updateForm(field: string, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }


  if (!user) {
    return <Navigate to="/auth/sign-in" replace />
  }

  const year = new Date().getFullYear();
  const generateRandomHeatmap = useMemo(() =>
    generateRealistic(year)
    , [year])

  async function handleForm(e: React.SubmitEvent) {
    e.preventDefault();

    const habit: Omit<UserHabit, "user_id" | "habit_id" | "updatedAt" | "startDate"> = {
      title: formData.title as UserHabit["title"],
      metric: formData.metric as UserHabit["metric"],
      average: formData.average as UserHabit["average"],
      sd: formData.sd as UserHabit["sd"],
      total: formData.total as UserHabit["total"],
      numofdays: formData.numofdays as UserHabit["numofdays"],
      colour: formData.colour as UserHabit["colour"]
    }

    const currentFormErrors = {
      title: { isBlank: !habit.title },
      metric: { isBlank: !habit.metric }
    }

    if (!habit.title || !habit.metric) {
      setFormError(currentFormErrors)
      setOpenModal(true);
      return;
    }

    try {
      await saveHabit(habit);
      setSubConfirmation(true)
      setOpenModal(true)
      setTimeout(() => navigate("/habit"), 1000)
    } catch (err) {
      console.error("Failed to save:", err);
      setSubmitError(err.message || "An unexpected error has occured")
      setOpenModal(true)
    }
  }

  const titleError = formError?.title?.isBlank;
  const metricError = formError?.metric?.isBlank;

  return (
    <div className="min-h-screen pt-14 pb-12 px-48 max-w-280 mx-auto">
      <h1 className="font-bold text-3xl pb-12">Track a new habit</h1>

      <form onSubmit={handleForm} className="flex flex-col gap-y-4">
        <Input
          id="title"
          caption="Enter a title for your habit"
          captionClassName={`${titleError ? "text-red-500" : "border-accent-primary"}`}
          value={formData.title}
          onChange={(e) => { updateForm("title", e.target.value) }}
          className={`
            border
            ${titleError ? `border-red-500` : `border-accent-primary`}
            p-1 w-full text-md font-light
          `}
        />

        <Input
          id="metric"
          caption="Choose a metric, i.e. kilometer, minute, step:"
          captionClassName={`${metricError ? "text-red-500" : "border-accent-primary"}`}
          value={formData.metric}
          onChange={(e) => { updateForm("metric", e.target.value) }}
          className={`
            border
            ${metricError ? `border-red-500` : `border-accent-primary`}
            p-1 w-full text-md font-light
          `}
        />

        <h2 className="text-accent-ash">Select your desired statistics:</h2>
        <label className="flex flex-col items-start p-3 -ml-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors group has-checked:bg-gray-100">
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

        <label className="flex flex-col items-start p-3 -ml-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors group has-checked:bg-gray-100">
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

        <label className="flex flex-col items-start p-3 -ml-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors group has-checked:bg-gray-100">
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

        <label className="flex flex-col items-start p-3 -ml-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors group has-checked:bg-gray-100">
          <div className="flex flex-row items-center gap-x-3">
            <input
              type="checkbox"
              name="numOfDays"
              className="w-5 h-5 cursor-pointer"
              value="numOfDays"
              onChange={(e) => { updateForm("numofdays", e.currentTarget.checked) }}
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
            options={dropdownColours}
            placeholder="Choose a colour"
            containerPos=""
            value={formData.colour}
            onChange={(e) => { updateForm("colour", e) }}
          />
        </div>

        <h2 className="font-bold text-2xl pt-8 pb-4">Preview</h2>
        <div className="border border-accent-ash p-5 flex items-center justify-center flex-col">
          <HeatMap
            value={generateRandomHeatmap}
            weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
            panelColors={colourPalette[formData.colour]}
            style={{
              color: 'var(--accent-primary-color)'
            }}
            startDate={new Date('2026/01/01')}
            className="w-full"
          />
          <div className="w-full flex flex-col">
            {formData.average && (
              <p className="text-sm"><span className="text-accent-primary">Average: </span> {String(calcAverage(generateRandomHeatmap).toFixed(2))}</p>
            )}
            {formData.sd && (
              <p className="text-sm"><span className="text-accent-primary">Standard Deviation: </span> {String(calcStdDev(generateRandomHeatmap).toFixed(2))}</p>
            )}
            {formData.total && (
              <p className="text-sm"><span className="text-accent-primary">Total: </span>{String(calcTotal(generateRandomHeatmap))}</p>
            )}
            {formData.numofdays && (
              <p className="text-sm"><span className="text-accent-primary">Number of Days:</span> {generateRandomHeatmap.length}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end pt-8">
          <Button type="submit" variant="primary" size="md" className="rounded-md bg-green-300">
            Create Habit
          </Button>
        </div>
      </form>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div className="w-full flex justify-between items-center flex-col gap-y-4">
          {
            formError && !subConfirmation && (
              <>
                <X className="w-10 h-10 bg-red-300 text-red-100 rounded-full" />
                <div className="flex flex-col gap-y-1 w-full items-center">
                  <h1 className="text-xl font-semibold">Error!</h1>
                  {
                    formError && Object.entries(formError)
                      .filter(([_, val]: [string, any]) => val.isBlank)
                      .map(([key]) => (
                        <p key={key} className="capitalize">{key} is blank</p>
                      ))
                  }
                </div>
              </>
            )
          }
          {
            submitError && !subConfirmation && (
              <>
                <X className="w-10 h-10 bg-red-300 text-red-100 rounded-full" />
                <div className="flex flex-col gap-y-1 w-full items-center">
                  <h1 className="text-xl font-semibold">Error!</h1>
                  {
                    submitError && (
                      <p>{submitError}</p>
                    )
                  }
                </div>
              </>
            )
          }
          {
            subConfirmation && (
              <>
                <Check className="w-10 h-10 bg-green-300 text-green-100 rounded-full" />
                <div className="flex flex-col gap-y-1 w-full items-center">
                  <h1 className="text-xl font-semibold">Success</h1>
                  <p>You will now be redirected</p>
                </div>
              </>
            )
          }
        </div>
      </Modal>

    </div>
  )
}
