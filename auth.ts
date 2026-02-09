import NextAuth from "next-auth"
import github from "next-auth/providers/github"
import credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import { compare } from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    github,
    credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: String(credentials.email).trim().toLowerCase() },
        })
        const hash = (user as { passwordHash?: string | null })?.passwordHash
        if (!user || !hash) return null
        const ok = await compare(String(credentials.password), hash)
        if (!ok) return null
        return { id: String(user.id), email: user.email, name: user.name ?? undefined }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
})