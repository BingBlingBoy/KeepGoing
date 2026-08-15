export interface User {
  id: string;
  email: string;
  createdAt: string;
  name: string;
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

export interface ProfileData {
  user_id: string;
  login_count: number;
  last_login_at: string;
  created_at: string;
  updated_at: string;
  light_mode: boolean;
}

export interface NewUsernameForm {
  newUsername: string;
}

export interface DisplayForm {
  newDisplayPref: boolean;
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
  },
  indigo: {
    0: '#f1f5f9',
    7: '#c7d2fe',
    14: '#a5b4fc',
    21: '#818cf8',
    28: '#6366f1',
    35: '#4f46e5'
  },
  orange: {
    0: '#f1f5f9',
    7: '#fed7aa',
    14: '#fdba74',
    21: '#fb923c',
    28: '#f97316',
    35: '#ea580c'
  },
  fuchsia: {
    0: '#f1f5f9',
    7: '#f5d0fe',
    14: '#e879f9',
    21: '#d946ef',
    28: '#c026d3',
    35: '#a21caf'
  },
  pink: {
    0: '#f1f5f9',
    7: '#fbcfe8',
    14: '#f9a8d4',
    21: '#f472b6',
    28: '#ec4899',
    35: '#db2777'
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
  { label: "Indigo", value: "indigo", bgClass: "bg-indigo-500" },
  { label: "Orange", value: "orange", bgClass: "bg-orange-400" },
  { label: "Fuchsia", value: "fuchsia", bgClass: "bg-fuchsia-400" },
  { label: "Pink", value: "pink", bgClass: "bg-pink-400" },
];

export interface HeatMapEntry {
  date: string;
  count: number;
}
