"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return <button className="ev-btn ev-btn--ghost" type="button" onClick={() => signOut({ callbackUrl: "/giris" })}>
    Çıkış yap
  </button>;
}
