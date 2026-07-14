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
    0: '#f4decd',
    7: '#e4b293',
    14: '#d48462',
    21: '#c2533a',
    28: '#ad001d',
    35: '#6c0012'
  },
  amber: {
    0: '#fef3c7',
    7: '#fde68a',
    14: '#fcd34d',
    21: '#fbbf24',
    28: '#f59e0b',
    35: '#d97706'
  }
};
