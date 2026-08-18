"use client";

import { useActionState, useEffect, useRef } from "react";
import { logSession, type LogSessionState } from "@/lib/xp-events/actions";
import { useToastQueue } from "@/components/Toast/ToastProvider";
import type { Skill } from "@/lib/supabase/types";
import styles from "./LogSessionForm.module.css";

const initialState: LogSessionState = { status: "idle" };

export function LogSessionForm({
  skills,
  preselectedSkillId,
}: {
  skills: Skill[];
  preselectedSkillId?: string;
}) {
  const [state, formAction, isPending] = useActionState(logSession, initialState);
  const { pushXpToast, pushLevelUpToast, pushPerkToast } = useToastQueue();
  const formRef = useRef<HTMLFormElement>(null);
  const lastHandledEventId = useRef<string | null>(null);

  useEffect(() => {
    if (state.status !== "success") return;
    if (lastHandledEventId.current === state.eventId) return;
    lastHandledEventId.current = state.eventId;

    pushXpToast({ skillName: state.skillName, xpAwarded: state.xpAwarded });

    if (state.levelsGained > 0) {
      pushLevelUpToast({
        skillName: state.skillName,
        newLevel: state.newLevel,
        levelsGained: state.levelsGained,
      });
    }

    for (const perk of state.unlockedPerks) {
      pushPerkToast({ perk });
    }

    formRef.current?.reset();
  }, [state, pushXpToast, pushLevelUpToast, pushPerkToast]);

  return (
    <form ref={formRef} action={formAction} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="skillId" className={styles.label}>
          Skill
        </label>
        <select
          id="skillId"
          name="skillId"
          defaultValue={preselectedSkillId ?? ""}
          required
          className={styles.select}
        >
          <option value="" disabled>
            Choose a skill…
          </option>
          {skills.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="durationMinutes" className={styles.label}>
          Duration (minutes)
        </label>
        <input
          id="durationMinutes"
          name="durationMinutes"
          type="number"
          min={1}
          step={1}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="note" className={styles.label}>
          Note (optional)
        </label>
        <textarea id="note" name="note" rows={3} className={styles.textarea} />
      </div>

      {state.status === "error" ? <p className={styles.error}>{state.error}</p> : null}

      <button type="submit" disabled={isPending} className={`${styles.submit} button-primary`}>
        {isPending ? "Logging…" : "Log Session"}
      </button>
    </form>
  );
}
