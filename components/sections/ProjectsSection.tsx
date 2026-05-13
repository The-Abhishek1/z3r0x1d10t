'use client'
import type { Project } from '@/types'

const statusColor: Record<string, string> = {
  live: 'var(--green)', shipped: 'var(--green)', 'open-source': 'var(--green)', wip: 'var(--muted)',
}

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="section-anchor" style={{ padding: '5rem 1.5rem', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--green)', letterSpacing: 3, textTransform: 'uppercase', border: '1px solid var(--border-bright)', padding: '3px 8px', background: 'var(--green-faint)' }}>02</span>
        <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: 'clamp(1.2rem,3vw,1.8rem)', fontWeight: 700, color: 'var(--text)', letterSpacing: 2 }}>PROJECTS</h2>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,var(--border-bright),transparent)' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 1, background: 'var(--border)' }}>
        {projects.map(p => (
          <div key={p.id}
            style={{ background: 'var(--bg2)', position: 'relative', overflow: 'hidden', transition: 'background 0.2s', display: 'flex', flexDirection: 'column' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg2)')}
          >

            {/* Video (preferred over image if both exist) */}
            {p.video_url && (
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', overflow: 'hidden' }}>
                <video
                  src={p.video_url}
                  muted
                  loop
                  playsInline
                  controls
                  poster={p.image_url || undefined}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            )}

            {/* Image (only if no video) */}
            {!p.video_url && p.image_url && (
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', background: '#000' }}>
                <img
                  src={p.image_url}
                  alt={p.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                />
                {/* Scanline overlay on image */}
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.15) 2px,rgba(0,0,0,0.15) 4px)',
                }} />
                {/* Green tint overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,255,65,0.03)', pointerEvents: 'none' }} />
              </div>
            )}

            {/* Card body */}
            <div style={{ padding: '1.2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', padding: '2px 7px', border: `1px solid ${statusColor[p.status]}`, color: statusColor[p.status], display: 'inline-block', marginBottom: '0.7rem', alignSelf: 'flex-start' }}>{p.status}</div>

              <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 14, fontWeight: 700, color: 'var(--green)', marginBottom: '0.5rem', letterSpacing: 1 }}>{p.name}</div>

              <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7, marginBottom: '1rem', flex: 1 }}>{p.description}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: '1rem' }}>
                {p.stack.map(t => (
                  <span key={t} style={{ fontSize: 9, fontFamily: 'Share Tech Mono, monospace', padding: '2px 6px', border: '1px solid var(--border)', color: 'var(--muted)', letterSpacing: 1 }}>{t}</span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                {p.demo_url && (
                  <a href={p.demo_url} target="_blank" rel="noreferrer"
                    style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--green-dim)', textDecoration: 'none', letterSpacing: 1, borderBottom: '1px solid transparent', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--green)'; e.currentTarget.style.borderBottomColor = 'var(--green)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--green-dim)'; e.currentTarget.style.borderBottomColor = 'transparent' }}
                  >↗ live demo</a>
                )}
                {p.github_url && (
                  <a href={p.github_url} target="_blank" rel="noreferrer"
                    style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--green-dim)', textDecoration: 'none', letterSpacing: 1, borderBottom: '1px solid transparent', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--green)'; e.currentTarget.style.borderBottomColor = 'var(--green)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--green-dim)'; e.currentTarget.style.borderBottomColor = 'transparent' }}
                  >↗ github</a>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  )
}
