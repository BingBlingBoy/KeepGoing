export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface UserHabit {
  habit_id: string;
  user_id: string;
  title: string;
  metric: string;
  startDate: string;
  average: boolean;
  sd: boolean;
  total: boolean;
  numOfDays: boolean;
  colour: string;
  updatedAt: string;
}

export interface HabitBuckets {
  habit_id: string;
  bucket_date: string;
  event_count: number;
}

export const colourPalette = {
  red: {
    0: '#f1f5f9',
    7: '#e4b293',
    14: '#d48462',
    21: '#c2533a',
    28: '#ad001d',
    35: '#6c0012'
  },
  amber: {
    0: '#f1f5f9',
    7: '#fde68a',
    14: '#fcd34d',
    21: '#fbbf24',
    28: '#f59e0b',
    35: '#d97706'
  },
  green: {
    0: '#f1f5f9',
    7: '#bbf7d0',
    14: '#86efac',
    21: '#4ade80',
    28: '#22c55e',
    35: '#16a34a'
  }
};

export type PaletteColour = keyof typeof colourPalette

export interface DropdownOption {
  label: string;
  value: PaletteColour;
  bgClass: string;
}

export const dropdownColours: DropdownOption[] = [
  { label: "Red", value: "red", bgClass: "bg-red-400" },
  { label: "Amber", value: "amber", bgClass: "bg-amber-300" },
  { label: "Green", value: "green", bgClass: "bg-green-400" },
]


export interface HeatMapEntry {
  date: string;
  count: number;
}
