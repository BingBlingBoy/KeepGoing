import type { DisplayForm, HabitBuckets, NewUsernameForm, UserHabit } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

async function post(path: string, body: object) {
  const response = await fetch(`${BASE_URL}/api/${path}s`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    let errorMessage = `HTTP Error: ${response.status}`
    try {
      const errorData = await response.json()
      if (errorData.error) {
        errorMessage = errorData.error
      }
    } catch (err) {
      throw new Error(`response status: ${response.status}`);
    }
    throw new Error(errorMessage);
  }
  return await response.json()
}

async function get(path: string) {
  const response = await fetch(`${BASE_URL}/api/${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  if (!response.ok) {
    let errorMessage = `HTTP Error: ${response.status}`
    try {
      const errorData = await response.json()
      if (errorData.error) {
        errorMessage = errorData.error
      }
    } catch (err) {
      throw new Error(`response status: ${response.status}`);
    }
    throw new Error(errorMessage);
  }
  return await response.json()
}

async function patch(path: string, body: object) {
  const response = await fetch(`${BASE_URL}/api/${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    let errorMessage = `HTTP Error: ${response.status}`
    try {
      const errorData = await response.json()
      if (errorData.error) {
        errorMessage = errorData.error
      }
    } catch (err) {
      throw new Error(`response status: ${response.status}`)
    }
    throw new Error(errorMessage);
  }

  return await response.json()
}

async function del(path: string) {
  const url = `${BASE_URL}/api/${path}`

  const response = await fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    let errorMessage = `HTTP Error: ${response.status}`
    try {
      const errorData = await response.json()
      if (errorData.error) {
        errorMessage = errorData.error
      }
    } catch (err) {
      throw new Error(`response status: ${response.status}`);
    }
    throw new Error(errorMessage);
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
    return get(`habit/user/${userId}`)
  },

  getHabitDates: (
    dateId: string
  ) => {
    return get(`habit/dates/${dateId}`)

  },

  updateHabit: (
    habitData: HabitBuckets
  ) => {
    return patch("habit", { habitData })
  },

  saveProfile: (
    userId: string
  ) => {
    return post("profile", { userId })
  },

  getProfile: (
    userId: string
  ) => {
    return get(`profile/${userId}`)
  },

  updateUsername: (
    userData: NewUsernameForm,
    userId: string
  ) => {
    return patch(`settings/${userId}/username`, userData)
  },

  updateUserPref: (
    displayData: DisplayForm,
    userId: string
  ) => {
    return patch(`settings/${userId}/display`, displayData)
  },

  deleteUser: (
    userId: string
  ) => {
    return del(`settings/${userId}`)
  }
};

