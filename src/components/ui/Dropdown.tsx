import { ChevronDown } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva } from "class-variance-authority";
import { Button } from "./Button";

type Option = {
  label: ReactNode;
  value: string;
  bgClass?: string;
};

interface DropdownProps {
  options: Option[];
  placeholder: string | ReactNode;
  containerPos?: string;
  value?: string | null;
  onChange?: (value: string) => void;
  chevron?: boolean
  innerStyle?: string
  buttonStyle?: string
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Dropdown = ({
  options, placeholder,
  containerPos, onChange,
  value, chevron = true,
  innerStyle, buttonStyle,
  ...props
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);
  useOnClickOutside(dropdownRef, () => setIsOpen((false)))

  let selectedOption = options.find((opt) => opt.value === value);

  function handleOptionClick(option: Option) {
    setIsOpen(false);

    if (onChange) {
      onChange(option.value);
    }
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <Button
        variant="dropdown"
        type="button"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn("gap-x-2 px-4 py-2.5", buttonStyle)}
        {...props}
      >
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-row items-center gap-x-2">
            {selectedOption?.bgClass && (
              <span className={`block w-4 h-4 rounded-sm ${selectedOption.bgClass}`}></span>
            )}
            {selectedOption ? selectedOption.label : placeholder}
          </div>
          {
            chevron &&
            <ChevronDown className="w-5 h-5 ml-2" />
          }
        </div>
      </Button>

      {isOpen && (
        <div className={cn(containerPos, "absolute mt-1 z-10 rounded-base w-max overflow-hidden bg-white")}>
          <ul className="text-sm text-body font-medium">
            {options.map((option) => (
              <li
                key={option.value}
                className={cn(
                  "flex items-center px-4 py-2 cursor-pointer border-b border-accent-primary gap-x-2 whitespace-nowrap hover:bg-gray-100",
                  innerStyle
                )}
                onClick={() => handleOptionClick(option)}
              >
                {option.bgClass && (
                  <span className={`block w-4 h-4 rounded-sm ${option.bgClass}`}></span>
                )}
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
