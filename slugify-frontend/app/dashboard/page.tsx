'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { QRCodeSVG } from 'qrcode.react'
import { createUrl, getUrls, deleteUrl, getOverview } from '@/lib/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

interface Url {
  id: string
  slug: string
  original: string
  createdAt: string
  expiresAt: string | null
}

interface Overview {
  totalUrls: number
  totalClicks: number
  clicksPerSlug: { _id: string; count: number }[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [urls, setUrls] = useState<Url[]>([])
  const [overview, setOverview] = useState<Overview | null>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ original: '', customSlug: '', expiresAt: '' })
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [qrUrl, setQrUrl] = useState<Url | null>(null)
  const [user, setUser] = useState<{ name?: string; email: string } | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
  const key = localStorage.getItem('slugify_api_key')
  if (!key) { router.push('/login'); return }
  const u = localStorage.getItem('slugify_user')
  if (u) setUser(JSON.parse(u))
  fetchData()
}, [])

  const fetchData = async () => {
    try {
      const [urlsData, overviewData] = await Promise.all([getUrls(), getOverview()])
      setUrls(urlsData.urls || [])
      setOverview(overviewData)
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!form.original) { toast.error('Enter a URL'); return }
    setCreating(true)
    try {
      const data = await createUrl({
        original: form.original,
        customSlug: form.customSlug || undefined,
        expiresAt: form.expiresAt || undefined,
      })
      if (data.error) { toast.error(data.error); return }
      toast.success('Link created!')
      setForm({ original: '', customSlug: '', expiresAt: '' })
      setShowForm(false)
      fetchData()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('Delete this link?')) return
    try {
      await deleteUrl(slug)
      toast.success('Deleted')
      fetchData()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`${API_URL}/${slug}`)
    setCopied(slug)
    toast.success('Copied!')
    setTimeout(() => setCopied(null), 2000)
  }

  const logout = () => {
    localStorage.removeItem('slugify_api_key')
    localStorage.removeItem('slugify_user')
    router.push('/')
  }

  const getClicks = (slug: string) => {
    return overview?.clicksPerSlug?.find(c => c._id === slug)?.count || 0
  }

  if (!mounted) return (
  <main className="min-h-screen bg-[#080808] flex items-center justify-center">
    <p className="font-mono text-[#444] text-sm animate-pulse">Loading...</p>
  </main>
)

  return (
    <main className="min-h-screen bg-[#080808] text-[#f0f0f0]">

      {/* QR Modal */}
      {qrUrl && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setQrUrl(null)}>
          <div className="bg-[#0f0f0f] border border-[#2e2e2e] rounded-2xl p-8 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-lg">QR Code</h3>
              <button onClick={() => setQrUrl(null)} className="text-[#444] hover:text-[#f0f0f0] transition-colors">✕</button>
            </div>
            <div className="bg-white p-6 rounded-xl flex items-center justify-center mb-6">
              <QRCodeSVG value={`${API_URL}/${qrUrl.slug}`} size={180} />
            </div>
            <p className="text-center font-mono text-sm text-purple-400 mb-2">/{qrUrl.slug}</p>
            <p className="text-center text-[#444] text-xs truncate">{qrUrl.original}</p>
            <button
              onClick={() => { copyLink(qrUrl.slug); setQrUrl(null) }}
              className="w-full mt-6 border border-[#2e2e2e] hover:border-purple-500/40 text-sm py-2.5 rounded-xl font-mono text-[#666] hover:text-purple-400 transition-all"
            >
              copy link
            </button>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav className="border-b border-[#1c1c1c] px-8 py-4 flex items-center justify-between bg-[#080808]/80 backdrop-blur-xl sticky top-0 z-40">
        <Link href="/" className="font-display font-black text-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_12px_#9333ea]" />
          Slugify
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-[#444] font-mono text-xs">{user?.email}</span>
          <button onClick={logout} className="text-[#444] hover:text-[#f0f0f0] text-xs font-mono transition-colors">logout</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">

        {/* HEADER */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="font-display font-black text-3xl tracking-tight mb-1">
              {user?.name ? `Hey, ${user.name} 👋` : 'Dashboard'}
            </h1>
            <p className="text-[#444] text-sm font-mono">Manage and track your links</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-display font-bold text-sm transition-all hover:-translate-y-px"
          >
            + New link
          </button>
        </div>

        {/* STATS */}
        {overview && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total links', value: overview.totalUrls },
              { label: 'Total clicks', value: overview.totalClicks },
              { label: 'Avg clicks', value: overview.totalUrls ? Math.round(overview.totalClicks / overview.totalUrls) : 0 },
            ].map((s, i) => (
              <div key={i} className="bg-[#0f0f0f] border border-[#1c1c1c] rounded-xl p-5">
                <div className="text-[10px] font-mono text-[#444] uppercase tracking-widest mb-2">{s.label}</div>
                <div className="font-display font-black text-3xl text-purple-400">{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* CREATE FORM */}
        {showForm && (
          <div className="bg-[#0f0f0f] border border-purple-500/30 rounded-2xl p-6 mb-8 shadow-[0_0_0_1px_rgba(147,51,234,0.1)]">
            <h2 className="font-display font-bold text-base mb-5">Create new link</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-2">
                <label className="text-[10px] font-mono text-[#444] uppercase tracking-widest block mb-2">Original URL *</label>
                <input
                  type="url"
                  value={form.original}
                  onChange={e => setForm({ ...form, original: e.target.value })}
                  placeholder="https://very-long-url.com/..."
                  className="w-full bg-[#080808] border border-[#2e2e2e] focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-[#f0f0f0] placeholder-[#333] outline-none transition-all font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-[#444] uppercase tracking-widest block mb-2">Custom slug</label>
                <input
                  type="text"
                  value={form.customSlug}
                  onChange={e => setForm({ ...form, customSlug: e.target.value })}
                  placeholder="my-link (optional)"
                  className="w-full bg-[#080808] border border-[#2e2e2e] focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-[#f0f0f0] placeholder-[#333] outline-none transition-all font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-[#444] uppercase tracking-widest block mb-2">Expires at</label>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={e => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full bg-[#080808] border border-[#2e2e2e] focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-[#f0f0f0] outline-none transition-all font-mono"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                disabled={creating}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-display font-bold text-sm transition-all"
              >
                {creating ? 'Creating...' : 'Create link →'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="text-[#444] hover:text-[#f0f0f0] px-6 py-2.5 rounded-xl text-sm border border-[#2e2e2e] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* URLS LIST */}
        <div className="bg-[#0f0f0f] border border-[#1c1c1c] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1c1c1c] flex items-center justify-between">
            <h2 className="font-display font-bold text-sm">Your links</h2>
            <span className="text-[#444] font-mono text-xs">{urls.length} total</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-[#444] font-mono text-sm">Loading...</div>
          ) : urls.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-[#444] font-mono text-sm mb-4">No links yet.</p>
              <button onClick={() => setShowForm(true)} className="text-purple-400 text-sm font-mono hover:text-purple-300 transition-colors">
                Create your first link →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#1c1c1c]">
              {urls.map(url => (
                <div key={url.id} className="px-6 py-4 flex items-center gap-4 hover:bg-[#080808] transition-colors group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-purple-400 text-sm font-medium">/{url.slug}</span>
                      {url.expiresAt && new Date(url.expiresAt) < new Date() && (
                        <span className="text-[10px] font-mono bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">expired</span>
                      )}
                    </div>
                    <p className="text-[#444] text-xs font-mono truncate">{url.original}</p>
                  </div>

                  <div className="text-right mr-4">
                    <div className="font-display font-bold text-lg text-purple-400">{getClicks(url.slug)}</div>
                    <div className="text-[10px] text-[#444] font-mono uppercase tracking-widest">clicks</div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => copyLink(url.slug)}
                      className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${copied === url.slug ? 'border-green-500/40 text-green-400' : 'border-[#2e2e2e] text-[#666] hover:border-purple-500/40 hover:text-purple-400'}`}
                    >
                      {copied === url.slug ? 'copied!' : 'copy'}
                    </button>
                    <button
                      onClick={() => setQrUrl(url)}
                      className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[#2e2e2e] text-[#666] hover:border-purple-500/40 hover:text-purple-400 transition-all"
                    >
                      qr
                    </button>
                    <Link
                      href={`/analytics/${url.slug}`}
                      className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[#2e2e2e] text-[#666] hover:border-purple-500/40 hover:text-purple-400 transition-all"
                    >
                      analytics
                    </Link>
                    <button
                      onClick={() => handleDelete(url.slug)}
                      className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[#2e2e2e] text-[#666] hover:border-red-500/40 hover:text-red-400 transition-all"
                    >
                      delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
