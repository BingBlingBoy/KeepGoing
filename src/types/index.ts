export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface UserHabit {
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
