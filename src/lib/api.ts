import type { UserHabit } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

async function post(path: string, body: object) {
  const response = await fetch(`${BASE_URL}/api/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw new Error(`response status: ${response.status}`);
  }

  const result = await response.json()

  return result
}

export const api = {
  saveHabit: (
    userId: string,
    habit: Omit<UserHabit, "userId" | "updatedAt">
  ) => {
    return post("habit", { userId, ...habit })

  }
};

