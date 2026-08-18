"use client";

import { useEffect, useState } from "react";
import type { Perk } from "@/lib/supabase/types";
import styles from "./PerkCelebration.module.css";

const AUTO_DISMISS_MS = 5500;
const EXIT_ANIMATION_MS = 320;

// The biggest payoff moment in the app: a full-screen dim + centered card
// with a golden burst behind it. Still dismissible (click anywhere, or it
// auto-dismisses) so it never blocks the user for long.
export function PerkCelebration({
  perk,
  onDismiss,
}: {
  perk: Perk | null;
  onDismiss: () => void;
}) {
  if (!perk) return null;
  // Keying by perk.id remounts this on every new perk, so each celebration
  // starts from a clean isLeaving=false without needing to sync it in an effect.
  return <PerkCelebrationCard key={perk.id} perk={perk} onDismiss={onDismiss} />;
}

function PerkCelebrationCard({ perk, onDismiss }: { perk: Perk; onDismiss: () => void }) {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const dismissTimer = setTimeout(() => setIsLeaving(true), AUTO_DISMISS_MS);
    return () => clearTimeout(dismissTimer);
  }, []);

  useEffect(() => {
    if (!isLeaving) return;
    const removeTimer = setTimeout(onDismiss, EXIT_ANIMATION_MS);
    return () => clearTimeout(removeTimer);
  }, [isLeaving, onDismiss]);

  return (
    <div
      className={`${styles.backdrop} ${isLeaving ? styles.leaving : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Perk unlocked"
      onClick={() => setIsLeaving(true)}
    >
      <div className={styles.burst} />
      <div className={styles.card}>
        <p className={styles.eyebrow}>Perk Unlocked</p>
        <p className={styles.name}>{perk.name}</p>
        <p className={styles.description}>{perk.description}</p>
      </div>
    </div>
  );
}
