'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { getMe } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!apiKey.trim()) { toast.error('Enter your API key'); return }
    setLoading(true)
    try {
      localStorage.setItem('slugify_api_key', apiKey.trim())
      const data = await getMe()
      if (data.error) {
        localStorage.removeItem('slugify_api_key')
        toast.error('Invalid API key')
        return
      }
      localStorage.setItem('slugify_user', JSON.stringify(data))
      toast.success(`Welcome back, ${data.name || data.email}!`)
      router.push('/dashboard')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#080808] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(147,51,234,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center gap-2 font-display font-black text-lg mb-10 text-[#f0f0f0]">
          <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_12px_#9333ea]" />
          Slugify
        </Link>

        <div className="mb-8">
          <h1 className="font-display font-black text-4xl tracking-tight mb-2">Welcome back</h1>
          <p className="text-[#666] text-sm">Paste your API key to continue.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-mono text-[#666] uppercase tracking-widest block mb-2">API Key</label>
            <input
              type="text"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="clx9f0s3k0001..."
              className="w-full bg-[#0f0f0f] border border-[#2e2e2e] focus:border-purple-500 focus:shadow-[0_0_0_3px_rgba(147,51,234,0.15)] rounded-xl px-4 py-3 text-sm text-[#f0f0f0] placeholder-[#444] outline-none transition-all font-mono"
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 rounded-xl font-display font-bold transition-all hover:-translate-y-px"
          >
            {loading ? 'Verifying...' : 'Login →'}
          </button>
        </div>

        <p className="text-[#444] text-xs font-mono mt-6 text-center">
          No account yet?{' '}
          <Link href="/register" className="text-purple-400 hover:text-purple-300 transition-colors">Register →</Link>
        </p>
      </div>
    </main>
  )
}
