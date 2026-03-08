'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

const features = [
  { icon: '⚡', title: 'Sub-ms redirects', desc: 'Redis-cached lookups resolve before anyone notices. Zero cold starts.' },
  { icon: '📊', title: 'Deep analytics', desc: 'Track unique visitors, referrers, devices. All async — zero redirect delay.' },
  { icon: '🔗', title: 'Custom slugs', desc: 'Make links that mean something. Your slug, your brand.' },
  { icon: '⏳', title: 'Link expiry', desc: 'Set expiry dates. Great for campaigns, events, time-sensitive content.' },
  { icon: '📱', title: 'QR codes', desc: 'Every link gets a QR code instantly. Download, share, embed anywhere.' },
  { icon: '🔑', title: 'API access', desc: 'Integrate with a simple REST API. One key, full control.' },
]

const steps = [
  { num: '01', title: 'Paste your URL', desc: 'Drop in any long URL. Customize the slug or let Slugify generate one.' },
  { num: '02', title: 'Get your link', desc: 'Your short link is ready instantly. Cached in Redis for lightning redirects.' },
  { num: '03', title: 'Share it', desc: 'Share the link or QR code anywhere — Twitter, email, bio, print.' },
  { num: '04', title: 'Watch it fly', desc: 'Every click tracked async. Open your dashboard and watch data roll in.' },
]

