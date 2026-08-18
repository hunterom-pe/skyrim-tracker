import { calculateCharacterLevel, titleForCharacterLevel } from "@/lib/xp";
import styles from "./CharacterHeader.module.css";

export function CharacterHeader({ skillLevels }: { skillLevels: number[] }) {
  const level = calculateCharacterLevel(skillLevels);
  const title = titleForCharacterLevel(level);

  return (
    <div className={`${styles.banner} panel`}>
      <p className={styles.eyebrow}>Character Level</p>
      <p className={styles.level}>{level}</p>
      <p className={styles.title}>{title}</p>
    </div>
  );
}
