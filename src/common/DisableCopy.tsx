"use client";

import { useEffect } from "react";

export default function DisableCopy() {
  useEffect(() => {
    const prevent = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener("copy", prevent);
    document.addEventListener("cut", prevent);
    document.addEventListener("paste", prevent);
    document.addEventListener("contextmenu", prevent);

    return () => {
      document.removeEventListener("copy", prevent);
      document.removeEventListener("cut", prevent);
      document.removeEventListener("paste", prevent);
      document.removeEventListener("contextmenu", prevent);
    };
  }, []);

  return null;
}
