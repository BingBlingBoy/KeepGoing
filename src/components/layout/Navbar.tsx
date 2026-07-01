import { CircleQuestionMarkIcon, User } from "lucide-react";
import { Link } from "react-router";
import { LogIn } from 'lucide-react';
import { Button } from "../ui/Button";

export default function Navbar() {
  const user = false;

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-background">
      <nav className="max-w-8xl mx-auto px-6 h-16 gap-x-4 flex items-center justify-center">
        <Link
          to="/"
          className="flex items-center gap-2"
        >
          <Button variant="ghost" size="md" className="gap-x-2">
            <CircleQuestionMarkIcon className="w-6 h-6" />
            How it works
          </Button>
        </Link>
        {
          user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2"
              >
                <User className="w-6 h-6" />
                <span>Profile</span>
              </Link>
            </>
          ) : (
            <Link
              to="/auth/sign-in"
              className="flex items-center gap-2"
            >
              <Button variant="ghost" size="md" className="gap-x-2">
                <LogIn className="w-6 h-6" />
                Sign In
              </Button>
            </Link>
          )
        }

      </nav>
    </header>

  )
}
