"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { safeCallbackUrl } from "@/lib/auth/callback-url";

export function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError(null);
    setLoading(true);
    try {
      const res = await signIn("admin-credentials", { email, password, redirect: false });
      if (res?.error) return setError("E-posta veya şifre yanlış.");
      router.push(safeCallbackUrl(params.get("callbackUrl"), "/admin"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <input className="ev-input" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        className="ev-input"
        placeholder="Şifre"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />
      {error && <p style={{ color: "var(--rose)", fontSize: 13, margin: 0 }}>{error}</p>}
      <button className="ev-btn" disabled={loading || !email || !password} onClick={submit}>
        {loading ? "…" : "Giriş Yap"}
      </button>
    </div>
  );
}
