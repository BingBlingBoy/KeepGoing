import { useEffect } from "react";

export function useOnClickOutside(ref, handler) {
  useEffect(() => {

    function listener(event) {
      // If the click is inside the ref's element, do nothing
      if (!ref.current || ref.current.contains(event.target)) {
        return
      }
      // Call handler function
      handler(event)

    }
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    }
  }, [ref, handler])

}
