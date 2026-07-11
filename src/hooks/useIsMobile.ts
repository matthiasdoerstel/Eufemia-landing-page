import { useEffect, useState } from "react";
import { layout } from "../theme/tokens";

// SSR-safe viewport check. Returns true when the viewport is at or below the
// mobile breakpoint. Defaults to false on the server / first render so the
// desktop layout is emitted for SSR, then corrects on mount.
export const useIsMobile = (breakpoint: number = layout.mobileBreakpoint): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;
