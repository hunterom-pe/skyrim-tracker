import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSkillBySlug } from "@/lib/skills/queries";
import { getPerksForSkill } from "@/lib/perks/queries";
import { getXpEventsForSkill } from "@/lib/xp-events/queries";
import { xpToNextLevel } from "@/lib/xp";
import { XpBar } from "@/components/XpBar/XpBar";
import { PerkListItem } from "@/components/PerkListItem/PerkListItem";
import { SessionEntry } from "@/components/SessionEntry/SessionEntry";
import styles from "./skill-detail.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/skills/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const skill = await getSkillBySlug(slug);
  return { title: skill ? `${skill.name} — Character Sheet` : "Skill not found" };
}

export default async function SkillDetailPage(props: PageProps<"/skills/[slug]">) {
  const { slug } = await props.params;
  const skill = await getSkillBySlug(slug);
  if (!skill) notFound();

  const [perks, events] = await Promise.all([
    getPerksForSkill(skill.id),
    getXpEventsForSkill(skill.id),
  ]);

  const xpToNext = xpToNextLevel(skill.current_level);

  return (
    <div className={styles.wrap}>
      <Link href="/" className={styles.back}>
        ← Back to Dashboard
      </Link>

      <div className={`${styles.header} panel panel-framed`}>
        <div className={styles.headerTop}>
          <h1 className={styles.name}>{skill.name}</h1>
          <span className={styles.level}>Lvl {skill.current_level}</span>
        </div>
        <p className={styles.description}>{skill.description}</p>
        <XpBar currentXp={skill.current_xp} xpToNext={xpToNext} />
        <Link href={`/log?skill=${skill.id}`} className={`${styles.logButton} button-primary`}>
          + Log Session
        </Link>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Perks</h2>
        <div className={styles.perkGrid}>
          {perks.map((perk) => (
            <PerkListItem key={perk.id} perk={perk} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Session History</h2>
        {events.length === 0 ? (
          <p className={styles.empty}>No sessions logged yet.</p>
        ) : (
          <div className={styles.history}>
            {events.map((event) => (
              <SessionEntry key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
