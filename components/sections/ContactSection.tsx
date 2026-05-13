'use client'
import { useState } from 'react'
import type { ContactLink } from '@/types'
import toast from 'react-hot-toast'

export default function ContactSection({ links, bmcUsername }: { links: ContactLink[]; bmcUsername?: string }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) { toast.success('Message sent!'); setForm({ name: '', email: '', subject: '', message: '' }) }
      else toast.error('Failed. Try emailing directly.')
    } catch { toast.error('Network error.') }
    setLoading(false)
  }

  return (
    <>
      <style>{`
        .contact-links-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1px;
          background: var(--border);
          margin-bottom: 2rem;
        }
        .contact-bmc-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: var(--border);
        }
        .contact-bmc { background: var(--bg2); padding: 2rem; text-align: center; }
        .contact-form { background: var(--bg2); padding: 2rem; }
        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        @media (max-width: 640px) {
          .contact-bmc-form { grid-template-columns: 1fr; }
          .form-grid-2 { grid-template-columns: 1fr; }
          .contact-bmc { padding: 1.5rem; }
          .contact-form { padding: 1.5rem; }
        }
      `}</style>

      <section id="contact" className="section-anchor" style={{ padding: '5rem 1.5rem', maxWidth: 1000, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--green)', letterSpacing: 3, textTransform: 'uppercase', border: '1px solid var(--border-bright)', padding: '3px 8px', background: 'var(--green-faint)' }}>06</span>
          <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: 'clamp(1.2rem,3vw,1.8rem)', fontWeight: 700, color: 'var(--text)', letterSpacing: 2 }}>CONTACT</h2>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,var(--border-bright),transparent)' }} />
        </div>

        {/* Links grid */}
        <div className="contact-links-grid">
          {links.map(l => (
            <a key={l.id} href={l.url} target={l.url.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
              style={{ background: 'var(--bg2)', padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none', transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg2)')}
            >
              <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 14, color: 'var(--green)', width: 28, textAlign: 'center', flexShrink: 0 }}>{l.icon}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: 'var(--muted)', letterSpacing: 2, textTransform: 'uppercase' }}>{l.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.value}</div>
              </div>
            </a>
          ))}
        </div>

        {/* BMC + Form */}
        <div className="contact-bmc-form">

          {/* Buy me a coffee */}
          <div className="contact-bmc">
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 14, color: 'var(--green)', marginBottom: '0.8rem', fontWeight: 700 }}>Support My Work</div>
            <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              If XCloak, ForenX, or any of my writeups helped you — buy me a coffee. Keeps the servers running and me caffeinated.
            </p>
            <a
              href={`https://www.buymeacoffee.com/${bmcUsername || 'z3r0x1d10t'}`}
              target="_blank" rel="noreferrer"
              style={{
                display: 'inline-block', background: '#FFDD00', color: '#000',
                fontFamily: 'Orbitron, monospace', fontWeight: 700, fontSize: 13,
                padding: '12px 24px', textDecoration: 'none', letterSpacing: 1,
                transition: 'opacity 0.2s', width: '100%', maxWidth: 220,
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >☕ Buy Me a Coffee</a>
          </div>

          {/* Contact form */}
          <div className="contact-form">
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 14, color: 'var(--green)', marginBottom: '0.5rem', fontWeight: 700 }}>Get in Touch</div>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: '1.2rem', lineHeight: 1.7 }}>
              Want to collaborate, hire me, or build something together?
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="form-grid-2">
                <div>
                  <label>Name</label>
                  <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
                </div>
                <div>
                  <label>Email</label>
                  <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label>Subject</label>
                <input type="text" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Team collab / Hire / Other" />
              </div>
              <div>
                <label>Message</label>
                <textarea required rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell me what you're building..." />
              </div>
              <button type="submit" disabled={loading} style={{
                fontFamily: 'Share Tech Mono, monospace', fontSize: 11, letterSpacing: 2,
                textTransform: 'uppercase', padding: '10px 20px',
                border: '1px solid var(--green)', color: 'var(--bg)',
                background: loading ? 'var(--muted)' : 'var(--green)',
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
              }}>{loading ? 'Sending...' : 'Send Message'}</button>
            </form>
          </div>

        </div>
      </section>
    </>
  )
}
