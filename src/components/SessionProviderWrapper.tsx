"use client";

import { useEffect } from "react";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

function SingleSessionWatcher() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      if ((session as any)?.error === "SESSION_EXPIRED_OTHER_DEVICE" || !session?.user) {
        signOut({ redirect: false }).then(() => {
          alert("Hesabınıza başka bir cihazdan giriş yapıldığı için bu cihazdaki oturumunuz kapatılmıştır.");
          router.push("/giris?reason=other_device");
        });
      }
    }
  }, [session, status, router]);

  return null;
}

export function SessionProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={true} refetchInterval={30}>
      <SingleSessionWatcher />
      {children}
    </SessionProvider>
  );
}
