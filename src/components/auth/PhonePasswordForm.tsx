"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { safeCallbackUrl } from "@/lib/auth/callback-url";

interface Props {
  expectedRole: "DRIVER" | "GREETER";
  defaultRedirect: string;
}

export function PhonePasswordForm({
  expectedRole,
  defaultRedirect,
}: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await signIn("phone-credentials", {
        redirect: false,
        phone,
        password,
        expectedRole,
      });

      if (res?.error) {
        setError("Telefon numarası veya şifre hatalı.");
        return;
      }

      router.push(
        safeCallbackUrl(
          params.get("callbackUrl"),
          defaultRedirect
        )
      );
    } catch (err) {
      console.error(err);
      setError("Giriş sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <input
        className="ev-input"
        placeholder="Telefon (05xx xxx xx xx)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        className="ev-input"
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            submit();
          }
        }}
      />

      {error && (
        <p
          style={{
            color: "var(--rose)",
            fontSize: 13,
            margin: 0,
          }}
        >
          {error}
        </p>
      )}

      <button
        className="ev-btn"
        disabled={loading || !phone || !password}
        onClick={submit}
      >
        {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
      </button>
    </div>
  );
}