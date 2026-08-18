import type { Metadata } from "next";
import { getAllXpEvents } from "@/lib/xp-events/queries";
import { SessionEntry } from "@/components/SessionEntry/SessionEntry";
import styles from "./history.module.css";

export const metadata: Metadata = { title: "Quest Journal — Character Sheet" };
export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const events = await getAllXpEvents();

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Quest Journal</h1>
      <p className={styles.subtitle}>Every session, across every skill, most recent first.</p>

      {events.length === 0 ? (
        <p className={styles.empty}>No entries yet. Log a session to begin your journal.</p>
      ) : (
        <div className={styles.feed}>
          {events.map((event) => (
            <SessionEntry key={event.id} event={event} skillName={event.skillName} />
          ))}
        </div>
      )}
    </div>
  );
}
