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

        const user = await prisma.user.findUnique({
          where: {
            email: cleanEmail,
          },
        });

        if (
          !user ||
          user.role !== "ADMIN" ||
          !user.passwordHash ||
          !user.active
        ) {
          return null;
        }

        const valid = await compare(creds.password, user.passwordHash);

        if (!valid) {
          return null;
        }

        const newSessionId = crypto.randomUUID();
        await prisma.user.update({
          where: { id: user.id },
          data: { currentSessionId: newSessionId, lastSeen: new Date() },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email ?? undefined,
          role: user.role,
          sessionId: newSessionId,
        };
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

        const user = await prisma.user.findUnique({
          where: {
            phone,
          },
        });

        if (!user || !user.active) {
          return null;
        }

        if (!["DRIVER", "GREETER"].includes(user.role)) {
          return null;
        }

        if (
          creds.expectedRole &&
          user.role !== creds.expectedRole
        ) {
          return null;
        }

        if (!user.passwordHash) {
          return null;
        }

        const valid = await compare(creds.password, user.passwordHash);

        if (!valid) {
          return null;
        }

        const newSessionId = crypto.randomUUID();
        await prisma.user.update({
          where: { id: user.id },
          data: { currentSessionId: newSessionId, lastSeen: new Date() },
        });

        return {
          id: user.id,
          name: user.name,
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
        // Her istekte/yenilemede kullanıcının veritabanındaki aktif session kimliğini sorgula
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { currentSessionId: true, active: true },
          });

          if (!dbUser || !dbUser.active || dbUser.currentSessionId !== token.sessionId) {
            // Cihaz/oturum geçersiz kılınmış (Farklı cihazdan girilmiş ya da kullanıcı pasife alınmış)
            delete token.sessionId;
            delete token.role;
            token.invalidSession = true;
          }
        } catch {
          // DB hatası durumunda oturumu riske atmadan varsayılan davranış
        }
      }

      return token;
    },

    async session({ session, token }) {
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