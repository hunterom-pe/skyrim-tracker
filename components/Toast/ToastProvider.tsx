"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { Perk } from "@/lib/supabase/types";
import { ToastStack } from "./ToastStack";

export type ToastItem =
  | { id: string; kind: "xp"; skillName: string; xpAwarded: number }
  | { id: string; kind: "levelup"; skillName: string; newLevel: number; levelsGained: number }
  | { id: string; kind: "perk"; perk: Perk };

type ToastContextValue = {
  pushXpToast: (input: { skillName: string; xpAwarded: number }) => void;
  pushLevelUpToast: (input: { skillName: string; newLevel: number; levelsGained: number }) => void;
  pushPerkToast: (input: { perk: Perk }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushXpToast = useCallback<ToastContextValue["pushXpToast"]>(({ skillName, xpAwarded }) => {
    setToasts((current) => [
      ...current,
      { id: crypto.randomUUID(), kind: "xp", skillName, xpAwarded },
    ]);
  }, []);

  const pushLevelUpToast = useCallback<ToastContextValue["pushLevelUpToast"]>(
    ({ skillName, newLevel, levelsGained }) => {
      setToasts((current) => [
        ...current,
        { id: crypto.randomUUID(), kind: "levelup", skillName, newLevel, levelsGained },
      ]);
    },
    [],
  );

  const pushPerkToast = useCallback<ToastContextValue["pushPerkToast"]>(({ perk }) => {
    setToasts((current) => [...current, { id: crypto.randomUUID(), kind: "perk", perk }]);
  }, []);

  return (
    <ToastContext.Provider value={{ pushXpToast, pushLevelUpToast, pushPerkToast }}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToastQueue(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToastQueue must be used within a ToastProvider");
  return context;
}
