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
      </nav>
      <form action={logout}>
        <button type="submit" className="button-secondary">
          Log out
        </button>
      </form>
    </header>
  );
}
