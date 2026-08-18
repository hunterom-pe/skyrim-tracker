"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { Perk } from "@/lib/supabase/types";
import { ToastStack } from "./ToastStack";
import { PerkCelebration } from "./PerkCelebration";

// Corner toasts: routine XP gains and level-ups. Perk unlocks are rare and
// significant enough that they get their own full-screen moment instead
// (see PerkCelebration) rather than competing for space in this stack.
export type ToastItem =
  | { id: string; kind: "xp"; skillName: string; xpAwarded: number }
  | { id: string; kind: "levelup"; skillName: string; newLevel: number; levelsGained: number };

type ToastContextValue = {
  pushXpToast: (input: { skillName: string; xpAwarded: number }) => void;
  pushLevelUpToast: (input: { skillName: string; newLevel: number; levelsGained: number }) => void;
  pushPerkToast: (input: { perk: Perk }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [perkQueue, setPerkQueue] = useState<Perk[]>([]);
  const celebratingPerk = perkQueue[0] ?? null;

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
    setPerkQueue((current) => [...current, perk]);
  }, []);

  // The celebration queue advances one perk at a time — celebratingPerk is
  // just the head of perkQueue, so dismissing is a plain shift, and the
  // next queued perk (if any) becomes the new head automatically.
  const dismissCelebration = useCallback(() => setPerkQueue((current) => current.slice(1)), []);

  return (
    <ToastContext.Provider value={{ pushXpToast, pushLevelUpToast, pushPerkToast }}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
      <PerkCelebration perk={celebratingPerk} onDismiss={dismissCelebration} />
    </ToastContext.Provider>
  );
}

export function useToastQueue(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToastQueue must be used within a ToastProvider");
  return context;
}
