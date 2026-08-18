import { logout } from "@/lib/auth/actions";
import { getSkills } from "@/lib/skills/queries";
import styles from "./page.module.css";

// XP changes on every logged session, so this page is never worth statically caching.
export const dynamic = "force-dynamic";

// Placeholder root page for delta 1 — proves the login gate and Supabase
// connection work end-to-end. Replaced by the real dashboard in delta 4.
export default async function HomePage() {
  const skills = await getSkills();

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h1>Character Sheet</h1>
        <form action={logout}>
          <button type="submit" className="button-secondary">
            Log out
          </button>
        </form>
      </div>

      {skills.length === 0 ? (
        <p className={styles.empty}>
          No skills found. Run <code>supabase/migrations/0001_init.sql</code> against your
          Supabase project to seed the 7 skills.
        </p>
      ) : (
        <ul className={styles.list}>
          {skills.map((skill) => (
            <li key={skill.id} className={`${styles.item} panel`}>
              <span className={styles.name}>{skill.name}</span>
              <span className={styles.level}>
                Lvl {skill.current_level} · {skill.current_xp} XP
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
