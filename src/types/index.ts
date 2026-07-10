export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface UserHabit {
  habitId: string;
  userId: string;
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
