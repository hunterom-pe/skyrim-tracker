import type { RumorEntry } from "@/lib/supabase/types";
import styles from "./RumorCard.module.css";

const CATEGORY_CLASS: Record<RumorEntry["category"], string> = {
  Confirmed: styles.confirmed,
  Rumor: styles.rumor,
  Speculation: styles.speculation,
};

function formatPostedDate(dateOnly: string): string {
  // date_posted is a plain SQL date (no time/timezone) — parse as UTC noon
  // so it never shifts a day depending on the reader's local timezone.
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${dateOnly}T12:00:00Z`));
}

export function RumorCard({ entry }: { entry: RumorEntry }) {
  return (
    <div className={`${styles.card} panel panel-framed`}>
      <div className={styles.top}>
        <span className={`${styles.category} ${CATEGORY_CLASS[entry.category]}`}>
          {entry.category}
        </span>
        <span className={styles.date}>{formatPostedDate(entry.date_posted)}</span>
      </div>
      <h3 className={styles.headline}>{entry.headline}</h3>
      <p className={styles.summary}>{entry.summary}</p>
      <a href={entry.source_url} target="_blank" rel="noopener noreferrer" className={styles.source}>
        {entry.source_name} ↗
      </a>
    </div>
  );
}
