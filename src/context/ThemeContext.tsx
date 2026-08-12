import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";

interface ThemeContextType {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light')
  const { user, getProfileData } = useAuth();

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const res = await getProfileData(user.id);

        if (res[0].light_mode === true) {
          setTheme('light')
        } else {
          setTheme('dark')
        }
      } catch (err) {
        console.error(`Error has occured when getting profile data: ${err}`)
      }
    }

    if (user) {
      loadProfileData()
    }
  }, [user, getProfileData])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={
      {
        theme: theme,
        setTheme: setTheme
      }
    }>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must have a ThemeProvider")
  }

  return context
}
