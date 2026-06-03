"use client";

import { useEffect } from "react";

export default function DevToolsBlocker() {
  useEffect(() => {
    // 1. Disable Right-Click (Context Menu)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Disable Common DevTools Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12
      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }

      if (
        e.ctrlKey &&
        e.shiftKey &&
        (e.key === "I" ||
          e.key === "J" ||
          e.key === "C" ||
          e.key === "i" ||
          e.key === "j" ||
          e.key === "c")
      ) {
        e.preventDefault();
        return false;
      }

      // Prevent Ctrl+U or Cmd+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === "U" || e.key === "u")) {
        e.preventDefault();
        return false;
      }

      // Prevent Ctrl+S or Cmd+S (Save Page) to protect your WordPress content offline
      if ((e.ctrlKey || e.metaKey) && (e.key === "S" || e.key === "s")) {
        e.preventDefault();
        return false;
      }
    };

    // 3. Optional: Advanced "Debugger Loop" anti-tamper snippet
    // This freezes the browser tab if a tech-savvy user opens DevTools via the browser menu
    const interval = setInterval(() => {
      const startTime = performance.now();
      debugger; // If DevTools is open, execution pauses here
      const endTime = performance.now();

      // If it took longer than 100ms to execute, DevTools is likely open
      if (endTime - startTime > 100) {
        console.clear();
        // You can choose to redirect them or clear the page body:
        // window.location.href = "about:blank";
      }
    }, 1000);

    // Attach listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    // Clean up listeners on unmount
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(interval);
    };
  }, []);

  return null; // This component doesn't render any UI
}
