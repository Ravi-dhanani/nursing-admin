"use client";

import { createContext, useContext } from "react";

type QuetionsContextType = {
  paramsId: string;
};

const QuetionsContext = createContext<QuetionsContextType | null>(null);

// Provider
export function QuetionsHook({
  paramsId,
  children,
}: {
  paramsId: string;
  children: React.ReactNode;
}) {
  return (
    <QuetionsContext.Provider value={{ paramsId }}>
      {children}
    </QuetionsContext.Provider>
  );
}

// Hook
export function useQuetionsContextHook() {
  const context = useContext(QuetionsContext);
  if (!context) {
    throw new Error("useMcq must be used inside McqProvider");
  }
  return context;
}
