export const Input = ({ caption, id, captionClassName, className, ...props }) => {
  return (
    <div className="flex flex-col gap-y-1">
      <h2 className={captionClassName}>{caption}</h2>
      <input type="text" id={id} className={className} {...props} />
    </div>
  )
}
