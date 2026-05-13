'use client'
import { useState } from 'react'
import type { Cheatsheet } from '@/types'

export default function CheatsheetsSection({ cheatsheets }: { cheatsheets: Cheatsheet[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [expandedRef, setExpandedRef] = useState<string | null>(null)

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(cheatsheets.map(c => c.category)))]

  const filtered = activeCategory === 'All'
    ? cheatsheets
    : cheatsheets.filter(c => c.category === activeCategory)

  const isPdf = (url?: string) => url?.match(/\.pdf$/i)
  const isImage = (url?: string) => url?.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)

  return (
    <section id="cheatsheets" className="section-anchor" style={{ padding: '5rem 1.5rem', maxWidth: 1000, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--green)', letterSpacing: 3, textTransform: 'uppercase', border: '1px solid var(--border-bright)', padding: '3px 8px', background: 'var(--green-faint)' }}>05</span>
        <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: 'clamp(1.2rem,3vw,1.8rem)', fontWeight: 700, color: 'var(--text)', letterSpacing: 2 }}>CHEATSHEETS</h2>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,var(--border-bright),transparent)' }} />
      </div>

      {/* Category filter tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '2rem' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              fontFamily: 'Share Tech Mono, monospace', fontSize: 10, letterSpacing: 2,
              textTransform: 'uppercase', padding: '5px 12px',
              border: `1px solid ${activeCategory === cat ? 'var(--green)' : 'var(--border)'}`,
              color: activeCategory === cat ? 'var(--green)' : 'var(--muted)',
              background: activeCategory === cat ? 'var(--green-faint)' : 'transparent',
              cursor: 'pointer', transition: 'all 0.15s',
              boxShadow: activeCategory === cat ? '0 0 8px var(--green-glow)' : 'none',
            }}
          >{cat}</button>
        ))}
        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: 'var(--muted)', alignSelf: 'center', marginLeft: 4 }}>
          {filtered.length} sheet{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 1, background: 'var(--border)' }}>
        {filtered.map(cs => (
          <div key={cs.id} style={{ background: 'var(--bg2)', display: 'flex', flexDirection: 'column' }}>

            {/* Reference image (if uploaded) */}
            {cs.reference_url && isImage(cs.reference_url) && (
              <div style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border)' }}>
                <img
                  src={cs.reference_url}
                  alt={cs.title}
                  style={{
                    width: '100%', maxHeight: 180, objectFit: 'cover', display: 'block',
                    transition: 'transform 0.3s', cursor: 'zoom-in',
                  }}
                  onClick={() => setExpandedRef(expandedRef === cs.id ? null : cs.id)}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                />
                {/* Scanline overlay */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.12) 2px,rgba(0,0,0,0.12) 4px)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px 8px', background: 'rgba(0,0,0,0.6)', fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: 'var(--muted)', letterSpacing: 1 }}>
                  click to {expandedRef === cs.id ? 'collapse' : 'expand'}
                </div>
              </div>
            )}

            {/* Expanded image lightbox */}
            {expandedRef === cs.id && cs.reference_url && isImage(cs.reference_url) && (
              <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
                <img src={cs.reference_url} alt={cs.title} style={{ width: '100%', display: 'block', cursor: 'zoom-out' }}
                  onClick={() => setExpandedRef(null)} />
              </div>
            )}

            {/* Card body */}
            <div style={{ padding: '1.2rem', flex: 1 }}>
              {/* Title row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: 'var(--green)', letterSpacing: 2, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'var(--muted)' }}># </span>{cs.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 9, fontFamily: 'Share Tech Mono, monospace', color: 'var(--muted)', border: '1px solid var(--border)', padding: '1px 5px' }}>{cs.category}</span>
                  {/* PDF download button */}
                  {cs.reference_url && isPdf(cs.reference_url) && (
                    <a href={cs.reference_url} target="_blank" rel="noreferrer"
                      style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: 'var(--green)', border: '1px solid var(--green)', padding: '2px 7px', textDecoration: 'none', letterSpacing: 1, transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--green)'; e.currentTarget.style.color = 'var(--bg)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--green)' }}
                    >↓ PDF</a>
                  )}
                </div>
              </div>

              {/* Entries */}
              <ul style={{ listStyle: 'none' }}>
                {cs.entries.map((e, i) => (
                  <li key={i} style={{
                    fontSize: 11, color: 'var(--muted)', padding: '6px 0',
                    borderBottom: i < cs.entries.length - 1 ? '1px solid var(--border)' : 'none',
                    fontFamily: 'Share Tech Mono, monospace',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
                  }}>
                    <span style={{ flexShrink: 0, fontSize: 10 }}>{e.label}</span>
                    <code
                      style={{
                        color: 'var(--text)', background: 'rgba(0,255,65,0.05)',
                        padding: '2px 7px', fontSize: 10, border: '1px solid var(--border)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        maxWidth: 200, cursor: 'pointer', transition: 'all 0.15s',
                        userSelect: 'all',
                      }}
                      title="Click to copy"
                      onClick={async () => {
                        await navigator.clipboard.writeText(e.cmd)
                        const el = document.activeElement as HTMLElement
                        el?.blur()
                      }}
                      onMouseEnter={ev => { ev.currentTarget.style.background = 'rgba(0,255,65,0.12)'; ev.currentTarget.style.borderColor = 'var(--green)' }}
                      onMouseLeave={ev => { ev.currentTarget.style.background = 'rgba(0,255,65,0.05)'; ev.currentTarget.style.borderColor = 'var(--border)' }}
                    >{e.cmd}</code>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ border: '1px dashed var(--border)', padding: '2rem', textAlign: 'center', fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: 'var(--muted)' }}>
          // no cheatsheets in this category yet<span className="blink">_</span>
        </div>
      )}
    </section>
  )
}
