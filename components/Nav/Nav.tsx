import Link from "next/link";
import { logout } from "@/lib/auth/actions";
import styles from "./Nav.module.css";

export function Nav() {
  return (
    <header className={styles.nav}>
      <Link href="/" className={styles.brand}>
        Character Sheet
      </Link>
      <nav className={styles.links}>
        <Link href="/" className={styles.link}>
          Dashboard
        </Link>
        <Link href="/log" className={styles.link}>
          Log Session
        </Link>
        <Link href="/history" className={styles.link}>
          Quest Journal
        </Link>
        <Link href="/perks" className={styles.link}>
          Perks Earned
        </Link>
      </nav>
      <form action={logout}>
        <button type="submit" className="button-secondary">
          Log out
        </button>
      </form>
    </header>
  );
}
