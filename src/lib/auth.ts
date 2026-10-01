import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { checkRateLimit, clearRateLimit, isRateLimited } from "@/lib/rateLimit"

const FAIL_WINDOW_MS = 15 * 60_000
const MAX_FAILS_PER_ACCOUNT_IP = 5
const MAX_FAILS_PER_IP = 20

function headerValue(headers: unknown, name: string): string | undefined {
  if (!headers) return undefined
  if (typeof (headers as Headers).get === "function") {
    return (headers as Headers).get(name) ?? undefined
  }
  const raw = (headers as Record<string, string | string[] | undefined>)[name]
  return Array.isArray(raw) ? raw[0] : raw
}

function loginIp(req: unknown): string {
  const headers = (req as { headers?: unknown } | undefined)?.headers
  const forwarded = headerValue(headers, "x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return headerValue(headers, "x-real-ip") ?? "unknown"
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@autopacbd.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const ip = loginIp(req)
        const email = credentials.email.trim().toLowerCase()
        const accountKey = `login-fail:${ip}:${email}`
        const ipKey = `login-fail-ip:${ip}`

        if (
          !isRateLimited(accountKey, MAX_FAILS_PER_ACCOUNT_IP).allowed ||
          !isRateLimited(ipKey, MAX_FAILS_PER_IP).allowed
        ) {
          throw new Error("RATE_LIMITED")
        }

        const recordFailure = () => {
          checkRateLimit(accountKey, MAX_FAILS_PER_ACCOUNT_IP, FAIL_WINDOW_MS)
          checkRateLimit(ipKey, MAX_FAILS_PER_IP, FAIL_WINDOW_MS)
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.trim() }
        })

        if (!user) return recordFailure()

        const isPasswordValid = await compare(credentials.password, user.password)
        if (!isPasswordValid) return recordFailure()

        clearRateLimit(accountKey)

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id,
        role: token.role,
      }
      return session
    }
  },
  pages: {
    signIn: '/admin/login',
  }
}
