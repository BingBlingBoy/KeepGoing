import { CircleCheck, CircleQuestionMarkIcon, Settings, User } from "lucide-react";
import { Link } from "react-router";
import { LogIn } from 'lucide-react';
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-background border border-b-accent-taupe">
      <nav className="max-w-8xl mx-auto px-6 h-16 gap-x-4 flex items-center justify-center">
        {
          user ? (
            <>
              <Link
                to="/habit"
                className="flex items-center gap-2"
              >
                <Button variant="ghost" size="md" className="gap-x-2">
                  <CircleCheck className="w-6 h-6" />
                  My Habits
                </Button>
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2"
              >
                <Button variant="ghost" size="md" className="gap-x-2">
                  <User className="w-6 h-6" />
                  Profile
                </Button>
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-2"
              >
                <Button variant="ghost" size="md" className="gap-x-2">
                  <Settings className="w-6 h-6" />
                  Settings
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="flex items-center gap-2"
              >
                <Button variant="ghost" size="md" className="gap-x-2">
                  <CircleQuestionMarkIcon className="w-6 h-6" />
                  How it works
                </Button>
              </Link>
              <Link
                to="/auth/sign-in"
                className="flex items-center gap-2"
              >
                <Button variant="ghost" size="md" className="gap-x-2">
                  <LogIn className="w-6 h-6" />
                  Sign In
                </Button>
              </Link>
            </>
          )
        }

      </nav>
    </header>

  )
}
