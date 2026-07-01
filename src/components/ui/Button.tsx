import { type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-accent-taupe text-black hover:bg-accent-hover",
        secondary: "bg-accent-ash text-foreground border border-border hover:bg-border",
        ghost: "text-muted hover:text-accent-taupe"
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

export const Button = ({ className, variant, size, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
    </button>
  )
}





// import { type ButtonHTMLAttributes, forwardRef } from "react";
//
// interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: "primary" | "secondary" | "ghost";
//   size?: "sm" | "md" | "lg";
// }
//
// export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
//   (
//     { className = "", variant = "primary", size = "md", children, ...props },
//     ref,
//   ) => {
//     const baseStyles =
//       "inline-flex items-center justify-center font-medium transition-colors rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
//
//     const variants = {
//       primary:
//         "bg-accent text-black hover:bg-accent-hover",
//       secondary:
//         "bg-card text-foreground border border-border hover:bg-border",
//       ghost:
//         "text-muted hover:text-foreground hover:bg-card",
//     };
//
//     const sizes = {
//       sm: "px-3 py-1.5 text-sm",
//       md: "px-5 py-2.5 text-base",
//       lg: "px-8 py-3 text-lg",
//     };
//
//     return (
//       <button
//         ref={ref}
//         className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
//         {...props}
//       >
//         {children}
//       </button>
//     );
//   },
// );
//
// Button.displayName = "Button";
