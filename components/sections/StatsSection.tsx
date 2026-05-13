'use client'

import type { Stat } from '@/types'

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
      <span style={{
        fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--green)',
        letterSpacing: 3, textTransform: 'uppercase', border: '1px solid var(--border-bright)',
        padding: '3px 8px', background: 'var(--green-faint)',
      }}>{num}</span>
      <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: 'clamp(1.2rem,3vw,1.8rem)', fontWeight: 700, color: 'var(--text)', letterSpacing: 2 }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,var(--border-bright),transparent)' }} />
    </div>
  )
}

export default function StatsSection({ stats }: { stats: Stat[] }) {
  return (
    <section id="stats" className="section-anchor" style={{ padding: '5rem 2rem', maxWidth: 1000, margin: '0 auto' }}>
      <SectionHeader num="01" title="STATS" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 1, background: 'var(--border)' }}>
        {stats.map(s => (
          <div key={s.id} style={{ background: 'var(--bg2)', padding: '1.5rem', textAlign: 'center', transition: 'background 0.2s', position: 'relative', overflow: 'hidden', cursor: 'default' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg2)')}
          >
            <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '2rem', fontWeight: 900, color: 'var(--green)', textShadow: '0 0 20px var(--green-glow)', display: 'block' }}>{s.value}</span>
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--muted)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 4, display: 'block' }}>{s.label}</span>
            {s.sub && <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{s.sub}</div>}
          </div>
        ))}
      </div>
    </section>
  )
}
