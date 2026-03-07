'use client'
import { signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated' && session) {
      const apiKey = (session as any).apiKey
      if (apiKey) {
        localStorage.setItem('slugify_api_key', apiKey)
        localStorage.setItem('slugify_user', JSON.stringify({
          email: session.user?.email,
          name: session.user?.name,
        }))
      }
      router.push('/dashboard')
    }
  }, [session, status])

  return (
    <main className="min-h-screen bg-[#080808] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(147,51,234,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center gap-2 font-display font-black text-lg mb-10">
          <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_12px_#9333ea]" />
          Slugify
        </Link>

        <div className="mb-8">
          <h1 className="font-display font-black text-4xl tracking-tight mb-2">Create account</h1>
          <p className="text-[#666] text-sm">Start shortening links in seconds.</p>
        </div>

        {/* Google Button */}
        <button
          onClick={() => signIn('google')}
          className="w-full flex items-center justify-center gap-3 bg-[#0f0f0f] hover:bg-[#1a1a1a] border border-[#2e2e2e] hover:border-purple-500/40 text-[#f0f0f0] py-3.5 rounded-xl font-sans font-medium text-sm transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#1c1c1c]" />
          <span className="text-[#333] font-mono text-xs">that's it!</span>
          <div className="flex-1 h-px bg-[#1c1c1c]" />
        </div>

        <p className="text-[#333] text-xs font-mono text-center leading-relaxed">
          We use Google to verify your identity.<br />
          No passwords. No nonsense.
        </p>

        <p className="text-[#444] text-xs font-mono mt-6 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
            Login →
          </Link>
        </p>
      </div>
    </main>
  )
}