import { useEffect } from "react";

export function useResizeObserver(targetRef, onResize) {
  useEffect(() => {
    const element = targetRef.current;
    if (!element || typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      onResize?.(element);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [onResize, targetRef]);
}
