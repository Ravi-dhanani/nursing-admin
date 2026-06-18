"use client";

import { useEffect } from "react";

export default function DisableInspect() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
      }

      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (
        e.ctrlKey &&
        e.shiftKey &&
        ["I", "J", "C"].includes(e.key.toUpperCase())
      ) {
        e.preventDefault();
      }

      // Ctrl+U
      if (e.ctrlKey && e.key.toUpperCase() === "U") {
        e.preventDefault();
      }

      // Ctrl+S
      if (e.ctrlKey && e.key.toUpperCase() === "S") {
        e.preventDefault();
      }

      // Ctrl+P
      if (e.ctrlKey && e.key.toUpperCase() === "P") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
