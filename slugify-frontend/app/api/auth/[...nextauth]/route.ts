import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        // register or find user in our backend
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
          }),
        })
        const data = await res.json()

        // store apiKey on user object to pass to session
        if (data.user?.apiKey) {
          (user as any).apiKey = data.user.apiKey
        } else if (data.error === 'User already exists') {
          // user exists — fetch their api key
          const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login-google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email }),
          })
          const meData = await meRes.json()
          ;(user as any).apiKey = meData.apiKey
        }
        return true
      } catch {
        return false
      }
    },

    async jwt({ token, user }) {
      // first sign in — attach apiKey to token
      if (user) {
        token.apiKey = (user as any).apiKey
      }
      return token
    },

    async session({ session, token }) {
      // attach apiKey to session so frontend can access it
      ;(session as any).apiKey = token.apiKey
      return session
    },
  },

  pages: {
    signIn: '/login',
  },
})

export { handler as GET, handler as POST }