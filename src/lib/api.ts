import type { DisplayForm, HabitBuckets, NewUsernameForm, UserHabit } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

async function post(path: string, body: object, token: string) {
  const response = await fetch(`${BASE_URL}/api/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
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

async function get(path: string, token: string) {
  const response = await fetch(`${BASE_URL}/api/${path}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
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

async function patch(path: string, body: object, token: string) {
  const response = await fetch(`${BASE_URL}/api/${path}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
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

async function del(path: string, token: string, body?: any) {
  const url = `${BASE_URL}/api/${path}`
  console.log('body:', body)

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
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

export const api = {
  saveHabit: (
    habitId: string,
    userId: string,
    habit: Omit<UserHabit, "user_id" | "habit_id" | "updatedAt" | "startDate">,
    token: string
  ) => {
    return post("habit", { habitId, userId, ...habit }, token)
  },

  getHabit: (
    userId: string,
    token: string
  ) => {
    return get(`habit/user/${userId}`, token)
  },

  getHabitDates: (
    dateId: string,
    token: string
  ) => {
    return get(`habit/dates/${dateId}`, token)

  },

  updateHabit: (
    habitData: HabitBuckets,
    token: string
  ) => {
    return patch("habit", { habitData }, token)
  },

  saveProfile: (
    userId: string,
    token: string,
  ) => {
    return post("profile", { userId }, token)
  },

  getProfile: (
    userId: string,
    token: string
  ) => {
    return get(`profile/${userId}`, token)
  },

  updateUsername: (
    userData: NewUsernameForm,
    userId: string,
    token: string
  ) => {
    return patch(`settings/${userId}/username`, userData, token)
  },

  updateUserPref: (
    displayData: DisplayForm,
    userId: string,
    token: string
  ) => {
    return patch(`settings/${userId}/display`, displayData, token)
  },

  deleteUser: (
    userId: string,
    token: string
  ) => {
    return del(`settings/${userId}`, token)
  },

  deleteHabit: (
    habitId: string,
    userId: string,
    token: string
  ) => {
    return del(`habit/${habitId}`, userId, token)
  }
};

