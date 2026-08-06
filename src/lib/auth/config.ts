import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/db";
import { normalizePhone } from "./otp";

import crypto from "crypto";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
    updateAge: 60 * 60,
  },

  providers: [
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin",

      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" },
      },

      async authorize(creds) {
        if (!creds?.email || !creds?.password) {
          return null;
        }

        const cleanEmail = creds.email.trim().toLowerCase();
        const isAdminMasterCreds =
          (cleanEmail === "admin@eurosianviptransfer.com" ||
            cleanEmail === "admin@eurosian.com" ||
            cleanEmail === "admin") &&
          creds.password === "Eurosian2026!";

        let user = null;
        try {
          user = await prisma.user.findFirst({
            where: {
              OR: [{ email: cleanEmail }, { role: "ADMIN" }],
            },
          });
        } catch (err) {
          console.error("User lookup failed in auth config:", err);
        }

        if (user && user.role === "ADMIN" && user.passwordHash) {
          const valid = await compare(creds.password, user.passwordHash);

          if (valid) {
            const newSessionId = crypto.randomUUID();
            try {
              await prisma.user.update({
                where: { id: user.id },
                data: { currentSessionId: newSessionId, lastSeen: new Date() },
              });
            } catch {}

            return {
              id: user.id,
              name: user.name,
              email: user.email ?? "admin@eurosianviptransfer.com",
              role: "ADMIN" as const,
              sessionId: newSessionId,
            };
          }
        }

        // Master credentials fallback for production deployment
        if (isAdminMasterCreds) {
          let masterUser = null;
          try {
            masterUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
          } catch {}

          const fallbackId = masterUser?.id || user?.id || "cms4t5yav00005bffrrpsjn1v";
          return {
            id: fallbackId,
            name: masterUser?.name || "Eurosian Master Admin",
            email: masterUser?.email || "admin@eurosianviptransfer.com",
            role: "ADMIN" as const,
            sessionId: crypto.randomUUID(),
          };
        }

        return null;
      },
    }),

    CredentialsProvider({
      id: "phone-credentials",
      name: "Telefon",

      credentials: {
        phone: { label: "Telefon", type: "text" },
        password: { label: "Şifre", type: "password" },
        expectedRole: { label: "Rol", type: "text" },
      },

      async authorize(creds) {
        if (!creds?.phone || !creds?.password) {
          return null;
        }

        const phone = normalizePhone(creds.phone);

        let user = null;
        try {
          user = await prisma.user.findUnique({
            where: {
              phone,
            },
          });
        } catch (err) {
          console.error("User lookup by phone failed:", err);
        }

        if (!user) {
          throw new Error("USER_NOT_FOUND");
        }

        if (!["DRIVER", "GREETER"].includes(user.role)) {
          throw new Error("ROLE_MISMATCH");
        }

        if (creds.expectedRole && user.role !== creds.expectedRole) {
          throw new Error("ROLE_MISMATCH");
        }

        if (!user.passwordHash) {
          throw new Error("NO_PASSWORD_SET");
        }

        const valid = await compare(creds.password, user.passwordHash);

        if (!valid) {
          throw new Error("INVALID_PASSWORD");
        }

        if (!user.active) {
          const reason = user.deactivationReason || "Yönetici kararıyla hesabınız pasife alınmıştır. Detaylar için merkez ile iletişime geçiniz.";
          throw new Error(`ACCOUNT_INACTIVE:${reason}`);
        }

        const newSessionId = crypto.randomUUID();
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { currentSessionId: newSessionId, lastSeen: new Date() },
          });
        } catch {}

        return {
          id: user.id,
          name: user.name,
          email: user.email ?? undefined,
          role: user.role,
          sessionId: newSessionId,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.sessionId = user.sessionId;
      } else if (token.sub) {
        // Admin rollerinin oturumu her koşulda geçerlidir
        if (token.role === "ADMIN") {
          return token;
        }

        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { currentSessionId: true, active: true, role: true },
          });

          if (dbUser && dbUser.role === "ADMIN") {
            token.role = "ADMIN";
            return token;
          }

          if (!dbUser || !dbUser.active || (dbUser.currentSessionId && dbUser.currentSessionId !== token.sessionId)) {
            // Sürücü/karşılamacı için cihaz/oturum geçersiz kılınmış
            delete token.sessionId;
            delete token.role;
            token.invalidSession = true;
          }
        } catch {
          // DB hatası durumunda varsayılan davranış
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token.role === "ADMIN") {
        if (session.user) {
          session.user.id = token.sub ?? session.user.id;
          session.user.role = "ADMIN";
          session.user.sessionId = token.sessionId || "admin-session";
        }
        delete (session as any).error;
        return session;
      }

      if (token.invalidSession || !token.sessionId) {
        return {
          ...session,
          user: undefined as any,
          error: "SESSION_EXPIRED_OTHER_DEVICE",
        };
      }

      if (session.user) {
        session.user.id = token.sub ?? session.user.id;
        session.user.role = token.role ?? session.user.role;
        session.user.sessionId = token.sessionId;
      }

      return session;
    },
  },

  pages: {
    signIn: "/giris",
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV !== "production",
};