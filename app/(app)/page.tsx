import { getSkills } from "@/lib/skills/queries";
import { CharacterHeader } from "@/components/CharacterHeader/CharacterHeader";
import { SkillCard } from "@/components/SkillCard/SkillCard";
import styles from "./page.module.css";

// XP changes on every logged session, so this page is never worth statically caching.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const skills = await getSkills();

  return (
    <div className={styles.wrap}>
      <CharacterHeader skillLevels={skills.map((skill) => skill.current_level)} />

      {skills.length === 0 ? (
        <p className={styles.empty}>
          No skills found. Run <code>supabase/migrations/0001_init.sql</code> against your
          Supabase project to seed the 7 skills.
        </p>
      ) : (
        <div className={styles.grid}>
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      )}
    </div>
  );
}
