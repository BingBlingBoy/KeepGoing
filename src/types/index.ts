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
  average: boolean;
  sd: boolean;
  total: boolean;
  numOfDays: boolean;
  colour: string;
  updatedAt: string;
}
