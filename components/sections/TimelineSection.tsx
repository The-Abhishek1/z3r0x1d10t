'use client'
import type { TimelineItem } from '@/types'

export default function TimelineSection({ items }: { items: TimelineItem[] }) {
  return (
    <section id="timeline" className="section-anchor" style={{ padding: '5rem 2rem', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--green)', letterSpacing: 3, textTransform: 'uppercase', border: '1px solid var(--border-bright)', padding: '3px 8px', background: 'var(--green-faint)' }}>03</span>
        <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: 'clamp(1.2rem,3vw,1.8rem)', fontWeight: 700, color: 'var(--text)', letterSpacing: 2 }}>TIMELINE</h2>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,var(--border-bright),transparent)' }} />
      </div>
      <div style={{ position: 'relative', paddingLeft: '2rem' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: 'linear-gradient(180deg,var(--green),var(--border),transparent)' }} />
        {items.map(item => (
          <div key={item.id} style={{ position: 'relative', marginBottom: '2rem', paddingLeft: '1.5rem' }}>
            <div style={{ position: 'absolute', left: '-2rem', top: 4, width: 10, height: 10, border: `1px solid ${item.highlight ? 'var(--green)' : 'var(--muted)'}`, background: 'var(--bg)', transform: 'rotate(45deg)', transition: 'background 0.2s' }} />
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--green-dim)', letterSpacing: 2, marginBottom: 4 }}>{item.date_label}</div>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>{item.body}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
              {item.tags.map(t => (
                <span key={t} style={{ fontSize: 9, fontFamily: 'Share Tech Mono, monospace', padding: '1px 6px', border: `1px solid ${item.highlight ? 'var(--green-dim)' : 'var(--border)'}`, color: item.highlight ? 'var(--green-dim)' : 'var(--muted)' }}>{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
