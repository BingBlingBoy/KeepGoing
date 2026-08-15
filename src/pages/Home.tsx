import { Navigate, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { calcAverage, calcStdDev, calcTotal, generateRealistic } from "../lib/helper";
import HeatMap from "@uiw/react-heat-map";
import { colourPalette, dropdownColours } from "../types";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { RadioInput } from "../components/ui/RadioButton";

export default function Home() {
  const { user } = useAuth();
  const [colour, setColour] = useState("red")

  const navigate = useNavigate()

  if (user) {
    return <Navigate to="/habit" replace />
  }

  function handleCreateHabit(e: React.SubmitEvent) {
    e.preventDefault()
    console.log("HELLO")

    if (user) {
      navigate("/habit")
    } else {
      navigate("/auth/sign-in")
    }
  }

  function handleColourClick(colour: string) {
    console.log(colour)
  }

  const defaultYear = 2026

  const generateRandomHeatmap = useMemo(() =>
    generateRealistic(defaultYear)
    , [defaultYear])

  return (
    <div className="p-20 flex flex-col item-center gap-y-20">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-3xl text-center font-bold max-w-[70ch] mx-auto">
          Had a habit tracker I liked called <span><a className=" hover:text-blue-300" href="https://www.lifeofdiscipline.com/">lifeofdiscipline.com</a></span>
          , but it had a premium version. Out of pure spite, I copied it.
        </h1>
        <form className="mx-auto" onSubmit={handleCreateHabit}>
          <Button type="submit" variant="primary" size="md">
            Create Habits For Free
          </Button>
        </form>
      </div>
      <section>
        <div className="border border-accent-ash p-5 flex flex-col gap-y-2">
          <h2 className="font-bold text-2xl pl-1">Preview</h2>
          <HeatMap
            value={generateRandomHeatmap}
            weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
            panelColors={colourPalette[colour]}
            startDate={new Date('2026/01/01')}
            className="w-full"
          />
          <div className="w-full flex flex-col text-sm mx-2">
            <p>Average: {String(calcAverage(generateRandomHeatmap).toFixed(2))}</p>
            <p>Standard Deviation: {String(calcStdDev(generateRandomHeatmap).toFixed(2))}</p>
            <p>Total: {String(calcTotal(generateRandomHeatmap))}</p>
          </div>
        </div>
        <div className="w-full flex justify-end flex-row items-center mt-2 gap-x-2">
          <p className="flex items-center gap-1">Change the colours <ArrowRight className="w-4 h-4" /></p>
          <div className="flex flex-row gap-x-1 items-center justify-center">
            {
              dropdownColours.map((key) => (
                <RadioInput
                  key={key.label}
                  label={key.label}
                  value={key.value}
                  check={colour}
                  setter={setColour}
                  radioStyle={`w-3 h-3 p-3 rounded-full ${key.bgClass}`}
                  onClick={() => handleColourClick(key.value)}
                >
                </RadioInput>
              ))
            }
          </div>
        </div>
      </section>

      <section>
        <p className="text-3xl text-center font-bold max-w-[70ch] mx-auto">
          We've helped thousands of users track over a bajillion habits, such as
          <span className="text-accent-primary border-b border-accent-secondary"> quitting smoking, sleeping more, drinking enough water, staying fit, meditating consistently </span>
          and many more.
        </p>
      </section>
    </div >
  )
}


