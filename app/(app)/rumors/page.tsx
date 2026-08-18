import type { Metadata } from "next";
import Link from "next/link";
import { getRumorEntries } from "@/lib/rumors/queries";
import { RumorCard } from "@/components/RumorCard/RumorCard";
import styles from "./rumors.module.css";

export const metadata: Metadata = { title: "Rumor Board — Character Sheet" };
export const dynamic = "force-dynamic";

export default async function RumorBoardPage(props: PageProps<"/rumors">) {
  const searchParams = await props.searchParams;
  const confirmedOnly = searchParams.filter === "confirmed";

  const entries = await getRumorEntries({ confirmedOnly });

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Rumor Board</h1>
      <p className={styles.subtitle}>
        A hand-curated notice board of Elder Scrolls 6 news and rumors — not a live feed.
      </p>

      <div className={styles.filters}>
        <Link
          href="/rumors"
          className={`${styles.filterLink} ${!confirmedOnly ? styles.filterActive : ""}`}
        >
          All
        </Link>
        <Link
          href="/rumors?filter=confirmed"
          className={`${styles.filterLink} ${confirmedOnly ? styles.filterActive : ""}`}
        >
          Confirmed Only
        </Link>
      </div>

      {entries.length === 0 ? (
        <p className={styles.empty}>Nothing posted here yet.</p>
      ) : (
        <div className={styles.list}>
          {entries.map((entry) => (
            <RumorCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
