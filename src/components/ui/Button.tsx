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
        primary: "bg-transparent border border-border text-accent-primary hover:bg-accent-secondary rounded-xl",
        secondary: "bg-accent-ash text-foreground border border-border hover:bg-border rounded-xl",
        ghost: "text-accent-primary hover:text-accent-secondary rounded-xl",
        dropdown: "justify-between bg-transparent border-2 text-accent-primary border-accent-primary rounded-sm font-medium leading-5 rounded-base w-full"
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
      <div className="bg-opacity-50 transition-opacity duration-300 ease-in-out flex items-center justify-center w-full">
        {children}
      </div>
    </button>
  )
}
