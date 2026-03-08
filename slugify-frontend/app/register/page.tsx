'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { register } from '@/lib/api'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState('')

  const handleSubmit = async () => {
    if (!form.email || !form.name) {
      toast.error('Fill in all fields')
      return
    }
    setLoading(true)
    try {
      const data = await register(form.email, form.name)
      if (data.error) { toast.error(data.error); return }
      localStorage.setItem('slugify_api_key', data.user.apiKey)
      localStorage.setItem('slugify_user', JSON.stringify(data.user))
      setApiKey(data.user.apiKey)
      toast.success('Account created!')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (apiKey) {
    return (
      <main className="min-h-screen bg-[#080808] flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-xl mx-auto mb-4">✓</div>
            <h1 className="font-display font-black text-2xl tracking-tight mb-2">You're in!</h1>
            <p className="text-[#666] text-sm">Save your API key — you'll need it to use Slugify.</p>
          </div>
          <div className="bg-[#0f0f0f] border border-[#2e2e2e] rounded-xl p-5 mb-6">
            <p className="text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-2">Your API Key</p>
            <div className="flex items-center gap-3">
              <code className="flex-1 font-mono text-xs text-[#f0f0f0] bg-[#080808] border border-[#1c1c1c] rounded-lg p-3 break-all">{apiKey}</code>
              <button
                onClick={() => { navigator.clipboard.writeText(apiKey); toast.success('Copied!') }}
                className="text-purple-400 hover:text-purple-300 text-xs font-mono border border-[#2e2e2e] hover:border-purple-500/40 px-3 py-2 rounded-lg transition-all"
              >
                copy
              </button>
            </div>
          </div>
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 mb-6">
            <p className="text-yellow-400/80 text-xs font-mono">⚠ This key won't be shown again. Store it safely.</p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-display font-bold transition-all hover:-translate-y-px"
          >
            Go to dashboard →
          </button>
        </div>
      </main>
    )
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
          <h1 className="font-display font-black text-4xl tracking-tight mb-2">Create account</h1>
          <p className="text-[#666] text-sm">Start shortening links in seconds.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-mono text-[#666] uppercase tracking-widest block mb-2">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Lucky Jha"
              className="w-full bg-[#0f0f0f] border border-[#2e2e2e] focus:border-purple-500 focus:shadow-[0_0_0_3px_rgba(147,51,234,0.15)] rounded-xl px-4 py-3 text-sm text-[#f0f0f0] placeholder-[#444] outline-none transition-all font-mono"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-[#666] uppercase tracking-widest block mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="lucky@gmail.com"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              className="w-full bg-[#0f0f0f] border border-[#2e2e2e] focus:border-purple-500 focus:shadow-[0_0_0_3px_rgba(147,51,234,0.15)] rounded-xl px-4 py-3 text-sm text-[#f0f0f0] placeholder-[#444] outline-none transition-all font-mono"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 rounded-xl font-display font-bold transition-all hover:-translate-y-px mt-2"
          >
            {loading ? 'Creating...' : 'Create account →'}
          </button>
        </div>

        <p className="text-[#444] text-xs font-mono mt-6 text-center">
          Already have a key?{' '}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">Login →</Link>
        </p>
      </div>
    </main>
  )
}
