import { cookies } from "next/headers";
import { createSessionCookie, getSessionCookieName } from "./session";

const ONE_WEEK_S = 60 * 60 * 24 * 7;

export async function setSession(username: string) {
  const value = await createSessionCookie(username);
  const name = getSessionCookieName();
  const store = await cookies();

  store.set(name, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_WEEK_S,
    expires: new Date(Date.now() + ONE_WEEK_S * 1000),
  });
}

export async function clearSession() {
  const name = getSessionCookieName();
  const store = await cookies();

  store.set(name, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}