import type { Metadata } from "next";
import { getSkills } from "@/lib/skills/queries";
import { LogSessionForm } from "@/components/LogSessionForm/LogSessionForm";
import styles from "./log.module.css";

export const metadata: Metadata = { title: "Log a session — Character Sheet" };
export const dynamic = "force-dynamic";

export default async function LogSessionPage(props: PageProps<"/log">) {
  const searchParams = await props.searchParams;
  const preselectedSkillId =
    typeof searchParams.skill === "string" ? searchParams.skill : undefined;

  const skills = await getSkills();

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Log a Session</h1>
      <p className={styles.subtitle}>
        The first 30 minutes earn full XP, the next 30 earn half, and anything beyond that earns
        a quarter — so a focused half hour is worth more per minute than marathon sessions.
      </p>
      <LogSessionForm skills={skills} preselectedSkillId={preselectedSkillId} />
    </div>
  );
}
