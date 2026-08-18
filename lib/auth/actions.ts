"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createSessionCookieValue,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE_SECONDS,
} from "./gate";

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/");
  const safeNext = nextPath.startsWith("/") ? nextPath : "/";

  if (password !== process.env.SITE_PASSWORD) {
    redirect(`/login?error=1&next=${encodeURIComponent(safeNext)}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, await createSessionCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
  });

  redirect(safeNext);
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/login");
}
