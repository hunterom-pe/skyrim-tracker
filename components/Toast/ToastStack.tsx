"use client";

import { useEffect } from "react";
import type { ToastItem } from "./ToastProvider";
import styles from "./Toast.module.css";

// Perk unlocks are the rarest, most significant event, so they stay on
// screen noticeably longer than a routine XP or level-up toast.
const DISMISS_AFTER_MS: Record<ToastItem["kind"], number> = {
  xp: 3000,
  levelup: 4500,
  perk: 6500,
};

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
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), DISMISS_AFTER_MS[toast.kind]);
    return () => clearTimeout(timer);
  }, [toast.id, toast.kind, onDismiss]);

  if (toast.kind === "xp") {
    return (
      <div className={`${styles.toast} ${styles.xp}`}>
        <span className={styles.xpAmount}>+{toast.xpAwarded} XP</span>
        <span className={styles.xpSkill}>{toast.skillName}</span>
      </div>
    );
  }

  if (toast.kind === "levelup") {
    return (
      <div className={`${styles.toast} ${styles.levelup}`}>
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
    <div className={`${styles.toast} ${styles.perk}`}>
      <p className={styles.perkEyebrow}>Perk Unlocked</p>
      <p className={styles.perkName}>{toast.perk.name}</p>
      <p className={styles.perkDescription}>{toast.perk.description}</p>
    </div>
  );
}
