'use client'
import type { Writeup } from '@/types'
import { formatDistanceToNow } from 'date-fns'

const diffColor: Record<string, string> = {
  easy: '#00ff41', medium: '#ffaa00', hard: '#ff4444', insane: '#ff00ff',
}

export default function WriteupsSection({ writeups }: { writeups: Writeup[] }) {
  return (
    <section id="writeups" className="section-anchor" style={{ padding: '5rem 2rem', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--green)', letterSpacing: 3, textTransform: 'uppercase', border: '1px solid var(--border-bright)', padding: '3px 8px', background: 'var(--green-faint)' }}>04</span>
        <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: 'clamp(1.2rem,3vw,1.8rem)', fontWeight: 700, color: 'var(--text)', letterSpacing: 2 }}>WRITEUPS</h2>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,var(--border-bright),transparent)' }} />
      </div>

      {writeups.length === 0 ? (
        <div style={{ border: '1px dashed var(--border)', padding: '3rem', textAlign: 'center', fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: 'var(--muted)', letterSpacing: 1 }}>
          {'// writeups coming soon — machines being documented'}
          <span className="blink">_</span>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 1, background: 'var(--border)' }}>
          {writeups.map(w => (
            <a key={w.id} href={w.external_url || `/writeups/${w.id}`} target={w.external_url ? '_blank' : undefined} rel="noreferrer"
              style={{ background: 'var(--bg2)', padding: '1.2rem', display: 'block', textDecoration: 'none', transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg2)')}
            >
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, letterSpacing: 2, color: 'var(--green-dim)', textTransform: 'uppercase', marginBottom: 6 }}>{w.platform} {w.machine_os && `· ${w.machine_os}`}</div>
              <div style={{ fontSize: 13, color: 'var(--text)', marginBottom: 6 }}>{w.title}</div>
              <span style={{ fontSize: 9, fontFamily: 'Share Tech Mono, monospace', padding: '2px 6px', border: `1px solid ${diffColor[w.difficulty]}`, color: diffColor[w.difficulty] }}>{w.difficulty}</span>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 8 }}>
                {formatDistanceToNow(new Date(w.created_at), { addSuffix: true })}
              </div>
              {w.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                  {w.tags.map(t => <span key={t} style={{ fontSize: 9, fontFamily: 'Share Tech Mono, monospace', padding: '1px 5px', border: '1px solid var(--border)', color: 'var(--muted)' }}>{t}</span>)}
                </div>
              )}
            </a>
          ))}
        </div>
      )}

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
