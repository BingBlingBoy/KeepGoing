import type { HabitBuckets, UserHabit } from "../types";

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

  return await response.json()
}

async function get(path: string) {
  console.log(`get: ${BASE_URL}/api/${path}`)
  const response = await fetch(`${BASE_URL}/api/${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  if (!response.ok) {
    throw new Error(`response status: ${response.status}`);
  }
  return await response.json()
}

async function patch(path: string, body: object) {
  console.log(`patch: ${BASE_URL}/api/${path}`)
  const response = await fetch(`${BASE_URL}/api/${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw new Error(`response status: ${response.status}`)
  }

  return await response.json()
}

export const api = {
  saveHabit: (
    habitId: string,
    userId: string,
    habit: Omit<UserHabit, "user_id" | "habit_id" | "updatedAt" | "startDate">
  ) => {
    return post("habit", { habitId, userId, ...habit })
  },

  getHabit: (
    userId: string
  ) => {
    console.log(`api userHabit: ${userId}`)
    return get(`habit/user/${userId}`)
  },

  getHabitDates: (
    dateId: string
  ) => {
    console.log(`api getHabitDates: ${dateId}`)
    return get(`habit/dates/${dateId}`)

  },

  updateHabit: (
    habitData: HabitBuckets
  ) => {
    return patch("habit", { habitData })
  }
};

