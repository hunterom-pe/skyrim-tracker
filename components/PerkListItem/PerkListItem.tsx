import type { Perk } from "@/lib/supabase/types";
import styles from "./PerkListItem.module.css";

export function PerkListItem({
  perk,
  skillName,
}: {
  perk: Perk;
  /** Shown when this list mixes perks from multiple skills (e.g. the perks-earned view). */
  skillName?: string;
}) {
  return (
    <div
      className={`${styles.perk} panel ${perk.is_unlocked ? styles.unlocked : styles.locked}`}
    >
      <div className={styles.top}>
        <span className={styles.unlockLevel}>Lvl {perk.unlock_level}</span>
        {perk.is_unlocked ? (
          <span className={styles.badge}>Unlocked</span>
        ) : (
          <span className={styles.lockIcon} aria-label="Locked">
            🔒
          </span>
        )}
      </div>
      <p className={styles.name}>{perk.name}</p>
      {skillName ? <p className={styles.skillName}>{skillName}</p> : null}
      <p className={styles.description}>{perk.description}</p>
    </div>
  );
}