export default function Home() {
  const [url, setUrl] = useState('')
  const [slugified, setSlugified] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('opacity-100', 'translate-y-0')
          e.target.classList.remove('opacity-0', 'translate-y-8')
        }
      }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleSlugify = () => {
    if (!url) return
    setSlugified(true)
    setTimeout(() => { setSlugified(false); setUrl('') }, 2500)
  }

  return (
    <main className="min-h-screen bg-[#080808] text-[#f0f0f0]">

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 transition-all duration-300 ${scrolled ? 'bg-[#080808]/85 backdrop-blur-xl border-b border-[#1c1c1c]' : ''}`}>
        <Link href="/" className="font-display font-black text-xl tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_12px_#9333ea]" />
          Slugify
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-[#666] hover:text-[#f0f0f0] transition-colors text-sm">Features</Link>
          <Link href="#how" className="text-[#666] hover:text-[#f0f0f0] transition-colors text-sm">How it works</Link>
          <Link href="/login" className="text-[#666] hover:text-[#f0f0f0] transition-colors text-sm">Login</Link>
          <Link href="/register" className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:-translate-y-px">
            Get started →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#666] hover:text-[#f0f0f0] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed top-[69px] left-0 right-0 z-40 bg-[#080808] border-b border-[#1c1c1c] px-6 py-6 flex flex-col gap-5 md:hidden">
          <Link href="#features" onClick={() => setMenuOpen(false)} className="text-[#666] hover:text-[#f0f0f0] transition-colors text-sm">Features</Link>
          <Link href="#how" onClick={() => setMenuOpen(false)} className="text-[#666] hover:text-[#f0f0f0] transition-colors text-sm">How it works</Link>
          <Link href="/login" onClick={() => setMenuOpen(false)} className="text-[#666] hover:text-[#f0f0f0] transition-colors text-sm">Login</Link>
          <Link href="/register" onClick={() => setMenuOpen(false)} className="bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold text-center">
            Get started →
          </Link>
        </div>
      )}

      {/* HERO */}
      <section ref={heroRef} className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-100 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,black_30%,transparent_100%)]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[radial-gradient(circle,rgba(147,51,234,0.12)_0%,transparent_70%)] pointer-events-none" />

        <div className="animate-fade-up bg-purple-faint border border-purple-500/20 rounded-full px-4 py-1.5 text-xs font-mono text-purple-400 mb-8 flex items-center gap-2 relative z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#9333ea] animate-pulse" />
          Now with real-time analytics
        </div>

        <h1 className="animate-fade-up-1 font-display font-black text-[clamp(40px,8vw,96px)] leading-[0.95] tracking-[-2px] md:tracking-[-3px] mb-6 relative z-10">
          Links that<br />
          <span className="text-gradient">mean something</span>
        </h1>

        <p className="animate-fade-up-2 text-[#666] text-base md:text-lg max-w-md leading-relaxed mb-12 relative z-10">
          Shorten, track, and understand every click.
          Built for developers who care about their links.
        </p>

        <div className={`animate-fade-up-3 flex items-center gap-0 bg-[#0f0f0f] border rounded-xl p-1.5 pl-4 w-full max-w-lg relative z-10 transition-all duration-200 ${url ? 'border-purple-500 shadow-[0_0_0_3px_rgba(147,51,234,0.15)]' : 'border-[#2e2e2e]'}`}>
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSlugify()}
            placeholder="https://your-very-long-url.com"
            className="flex-1 bg-transparent outline-none text-[#f0f0f0] font-mono text-xs md:text-sm placeholder-[#444] min-w-0"
          />
          <button
            onClick={handleSlugify}
            className={`px-3 md:px-5 py-2.5 rounded-lg font-display font-bold text-xs md:text-sm text-white transition-all flex-shrink-0 ${slugified ? 'bg-green-600' : 'bg-purple-600 hover:bg-purple-700'}`}
          >
            {slugified ? '✓ Done!' : 'Slugify →'}
          </button>
        </div>

        <p className="animate-fade-up-4 text-[#444] text-xs font-mono mt-4 relative z-10">
          No signup required for your first link.
        </p>

        {/* stats */}
        <div className="animate-fade-up-4 grid grid-cols-2 md:grid-cols-4 w-full max-w-2xl mt-20 border border-[#1c1c1c] rounded-xl overflow-hidden relative z-10">
          {[
            { num: '2.4B', label: 'Links created' },
            { num: '99.9%', label: 'Uptime' },
            { num: '<1ms', label: 'Avg redirect' },
            { num: '180+', label: 'Countries' },
          ].map((s, i) => (
            <div key={i} className={`py-6 text-center border-[#1c1c1c] ${i === 0 || i === 2 ? 'border-r' : ''} ${i < 2 ? 'border-b md:border-b-0' : ''}`}>
              <div className="font-display font-black text-2xl md:text-3xl tracking-tight">
                <span>{s.num.split('').map((c, j) => /[0-9.<>%]/.test(c) ? <span key={j} className="text-purple-500">{c}</span> : c)}</span>
              </div>
              <div className="text-[10px] text-[#444] font-mono uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-5xl mx-auto px-6 md:px-12 py-20 md:py-32">
        <div className="reveal opacity-0 translate-y-8 transition-all duration-700">
          <p className="text-purple-400 font-mono text-xs uppercase tracking-widest mb-4">// what you get</p>
          <h2 className="font-display font-black text-[clamp(28px,4vw,52px)] tracking-tight leading-[1.05] mb-12 md:mb-16">
            Everything a link<br /><span className="text-purple-500">deserves</span>
          </h2>
        </div>
        <div className="reveal opacity-0 translate-y-8 transition-all duration-700 delay-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-[#1c1c1c] border border-[#1c1c1c] rounded-xl overflow-hidden">
          {features.map((f, i) => (
            <div key={i} className="bg-[#080808] hover:bg-[#0f0f0f] p-6 md:p-9 group transition-all relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-10 h-10 bg-purple-faint border border-purple-500/20 rounded-lg flex items-center justify-center mb-5 text-lg">{f.icon}</div>
              <div className="font-display font-bold text-[15px] mb-2">{f.title}</div>
              <div className="text-[#666] text-sm leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-[#0f0f0f] border-t border-b border-[#1c1c1c] py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="reveal opacity-0 translate-y-8 transition-all duration-700">
            <p className="text-purple-400 font-mono text-xs uppercase tracking-widest mb-4">// the flow</p>
            <h2 className="font-display font-black text-[clamp(28px,4vw,52px)] tracking-tight leading-[1.05] mb-14 md:mb-20">
              Simple by design,<br /><span className="text-purple-500">powerful</span> underneath
            </h2>
          </div>
          <div className="reveal opacity-0 translate-y-8 transition-all duration-700 delay-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-5 left-[calc(12.5%+16px)] right-[calc(12.5%+16px)] h-px bg-gradient-to-r from-purple-500 to-purple-500/20" />
            {steps.map((s, i) => (
              <div key={i} className="flex md:block items-start gap-4 md:gap-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs flex-shrink-0 relative z-10 md:mb-5 ${i === 0 ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)]' : 'bg-[#080808] border border-[#2e2e2e] text-purple-400'}`}>
                  {s.num}
                </div>
                <div className="mt-1 md:mt-0">
                  <div className="font-display font-bold text-sm mb-2">{s.title}</div>
                  <div className="text-[#666] text-xs leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 text-center relative overflow-hidden px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(147,51,234,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="reveal opacity-0 translate-y-8 transition-all duration-700 relative z-10">
          <h2 className="font-display font-black text-[clamp(36px,6vw,72px)] tracking-[-2px] leading-none mb-6">
            Start building<br />better <span className="text-purple-500">links</span>
          </h2>
          <p className="text-[#666] text-base mb-10">Free to start. No credit card. No nonsense.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-8 py-3.5 rounded-lg font-display font-bold text-sm transition-all hover:-translate-y-px text-center">
              Create your account →
            </Link>
            <Link href="#features" className="w-full sm:w-auto text-[#666] hover:text-[#f0f0f0] px-8 py-3.5 rounded-lg text-sm border border-[#2e2e2e] hover:border-[#666] transition-all text-center">
              See features
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1c1c1c] px-6 md:px-12 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="font-display font-black text-[#444] text-base">Slugify</div>
        <div className="text-xs font-mono text-[#444]">
          Built by <span className="text-purple-400 cursor-pointer"><a href="https://luckyworks.in" target="_blank" rel="noopener noreferrer">Lucky Jha</a></span> · Open source
        </div>
      </footer>
    </main>
  )
}