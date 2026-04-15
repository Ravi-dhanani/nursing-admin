"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Language = "English" | "ગુજરાતી";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("English");

  // ✅ Load from localStorage (client only)
  useEffect(() => {
    const stored = localStorage.getItem("language") as Language;
    if (stored) {
      setLanguageState(stored);
    }
  }, []);

  // ✅ Update both state + localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside Provider");
  return context;
};
