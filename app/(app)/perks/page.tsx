import type { Metadata } from "next";
import { getUnlockedPerks, getTotalPerkCount } from "@/lib/perks/queries";
import { PerkListItem } from "@/components/PerkListItem/PerkListItem";
import styles from "./perks.module.css";

export const metadata: Metadata = { title: "Perks Earned — Character Sheet" };
export const dynamic = "force-dynamic";

export default async function PerksEarnedPage() {
  const [perks, totalPerks] = await Promise.all([getUnlockedPerks(), getTotalPerkCount()]);

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Perks Earned</h1>
      <p className={styles.subtitle}>
        {perks.length} of {totalPerks} perks unlocked.
      </p>

      {perks.length === 0 ? (
        <p className={styles.empty}>No perks unlocked yet. Level up a skill to earn your first.</p>
      ) : (
        <div className={styles.grid}>
          {perks.map((perk) => (
            <PerkListItem key={perk.id} perk={perk} skillName={perk.skillName} />
          ))}
        </div>
      )}
    </div>
  );
}
