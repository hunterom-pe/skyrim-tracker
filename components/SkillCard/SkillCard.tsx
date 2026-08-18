import Link from "next/link";
import { xpToNextLevel } from "@/lib/xp";
import { XpBar } from "@/components/XpBar/XpBar";
import { SKILL_ICONS } from "@/components/icons/SkillIcons";
import type { Skill } from "@/lib/supabase/types";
import styles from "./SkillCard.module.css";

export function SkillCard({ skill }: { skill: Skill }) {
  const xpToNext = xpToNextLevel(skill.current_level);
  const Icon = SKILL_ICONS[skill.slug];

  return (
    <div className={`${styles.card} panel panel-framed panel-hover`}>
      <div className={styles.header}>
        <h3 className={styles.name}>
          <Link href={`/skills/${skill.slug}`} className={styles.nameLink}>
            {Icon ? <Icon className={styles.icon} /> : null}
            {skill.name}
          </Link>
        </h3>
        <span className={styles.level}>Lvl {skill.current_level}</span>
      </div>
      <p className={styles.description}>{skill.description}</p>
      <XpBar currentXp={skill.current_xp} xpToNext={xpToNext} />
      <Link href={`/log?skill=${skill.id}`} className={`${styles.logButton} button-secondary`}>
        + Log Session
      </Link>
    </div>
  );
}
