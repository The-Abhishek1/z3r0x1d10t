'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import type { Profile, Badge } from '@/types'

export default function HeroSection({ profile, badges }: { profile: Profile | null; badges: Badge[] }) {
  const aliasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!aliasRef.current || !profile) return
    const words = [profile.alias, 'pentester', 'builder', 'forensics', 'breaker']
    let ai = 0, ci = 0, deleting = false
    let timer: ReturnType<typeof setTimeout>
    function type() {
      if (!aliasRef.current) return
      const word = words[ai]
      if (!deleting) {
        aliasRef.current.innerHTML = `alias: <span style="color:var(--green)">${word.slice(0, ci)}</span> // breaking things to understand them`
        ci++
        if (ci > word.length) { deleting = true; timer = setTimeout(type, 1800); return }
      } else {
        aliasRef.current.innerHTML = `alias: <span style="color:var(--green)">${word.slice(0, ci)}</span>`
        ci--
        if (ci < 0) { deleting = false; ai = (ai + 1) % words.length; ci = 0; timer = setTimeout(type, 400); return }
      }
      timer = setTimeout(type, deleting ? 60 : 90)
    }
    timer = setTimeout(type, 800)
    return () => clearTimeout(timer)
  }, [profile])

  return (
    <>
      <style>{`
        .hero-inner {
          max-width: 860px;
          width: 100%;
          position: relative;
          display: flex;
          gap: 3rem;
          align-items: center;
        }
        .hero-avatar {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .hero-avatar-img {
          width: 140px;
          height: 140px;
          position: relative;
          border: 2px solid var(--green);
          box-shadow: 0 0 30px var(--green-glow), inset 0 0 30px rgba(0,255,65,0.05);
          clip-path: polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%);
          overflow: hidden;
        }
        .hero-text { flex: 1; min-width: 0; }
        .hero-name {
          font-family: Orbitron, monospace;
          font-size: clamp(1.8rem, 5vw, 4rem);
          font-weight: 900;
          color: var(--green);
          text-shadow: 0 0 40px var(--green-glow), 0 0 80px rgba(0,255,65,0.1);
          line-height: 1;
          margin-bottom: 0.3rem;
          letter-spacing: 3px;
        }
        .hero-alias {
          font-family: Share Tech Mono, monospace;
          font-size: clamp(0.75rem, 2vw, 1.1rem);
          color: var(--muted);
          margin-bottom: 1.2rem;
          word-break: break-word;
        }
        .hero-bio {
          color: var(--muted);
          font-size: 13px;
          line-height: 1.9;
          margin-bottom: 1.5rem;
          border-left: 2px solid var(--green-dim);
          padding-left: 1rem;
        }
        .hero-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 1.8rem;
        }
        .hero-cta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        @media (max-width: 600px) {
          .hero-inner {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 1.5rem;
          }
          .hero-avatar-img {
            width: 100px;
            height: 100px;
          }
          .hero-bio {
            text-align: left;
          }
          .hero-badges {
            justify-content: center;
          }
          .hero-cta {
            justify-content: center;
          }
          .hero-name {
            font-size: clamp(1.6rem, 8vw, 2.4rem);
            letter-spacing: 2px;
          }
          .hero-alias {
            font-size: 11px;
          }
        }
      `}</style>

      <section id="about" className="section-anchor" style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '80px 1.5rem 2rem', position: 'relative', overflow: 'hidden',
      }}>
        {/* Grid bg */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%)',
        }} />

        <div className="hero-inner">

          {/* Avatar */}
          {profile?.avatar_url && (
            <div className="hero-avatar">
              <div className="hero-avatar-img">
                <Image
                  src={profile.avatar_url}
                  alt={profile.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="140px"
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8, fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: 'var(--muted)', letterSpacing: 1 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
                ONLINE
              </div>
            </div>
          )}

          {/* Text */}
          <div className="hero-text">
            <div style={{ fontSize: 10, color: 'var(--green-dim)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.4rem', fontFamily: 'Share Tech Mono, monospace' }}>
              {'> '}{profile?.tagline || 'Cybersecurity Engineer & Full-Stack Developer'}
            </div>

            <h1 className="hero-name">{profile?.name || 'ABHISHEK N'}</h1>

            <div ref={aliasRef} className="hero-alias">
              alias: <span style={{ color: 'var(--green)' }}>{profile?.alias || '0xIdiot'}</span> // breaking things to understand them
            </div>

            <p className="hero-bio">{profile?.bio || ''}</p>

            <div className="hero-badges">
              {badges.map(b => (
                <span key={b.id} style={{
                  fontFamily: 'Share Tech Mono, monospace', fontSize: 10, letterSpacing: 1,
                  padding: '4px 10px', textTransform: 'uppercase',
                  border: `1px solid ${b.hot ? 'var(--green)' : 'var(--border-bright)'}`,
                  color: b.hot ? 'var(--green)' : 'var(--muted)',
                  background: 'var(--green-faint)',
                  boxShadow: b.hot ? '0 0 8px var(--green-glow)' : 'none',
                }}>{b.label}</span>
              ))}
            </div>

            <div className="hero-cta">
              {[
                { label: 'View Projects', href: '#projects', primary: true },
                { label: 'Read Writeups', href: '#writeups', primary: false },
                { label: 'GitHub', href: 'https://github.com/The-Abhishek1', primary: false },
                ...(profile?.resume_url ? [{ label: 'Resume', href: profile.resume_url, primary: false }] : []),
              ].map(btn => (
                <a key={btn.label} href={btn.href}
                  target={btn.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  style={{
                    fontFamily: 'Share Tech Mono, monospace', fontSize: 11, letterSpacing: 2,
                    textTransform: 'uppercase', padding: '10px 18px', textDecoration: 'none',
                    border: '1px solid var(--green)',
                    color: btn.primary ? 'var(--bg)' : 'var(--green)',
                    background: btn.primary ? 'var(--green)' : 'transparent',
                    transition: 'all 0.2s', display: 'inline-block',
                  }}
                  onMouseEnter={e => { if (!btn.primary) { e.currentTarget.style.background = 'var(--green)'; e.currentTarget.style.color = 'var(--bg)' } }}
                  onMouseLeave={e => { if (!btn.primary) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--green)' } }}
                >{btn.label}</a>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
