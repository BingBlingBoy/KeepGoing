import { X } from "lucide-react"

export const Modal = ({ open, onClose, children, ...props }) => {
  return (
    <div
      onClick={onClose}
      className={`
        fixed inset-0 z-50 flex justify-center items-center transition-colors
        ${open ? "visible bg-black/20" : "invisible"}
      `}
      {...props}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          bg-background rounded-xl shadow p-6 transition-all w-full max-w-3xl m-4
          ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
        `}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-lg
          bg-background hover:text-accent-primary"
        >
          <X />
        </button>
        {children}
      </div>
    </div>
  )
}
