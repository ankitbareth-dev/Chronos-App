import { useEffect, type RefObject } from "react";

const isClickedInside = (
  refs: RefObject<HTMLElement | null>[],
  event: MouseEvent,
): boolean => {
  return refs.some((ref) => {
    return ref.current && ref.current.contains(event.target as Node);
  });
};

export const useClickOutside = (
  refs: RefObject<HTMLElement | null>[],
  handler: () => void,
  isActive: boolean,
) => {
  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event: MouseEvent) => {
      const clickedInside = isClickedInside(refs, event);

      if (!clickedInside) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs, handler, isActive]);
};
