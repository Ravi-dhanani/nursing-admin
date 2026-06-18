"use client";

import { useEffect } from "react";

export default function DevToolsDetector() {
  useEffect(() => {
    const detectDevTools = () => {
      const start = performance.now();

      debugger;

      const end = performance.now();

      if (end - start > 100) {
        while (true) {
          debugger;
        }
      }
    };

    const interval = setInterval(detectDevTools, 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
