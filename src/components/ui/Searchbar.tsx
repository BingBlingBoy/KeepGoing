import clsx, { type ClassValue } from "clsx"
import { Search } from "lucide-react";
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Searchbar = ({ className, setSearchQuery, ...props }) => {
  return (
    <>
      <div className={cn("flex items-center border-2 pl-3 gap-2 bg-background border-accent-primary text-accent-primary rounded-md overflow-hidden max-w-md w-full", className)}>
        <Search className="w-6 h-6" />
        <input
          type="text"
          placeholder="Search for products" className="w-full h-full outline-none  text-sm"
          onChange={(e) => { setSearchQuery(e.target.value) }}
          {...props}
        />
      </div>
    </>
  )
}
