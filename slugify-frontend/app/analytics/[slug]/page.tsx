'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { getSlugAnalytics } from '@/lib/api'

interface Analytics {
  slug: string
  originalUrl: string
  totalClicks: number
  uniqueVisitors: number
  clicksOverTime: { _id: string; count: number }[]
  topReferers: { _id: string; count: number }[]
  topUserAgents: { _id: string; count: number }[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#0f0f0f] border border-[#2e2e2e] rounded-lg px-3 py-2">
        <p className="font-mono text-[10px] text-[#444] mb-1">{label}</p>
        <p className="font-display font-bold text-purple-400">{payload[0].value} clicks</p>
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [data, setData] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const key = localStorage.getItem('slugify_api_key')
    if (!key) { router.push('/login'); return }
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const result = await getSlugAnalytics(slug as string)
      setData(result)
    } catch {
      console.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const chartData = data?.clicksOverTime?.map(d => ({
    date: d._id,
    clicks: d.count,
  })) || []

  if (loading) {
    return (
      <main className="min-h-screen bg-[#080808] flex items-center justify-center">
        <p className="font-mono text-[#444] text-sm">Loading analytics...</p>
      </main>
    )
  }

  if (!data || (data as any).error) {
    return (
      <main className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-[#444] text-sm mb-4">No data found for /{slug}</p>
          <Link href="/dashboard" className="text-purple-400 font-mono text-sm hover:text-purple-300 transition-colors">← Back to dashboard</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#080808] text-[#f0f0f0]">
      {/* NAV */}
      <nav className="border-b border-[#1c1c1c] px-8 py-4 flex items-center justify-between bg-[#080808]/80 backdrop-blur-xl sticky top-0 z-40">
        <Link href="/" className="font-display font-black text-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_12px_#9333ea]" />
          Slugify
        </Link>
        <Link href="/dashboard" className="text-[#444] hover:text-[#f0f0f0] text-xs font-mono transition-colors">
          ← Back to dashboard
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">

        {/* HEADER */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-purple-400 text-xl font-medium">/{data.slug}</span>
          </div>
          <p className="text-[#444] text-sm font-mono truncate max-w-lg">{data.originalUrl}</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total clicks', value: data.totalClicks },
            { label: 'Unique visitors', value: data.uniqueVisitors || 0 },
            { label: 'Avg per day', value: data.clicksOverTime?.length ? Math.round(data.totalClicks / data.clicksOverTime.length) : 0 },
          ].map((s, i) => (
            <div key={i} className="bg-[#0f0f0f] border border-[#1c1c1c] rounded-xl p-5">
              <div className="text-[10px] font-mono text-[#444] uppercase tracking-widest mb-2">{s.label}</div>
              <div className="font-display font-black text-3xl text-purple-400">{s.value}</div>
            </div>
          ))}
        </div>

        {/* CHART */}
        <div className="bg-[#0f0f0f] border border-[#1c1c1c] rounded-2xl p-6 mb-6">
          <h2 className="font-display font-bold text-sm mb-6">Clicks over last 7 days</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="purple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#444', fontSize: 10, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#444', fontSize: 10, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="clicks" stroke="#9333ea" strokeWidth={2} fill="url(#purple)" dot={{ fill: '#9333ea', strokeWidth: 0, r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-[#444] font-mono text-sm">
              No click data yet. Share your link!
            </div>
          )}
        </div>

        {/* BOTTOM GRID */}
        <div className="grid grid-cols-2 gap-6">

          {/* TOP REFERERS */}
          <div className="bg-[#0f0f0f] border border-[#1c1c1c] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1c1c1c]">
              <h2 className="font-display font-bold text-sm">Top referrers</h2>
            </div>
            <div className="divide-y divide-[#1c1c1c]">
              {data.topReferers?.length > 0 ? data.topReferers.map((r, i) => (
                <div key={i} className="px-6 py-3 flex items-center justify-between">
                  <span className="font-mono text-xs text-[#666] truncate max-w-[200px]">{r._id || 'direct'}</span>
                  <span className="font-display font-bold text-purple-400 text-sm">{r.count}</span>
                </div>
              )) : (
                <div className="px-6 py-6 text-center text-[#333] font-mono text-xs">No data yet</div>
              )}
            </div>
          </div>

          {/* TOP DEVICES */}
          <div className="bg-[#0f0f0f] border border-[#1c1c1c] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1c1c1c]">
              <h2 className="font-display font-bold text-sm">Top user agents</h2>
            </div>
            <div className="divide-y divide-[#1c1c1c]">
              {data.topUserAgents?.length > 0 ? data.topUserAgents.map((u, i) => (
                <div key={i} className="px-6 py-3 flex items-center justify-between gap-4">
                  <span className="font-mono text-xs text-[#666] truncate">{u._id?.split(' ')[0] || 'unknown'}</span>
                  <span className="font-display font-bold text-purple-400 text-sm flex-shrink-0">{u.count}</span>
                </div>
              )) : (
                <div className="px-6 py-6 text-center text-[#333] font-mono text-xs">No data yet</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
