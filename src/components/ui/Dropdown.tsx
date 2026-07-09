import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva } from "class-variance-authority";
import { Button } from "./Button";

type Option = {
  label: string;
  value: string;
  bgClass?: string;
};

interface DropdownProps {
  options: Option[];
  placeholder: string;
  containerPos?: string;
  value: string | null;
  onChange: (value: string) => void;
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Dropdown = ({ options, placeholder, containerPos, onChange, value, ...props }: DropdownProps) => {
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
        className="gap-x-2 px-4 py-2.5"
        {...props}
      >
        <div className="flex flex-row gap-x-2 items-center justify-center">
          {selectedOption?.bgClass && (
            <span className={`block w-4 h-4 rounded-sm ${selectedOption.bgClass}`}></span>
          )}
          {selectedOption ? selectedOption.label : placeholder}
        </div>
        <ChevronDown className="w-5 h-5 ml-2" />
      </Button>

      {isOpen && (
        <div className={cn(containerPos, "absolute mt-1 z-10 w-44 bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-full")}>
          <ul className="text-sm text-body font-medium">
            {options.map((option) => (
              <li
                key={option.value}
                className="
                  inline-flex p-1 items-center w-full bg-white cursor-pointer gap-x-2
                  hover:bg-neutral-tertiary-medium hover:text-heading rounded
                "
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
