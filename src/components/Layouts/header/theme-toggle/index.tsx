"use client";
import { useLanguage } from "@/common/LanguageContext";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { English, Gujrati } from "./icons";

const THEMES = [
  {
    name: "English",
    Icon: English,
  },
  {
    name: "ગુજરાતી",
    Icon: Gujrati,
  },
];

export function ThemeToggleSwitch() {
  const [mounted, setMounted] = useState(false);

  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isGujarati = language === "ગુજરાતી";

  return (
    <button
      onClick={() => setLanguage(isGujarati ? "English" : "ગુજરાતી")}
      className="relative w-[160px] rounded-full bg-gray-100 p-1.5"
    >
      <span className="sr-only">
        Switch to {isGujarati ? "English" : "ગુજરાતી"}
      </span>

      <div className="relative flex">
        <span
          className={cn(
            "absolute left-0 top-0 h-full w-1/2 rounded-full bg-white shadow transition-transform duration-300",
            isGujarati ? "translate-x-full" : "translate-x-0",
          )}
        />

        {THEMES.map(({ name }) => {
          const isActive = language === name;

          return (
            <span
              key={name}
              className={cn(
                "relative z-10 flex w-1/2 cursor-pointer items-center justify-center gap-1 rounded-full py-2 text-sm transition",
                isActive ? "font-semibold text-primary" : "text-gray-500",
              )}
            >
              {name}
            </span>
          );
        })}
      </div>
    </button>
  );
}
