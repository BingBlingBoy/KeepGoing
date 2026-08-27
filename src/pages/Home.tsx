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

  function handleCreateHabit(e: React.SubmitEvent) {
    e.preventDefault()

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

  if (user) {
    return <Navigate to="/habit" replace />
  }


  return (
    <div className="p-10 md:p-20 flex flex-col items-center justify-center max-w-160 gap-y-20 mx-auto">
      <div className="flex flex-col flex-1 gap-y-4">
        <h1 className="text-3xl text-center font-bold mx-auto wrap-break-word w-full">
          Had a habit tracker I liked called <span><a className=" hover:text-blue-300" href="https://www.lifeofdiscipline.com/">lifeofdiscipline.com</a></span>
          , but it had a premium version. Out of pure spite, I copied it.
        </h1>
        <form className="mx-auto" onSubmit={handleCreateHabit}>
          <Button type="submit" variant="primary" size="md" className="border-2 ">
            Create Habits For Free
          </Button>
        </form>
      </div>
      <section>
        <div className="border border-accent-ash p-5 flex flex-col gap-y-2 flex-1 md:w-140">
          <h2 className="font-bold text-2xl pl-1">Preview</h2>
          <HeatMap
            value={generateRandomHeatmap}
            weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
            panelColors={colourPalette[colour]}
            startDate={new Date('2026/01/01')}
            style={{
              color: 'var(--accent-primary-color)'
            }}
            className="w-full"
          />
          <div className="w-full flex flex-col text-sm mx-2">
            <p className="text-sm"><span className="text-accent-primary">Average: </span> {String(calcAverage(generateRandomHeatmap).toFixed(2))}</p>
            <p className="text-sm"><span className="text-accent-primary">Standard Deviation: </span> {String(calcStdDev(generateRandomHeatmap).toFixed(2))}</p>
            <p className="text-sm"><span className="text-accent-primary">Number of Days:</span> {generateRandomHeatmap.length}</p>
          </div>
        </div>
        <div className="flex justify-end flex-row items-center mt-2 gap-x-2 max-w-160 mx-auto">
          <p className="flex items-center justify-center md:gap-x-1">Change the colours <ArrowRight className="w-4 h-4" /></p>
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
        <p className="text-3xl text-center font-bold max-w-[70ch] mx-auto wrap-break-word">
          We've helped thousands of users track over a bajillion habits, such as
          <span className="text-accent-primary border-b border-accent-secondary"> quitting smoking, sleeping more, drinking enough water, staying fit, meditating consistently </span>
          and many more.
        </p>
      </section>
    </div >
  )
}


