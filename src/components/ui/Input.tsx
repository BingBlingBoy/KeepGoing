import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  caption: string;
  id: string;
  captionClassName?: string;
  className?: string;
  divClass?: string;
}

export const Input = ({ caption, id, captionClassName, className, divClass, ...props }: InputProps) => {
  return (
    <div className={`flex flex-col gap-y-1 ${divClass}`}>
      <h2 className={captionClassName}>{caption}</h2>
      <input type="text" id={id} className={className} {...props} />
    </div>
  )
}
