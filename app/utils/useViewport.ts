import { useEffect } from "react";

const MIN_DEVICE_WIDTH = 360;

export function useViewPort() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    function resizeViewport() {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        return;
      }

      const value =
        window.outerWidth > MIN_DEVICE_WIDTH
          ? "width=device-width,initial-scale=1"
          : "width=360";
      if (viewport.getAttribute("content") !== value) {
        viewport.setAttribute("content", value);
      }
    }
    window.addEventListener("resize", resizeViewport, false);
    return () => {
      window.removeEventListener("resize", resizeViewport);
    };
  });
}
