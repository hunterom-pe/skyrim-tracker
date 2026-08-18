import type { Metadata } from "next";
import { login } from "@/lib/auth/actions";
import styles from "./login.module.css";

export const metadata: Metadata = { title: "Sign in — Character Sheet" };

export default async function LoginPage(props: PageProps<"/login">) {
  const searchParams = await props.searchParams;
  const hasError = typeof searchParams.error === "string";
  const next = typeof searchParams.next === "string" ? searchParams.next : "/";

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <p className={styles.crest}>⚔</p>
        <h1 className={styles.title}>Character Sheet</h1>
        <p className={styles.subtitle}>Enter the password to continue your journey.</p>

        {hasError ? <p className={styles.error}>Wrong password. Try again.</p> : null}

        <form className={styles.form} action={login}>
          <input type="hidden" name="next" value={next} />
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
