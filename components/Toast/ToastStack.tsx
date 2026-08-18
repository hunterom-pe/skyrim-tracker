"use client";

import { useEffect, useState } from "react";
import type { ToastItem } from "./ToastProvider";
import styles from "./Toast.module.css";

// Perk unlocks are the rarest, most significant event, so they stay on
// screen noticeably longer than a routine XP or level-up toast.
const DISMISS_AFTER_MS: Record<ToastItem["kind"], number> = {
  xp: 3000,
  levelup: 4500,
  perk: 6500,
};

// Must match the toast-out animation duration in Toast.module.css.
const EXIT_ANIMATION_MS = 220;

export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className={styles.stack} role="status" aria-live="polite">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const dismissTimer = setTimeout(() => setIsLeaving(true), DISMISS_AFTER_MS[toast.kind]);
    return () => clearTimeout(dismissTimer);
  }, [toast.id, toast.kind]);

  useEffect(() => {
    if (!isLeaving) return;
    const removeTimer = setTimeout(() => onDismiss(toast.id), EXIT_ANIMATION_MS);
    return () => clearTimeout(removeTimer);
  }, [isLeaving, toast.id, onDismiss]);

  const leavingClass = isLeaving ? styles.leaving : "";

  if (toast.kind === "xp") {
    return (
      <div className={`${styles.toast} ${styles.xp} ${leavingClass}`}>
        <span className={styles.xpAmount}>+{toast.xpAwarded} XP</span>
        <span className={styles.xpSkill}>{toast.skillName}</span>
      </div>
    );
  }

  if (toast.kind === "levelup") {
    return (
      <div className={`${styles.toast} ${styles.levelup} ${leavingClass}`}>
        <p className={styles.levelupText}>
          {toast.skillName} skill increased to {toast.newLevel}
        </p>
        {toast.levelsGained > 1 ? (
          <p className={styles.levelupSubtext}>+{toast.levelsGained} levels this session</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`${styles.toast} ${styles.perk} ${leavingClass}`}>
      <p className={styles.perkEyebrow}>Perk Unlocked</p>
      <p className={styles.perkName}>{toast.perk.name}</p>
      <p className={styles.perkDescription}>{toast.perk.description}</p>
    </div>
  );
}
