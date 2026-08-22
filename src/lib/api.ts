import type { DisplayForm, HabitBuckets, NewUsernameForm, UserHabit } from "../types";
import { authClient } from "./auth";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

async function handleResponse(response: Response) {
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

  if (response.status === 204) return null;

  return await response.json()
}

async function fetchWithAuth(path: string, options: RequestInit, token: string) {
  const url = `${BASE_URL}/api/${path}`;

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json')
  headers.set('Authorization', `Bearer ${token}`)

  let response = await fetch(url, { ...options, headers })

  if (response.status === 401) {
    try {
      const sessionRes = await authClient.getSession()

      if (!sessionRes || !sessionRes.data?.session?.token) {
        throw new Error('Could not refresh token via SDK')
      }

      const newToken = sessionRes.data.session.token;

      headers.set('Authorization', `Bearer ${newToken}`)
      response = await fetch(url, { ...options, headers })

    } catch (err) {
      window.location.href = "/auth/sign-in";
      throw new Error("Session expired. Redirecting to login...");
    }
  }
  return handleResponse(response);
}

const get = (path: string, token: string) =>
  fetchWithAuth(path, { method: 'GET' }, token)

const post = (path: string, body: object, token: string) =>
  fetchWithAuth(path, { method: 'POST', body: JSON.stringify(body) }, token)

const patch = (path: string, body: object, token: string) =>
  fetchWithAuth(path, { method: 'PATCH', body: JSON.stringify(body) }, token)

const del = (path: string, token: string, body?: object) =>
  fetchWithAuth(path, { method: "DELETE", body: body ? JSON.stringify(body) : undefined }, token);

export const api = {
  saveHabit: (habitId: string, userId: string, habit: Omit<UserHabit, "user_id" | "habit_id" | "updatedAt" | "startDate">, token: string) => {
    return post("habit", { habitId, userId, ...habit }, token);
  },

  getHabit: (userId: string, token: string) => {
    return get(`habit/user/${userId}`, token);
  },

  getHabitDates: (dateId: string, token: string) => {
    return get(`habit/dates/${dateId}`, token);
  },

  updateHabit: (habitData: HabitBuckets, token: string) => {
    return patch("habit", { habitData }, token);
  },

  saveProfile: (userId: string, token: string) => {
    return post("profile", { userId }, token);
  },

  getProfile: (userId: string, token: string) => {
    return get(`profile/${userId}`, token);
  },

  updateUsername: (userData: NewUsernameForm, userId: string, token: string) => {
    return patch(`settings/${userId}/username`, userData, token);
  },

  updateUserPref: (displayData: DisplayForm, userId: string, token: string) => {
    return patch(`settings/${userId}/display`, displayData, token);
  },

  deleteUser: (userId: string, token: string) => {
    return del(`settings/${userId}`, token);
  },

  deleteHabit: (habitId: string, userId: string, token: string) => {
    return del(`habit/${habitId}`, token, { userId });
  }
};
