import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/db";
import { normalizePhone } from "./otp";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
    updateAge: 60 * 60,
  },

  providers: [
    // Standart 'credentials' id'si ile hem varsayılan hem admin girişini yakalayalım
    CredentialsProvider({
      id: "credentials",
      name: "Admin Credentials",

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

        return {
          id: user.id,
          name: user.name,
          email: user.email ?? undefined,
          role: user.role,
        };
      },
    }),

    // Admin dışındaki özel provider (aynı id ile kalabilir)
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

        return {
          id: user.id,
          name: user.name,
          email: user.email ?? undefined,
          role: user.role,
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

        return {
          id: user.id,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).role = (user as any).role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = (token as any).role;
      }

      return session;
    },
  },

  pages: {
    signIn: "/giris",
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: true, // Sorun çözülene kadar Vercel loglarında detay görmek için açık kalsın
};