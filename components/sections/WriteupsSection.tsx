'use client'
import { useState } from 'react'
import type { Writeup } from '@/types'
import { formatDistanceToNow } from 'date-fns'

const DIFFS = ['All', 'easy', 'medium', 'hard', 'insane']
const PLATFORMS = ['All', 'HTB', 'THM', 'picoCTF', 'PortSwigger', 'Other']

const diffColor: Record<string, string> = {
  easy: '#00ff41', medium: '#ffaa00', hard: '#ff4444', insane: '#ff00ff',
}
const diffLabel: Record<string, string> = {
  easy: 'Easy', medium: 'Medium', hard: 'Hard', insane: 'Insane',
}

export default function WriteupsSection({ writeups }: { writeups: Writeup[] }) {
  const [activeDiff, setActiveDiff] = useState('All')
  const [activePlatform, setActivePlatform] = useState('All')

  const filtered = writeups.filter(w => {
    const diffMatch = activeDiff === 'All' || w.difficulty === activeDiff
    const platMatch = activePlatform === 'All' || w.platform === activePlatform
    return diffMatch && platMatch
  })

  // Count per difficulty
  const counts = DIFFS.slice(1).reduce((acc, d) => {
    acc[d] = writeups.filter(w => w.difficulty === d).length
    return acc
  }, {} as Record<string, number>)

  return (
    <section id="writeups" className="section-anchor" style={{ padding: '5rem 1.5rem', maxWidth: 1000, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--green)', letterSpacing: 3, textTransform: 'uppercase', border: '1px solid var(--border-bright)', padding: '3px 8px', background: 'var(--green-faint)' }}>04</span>
        <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: 'clamp(1.2rem,3vw,1.8rem)', fontWeight: 700, color: 'var(--text)', letterSpacing: 2 }}>WRITEUPS</h2>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,var(--border-bright),transparent)' }} />
        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--muted)' }}>{writeups.length} total</span>
      </div>

      {/* Difficulty tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1rem' }}>
        {DIFFS.map(d => {
          const count = d === 'All' ? writeups.length : counts[d] || 0
          const active = activeDiff === d
          const color = d === 'All' ? 'var(--green)' : diffColor[d]
          return (
            <button key={d} onClick={() => setActiveDiff(d)} style={{
              fontFamily: 'Share Tech Mono, monospace', fontSize: 10, letterSpacing: 2,
              textTransform: 'uppercase', padding: '5px 12px', cursor: 'pointer',
              border: `1px solid ${active ? color : 'var(--border)'}`,
              color: active ? color : 'var(--muted)',
              background: active ? 'rgba(0,255,65,0.06)' : 'transparent',
              boxShadow: active ? `0 0 8px ${color}40` : 'none',
              transition: 'all 0.15s',
            }}>
              {d === 'All' ? 'All' : diffLabel[d]} {count > 0 && <span style={{ opacity: 0.6 }}>({count})</span>}
            </button>
          )
        })}
      </div>

      {/* Platform filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: '2rem' }}>
        {PLATFORMS.map(p => (
          <button key={p} onClick={() => setActivePlatform(p)} style={{
            fontFamily: 'Share Tech Mono, monospace', fontSize: 9, letterSpacing: 1,
            textTransform: 'uppercase', padding: '3px 9px', cursor: 'pointer',
            border: `1px solid ${activePlatform === p ? 'var(--green-dim)' : 'var(--border)'}`,
            color: activePlatform === p ? 'var(--green-dim)' : 'var(--muted)',
            background: 'transparent', transition: 'all 0.15s',
          }}>{p}</button>
        ))}
      </div>

      {/* Writeup cards */}
      {filtered.length === 0 ? (
        <div style={{ border: '1px dashed var(--border)', padding: '3rem', textAlign: 'center', fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: 'var(--muted)' }}>
          // no writeups in this category yet<span className="blink">_</span>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 1, background: 'var(--border)' }}>
          {filtered.map(w => (
            <a key={w.id} href={`/writeups/${w.id}`}
              style={{ background: 'var(--bg2)', display: 'flex', flexDirection: 'column', textDecoration: 'none', transition: 'background 0.2s', overflow: 'hidden' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg2)')}
            >
              {/* Cover image */}
              {w.cover_image_url && (
                <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#000', flexShrink: 0 }}>
                  <img src={w.cover_image_url} alt={w.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  {/* Difficulty ribbon */}
                  <div style={{
                    position: 'absolute', top: 8, right: 8,
                    fontFamily: 'Share Tech Mono, monospace', fontSize: 9,
                    padding: '2px 8px', letterSpacing: 1, textTransform: 'uppercase',
                    background: 'rgba(0,0,0,0.8)', border: `1px solid ${diffColor[w.difficulty]}`,
                    color: diffColor[w.difficulty],
                  }}>{w.difficulty}</div>
                  {/* Scanline overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.1) 2px,rgba(0,0,0,0.1) 4px)', pointerEvents: 'none' }} />
                </div>
              )}

              {/* Card body */}
              <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* Platform + OS row */}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, padding: '1px 6px', border: '1px solid var(--border)', color: 'var(--muted)', letterSpacing: 1 }}>{w.platform}</span>
                  {w.machine_os && <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, padding: '1px 6px', border: '1px solid var(--border)', color: 'var(--muted)' }}>{w.machine_os}</span>}
                  {!w.cover_image_url && (
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, padding: '1px 6px', border: `1px solid ${diffColor[w.difficulty]}`, color: diffColor[w.difficulty], marginLeft: 'auto' }}>{w.difficulty}</span>
                  )}
                </div>

                {/* Title */}
                <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 13, fontWeight: 700, color: 'var(--text)', letterSpacing: 1, lineHeight: 1.4 }}>{w.title}</div>

                {/* Tags */}
                {w.tags?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {w.tags.slice(0, 4).map(t => (
                      <span key={t} style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 8, padding: '1px 5px', border: '1px solid var(--border)', color: 'var(--muted)', letterSpacing: 1 }}>{t}</span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: 'var(--muted)' }}>
                    {formatDistanceToNow(new Date(w.created_at), { addSuffix: true })}
                  </span>
                  <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: 'var(--green-dim)', letterSpacing: 1 }}>READ →</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Profile links */}
      <div style={{ marginTop: '1.5rem', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {[
          { label: '↗ TryHackMe Profile', href: 'https://tryhackme.com/p/0xIdiot' },
          { label: '↗ picoCTF Profile', href: 'https://play.picoctf.org/p/z3r0x1d1ot' },
          { label: '↗ PortSwigger Labs', href: 'https://portswigger.net/web-security' },
        ].map(b => (
          <a key={b.label} href={b.href} target="_blank" rel="noreferrer" style={{
            fontFamily: 'Share Tech Mono, monospace', fontSize: 10, padding: '8px 14px',
            border: '1px solid var(--border-bright)', color: 'var(--muted)', textDecoration: 'none', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.color = 'var(--green)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.color = 'var(--muted)' }}
          >{b.label}</a>
        ))}
      </div>
    </section>
  )
}
