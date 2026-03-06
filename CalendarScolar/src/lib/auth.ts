import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { db } from './db'
import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'
import { authConfig } from './auth.config'
import { rateLimit } from './rate-limit'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Rate limit login attempts by email (5 attempts per 15 minutes)
        const loginKey = `login:${(credentials.email as string).toLowerCase()}`
        const limit = rateLimit(loginKey, 5, 15 * 60 * 1000)
        if (!limit.success) {
          throw new Error('Prea multe încercări. Reîncearcă mai târziu.')
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user) {
          return null
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
})

declare module 'next-auth' {
  interface User {
    role: Role
  }
  interface Session {
    user: {
      id: string
      email: string
      role: Role
    }
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string
    role: Role
  }
}
