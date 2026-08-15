import type { InputHTMLAttributes, SetStateAction } from "react";

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: string;
  check: string;
  radioStyle?: string;
  setter: React.Dispatch<SetStateAction<string>>;
}

export function RadioInput({ label, value, check, setter, radioStyle, ...props }: RadioProps) {
  return (
    <label>
      <input
        type="radio"
        checked={check === value}
        onChange={() => setter(value)}
        className={`appearance-none cursor-pointer outline-none checked:ring-1 checked:ring-offset-2 checked:ring-gray-800 ${radioStyle}`}
        {...props}
      />
    </label>
  )
}
