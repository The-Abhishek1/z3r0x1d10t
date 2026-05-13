'use client'
import Link from 'next/link'

const links = [
  { href: '#about', label: 'About' },
  { href: '#stats', label: 'Stats' },
  { href: '#projects', label: 'Projects' },
  { href: '#timeline', label: 'Timeline' },
  { href: '#writeups', label: 'Writeups' },
  { href: '#cheatsheets', label: 'Cheatsheets' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav({ alias }: { alias: string }) {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(5,10,5,0.92)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 2rem', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', height: '52px',
    }}>
      <a href="#about" style={{
        fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: 16,
        color: 'var(--green)', textShadow: '0 0 20px var(--green-glow)',
        textDecoration: 'none', letterSpacing: 2,
      }}>{alias}</a>

      <ul style={{ display: 'flex', gap: '1.5rem', listStyle: 'none' }}>
        {links.map(l => (
          <li key={l.href}>
            <a href={l.href} style={{
              color: 'var(--muted)', textDecoration: 'none', fontSize: 11,
              letterSpacing: 1, textTransform: 'uppercase',
              fontFamily: 'Share Tech Mono, monospace',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--green)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >{l.label}</a>
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--muted)', fontFamily: 'Share Tech Mono, monospace' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
        Active · Bangalore, IN
        <Link href="/admin" style={{ marginLeft: 12, color: 'var(--muted)', textDecoration: 'none', border: '1px solid var(--border)', padding: '2px 8px', fontSize: 9, letterSpacing: 1 }}>ADMIN</Link>
      </div>
    </nav>
  )
}
