import { type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors  disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-accent-primary text-black hover:bg-accent-hover rounded-xl",
        secondary: "bg-accent-ash text-foreground border border-border hover:bg-border rounded-xl",
        ghost: "text-muted hover:text-accent-taupe rounded-xl",
        dropdown: "justify-between bg-accent-secondary box-border border border-transparent hover:bg-brand-strong font-medium leading-5 rounded-base w-full"
      },

      size: {
        sm: "px-1 py-1.5 text-sm",
        md: "px-3 py-2.5 text-base",
        lg: "px-8 py-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary"
    }
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> { }

export const Button = ({ className, variant, size, children, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      <div className="bg-opacity-50 transition-opacity duration-300 ease-in-out flex items-center">
        {children}
      </div>
    </button>
  )
}
