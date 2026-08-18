import { formatSessionDate } from "@/lib/format-time";
import type { XpEvent } from "@/lib/supabase/types";
import styles from "./SessionEntry.module.css";

export function SessionEntry({
  event,
  skillName,
}: {
  event: XpEvent;
  /** Shown when this feed spans multiple skills (e.g. the global activity feed). */
  skillName?: string;
}) {
  return (
    <div className={`${styles.entry} panel panel-framed`}>
      <div className={styles.top}>
        {skillName ? <span className={styles.skillName}>{skillName}</span> : null}
        <span className={styles.date}>{formatSessionDate(event.created_at)}</span>
      </div>
      <div className={styles.meta}>
        <span className={styles.duration}>{event.duration_minutes} min</span>
        <span className={styles.xp}>+{event.xp_awarded} XP</span>
      </div>
      {event.note ? <p className={styles.note}>{event.note}</p> : null}
    </div>
  );
}
