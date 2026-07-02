import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

export const Dropdown = ({ options, placeholder, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const dropdownRef = useRef(null);
  useOnClickOutside(dropdownRef, () => setIsOpen((false)))

  function handleOptionClick(option) {
    setSelectedOption(option);
    setIsOpen(false);
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
        inline-flex items-center justify-between text-red bg-accent-taupe box-border border border-transparent
        hover:bg-brand-strong focus:ring-2 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm
        px-4 py-2.5 focus:outline-none min-w-[150px]
        "
        {...props}
      >
        {placeholder}
        <ChevronDown className="w-5 h-5 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute -right-1 top-12 mt-1 z-10 w-44 bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg">
          <ul className="text-sm text-body font-medium">
            {options.map((option) => (
              <li
                key={option.value}
                className="
                  inline-flex items-center w-full cursor-pointer
                  hover:bg-neutral-tertiary-medium hover:text-heading rounded
                "
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
