'use client'
import Link from 'next/link'
import { useState } from 'react'

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
  const [open, setOpen] = useState(false)

  return (
    <>
      <style>{`
        .nav-wrap {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: rgba(5,10,5,0.95); backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          height: 52px; display: flex; align-items: center;
          padding: 0 1.5rem; justify-content: space-between;
        }
        .nav-logo {
          font-family: Orbitron, monospace; font-weight: 900; font-size: 15px;
          color: var(--green); text-shadow: 0 0 20px var(--green-glow);
          text-decoration: none; letter-spacing: 2px;
          flex-shrink: 0; margin-right: 1.5rem;
        }
        .nav-links {
          display: flex; gap: 1.2rem; list-style: none; flex: 1;
        }
        .nav-links a {
          color: var(--muted); text-decoration: none; font-size: 11px;
          letter-spacing: 1px; text-transform: uppercase;
          font-family: Share Tech Mono, monospace; transition: color 0.2s; white-space: nowrap;
        }
        .nav-links a:hover { color: var(--green); }
        .nav-right {
          display: flex; align-items: center; gap: 8px;
          font-size: 10px; color: var(--muted); font-family: Share Tech Mono, monospace;
          flex-shrink: 0;
        }
        .nav-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--green); animation: pulse-dot 2s infinite;
        }
        .nav-hamburger {
          display: none; flex-direction: column; gap: 5px;
          cursor: pointer; background: none; border: none; padding: 4px;
        }
        .nav-hamburger span {
          display: block; width: 20px; height: 1px; background: var(--green);
          transition: all 0.2s;
        }
        .mobile-menu {
          display: none; position: fixed; top: 52px; left: 0; right: 0;
          background: rgba(5,10,5,0.98); border-bottom: 1px solid var(--border);
          z-index: 99; padding: 1rem 1.5rem; flex-direction: column; gap: 0;
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu a {
          color: var(--muted); text-decoration: none; font-size: 12px;
          letter-spacing: 2px; text-transform: uppercase;
          font-family: Share Tech Mono, monospace; padding: 12px 0;
          border-bottom: 1px solid var(--border); transition: color 0.2s;
        }
        .mobile-menu a:hover { color: var(--green); }
        .mobile-menu a:last-child { border-bottom: none; }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-right .nav-location { display: none; }
          .nav-right .nav-admin { display: none; }
          .nav-hamburger { display: flex; }
        }
        @media (max-width: 400px) {
          .nav-logo { font-size: 12px; letter-spacing: 1px; }
        }
      `}</style>

      <nav className="nav-wrap">
        <a className="nav-logo" href="#about">{alias}</a>

        <ul className="nav-links">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          <div className="nav-dot" />
          <span className="nav-location">Active · Bangalore, IN</span>
          <Link href="/admin" className="nav-admin" style={{ color: 'var(--muted)', textDecoration: 'none', border: '1px solid var(--border)', padding: '2px 8px', fontSize: 9, letterSpacing: 1 }}>ADMIN</Link>
          <button className="nav-hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu">
            <span style={{ transform: open ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
            <span style={{ opacity: open ? 0 : 1 }} />
            <span style={{ transform: open ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        {links.map(l => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
        ))}
        <Link href="/admin" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'Share Tech Mono, monospace', padding: '12px 0' }} onClick={() => setOpen(false)}>Admin</Link>
      </div>
    </>
  )
}
