import clsx, { type ClassValue } from "clsx"
import { Search } from "lucide-react";
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Searchbar = ({ className, setSearchQuery, ...props }) => {
  return (
    <>
      <div className={cn("flex items-center border pl-3 gap-2 bg-white border-gray-500/30 h-11.5 rounded-md overflow-hidden max-w-md w-full", className)}>
        <Search className="w-6 h-6" />
        <input
          type="text"
          placeholder="Search for products" className="w-full h-full outline-none text-gray-500 placeholder-gray-500 text-sm"
          onChange={(e) => { setSearchQuery(e.target.value) }}
          {...props}
        />
      </div>
    </>
  )
}
