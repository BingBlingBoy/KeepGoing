import { BrowserRouter, Route, Routes } from "react-router"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Navbar from "./components/layout/Navbar"
import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react';
import { authClient } from './lib/auth';
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import AuthProvider from "./context/AuthContext";
import Habit from "./pages/Habit";
import Settings from "./pages/Settings";

function App() {
  return (
    <NeonAuthUIProvider authClient={authClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/habit" element={<Habit />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/auth/:pathname" element={<Auth />} />
                <Route path="/account/:pathname" element={<Account />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </NeonAuthUIProvider>
  )
}

export default App
