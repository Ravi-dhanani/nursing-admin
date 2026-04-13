"use client";
import { useLanguage } from "@/common/LanguageContext";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { English, Gujrati } from "./icons";

const THEMES = [
  {
    name: "en",
    Icon: English,
  },
  {
    name: "guj",
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

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "guj" : "en")}
      className="group rounded-full bg-gray-3 p-[5px] text-[#111928] outline-1 outline-primary focus-visible:outline dark:bg-[#020D1A] dark:text-current"
    >
      <span className="sr-only">
        Switch to {language === "en" ? "guj" : "en"} mode
      </span>

      <span aria-hidden className="relative flex gap-2.5">
        {/* Indicator */}
        <span
          className={cn(
            "absolute size-[38px] rounded-full border border-gray-200 bg-white transition-all",
            language === "guj" ? "translate-x-[48px]" : "translate-x-0",
          )}
        />

        {THEMES.map(({ name, Icon }) => (
          <span
            key={name}
            className={cn(
              "relative grid size-[38px] place-items-center rounded-full",
              name === "en" && "dark:text-white",
            )}
          >
            <Icon />
          </span>
        ))}
      </span>
    </button>
  );
}
