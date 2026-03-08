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
    console.log('🔵 Attempting register for:', user.email)
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, name: user.name }),
    })
    const data = await res.json()
    console.log('🟡 Register response:', JSON.stringify(data))

    if (data.user?.apiKey) {
      ;(user as any).apiKey = data.user.apiKey
      console.log('✅ Got apiKey from register')
    } else {
      console.log('🟠 User exists, trying login-google...')
      const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login-google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      })
      const loginData = await loginRes.json()
      console.log('🟡 Login-google response:', JSON.stringify(loginData))
      ;(user as any).apiKey = loginData.apiKey
    }
    return true
  } catch (err) {
    console.error('❌ SignIn error:', err)
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