"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth/actions";
import { AudioToggle } from "@/components/AudioToggle/AudioToggle";
import styles from "./Nav.module.css";

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/log", label: "Log Session" },
  { href: "/history", label: "Quest Journal" },
  { href: "/perks", label: "Perks Earned" },
  { href: "/rumors", label: "Rumor Board" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className={styles.nav}>
      <Link href="/" className={styles.brand}>
        Character Sheet
      </Link>
      <nav className={styles.links}>
        {NAV_LINKS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={styles.link}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className={styles.actions}>
        <AudioToggle />
        <form action={logout}>
          <button type="submit" className="button-secondary">
            Log out
          </button>
        </form>
      </div>
    </header>
  );
}
