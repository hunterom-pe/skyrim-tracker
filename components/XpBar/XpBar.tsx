import styles from "./XpBar.module.css";

export function XpBar({ currentXp, xpToNext }: { currentXp: number; xpToNext: number }) {
  const percent = xpToNext > 0 ? Math.min(100, Math.max(0, (currentXp / xpToNext) * 100)) : 100;

  return (
    <div className={styles.wrap}>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${percent}%` }} />
      </div>
      <span className={styles.label}>
        {currentXp.toLocaleString()} / {xpToNext.toLocaleString()} XP
      </span>
    </div>
  );
}
