import { createSupabaseServer } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { formatDistanceToNow, format } from 'date-fns'
import Link from 'next/link'
import WriteupContent from '@/components/WriteupContent'

export default async function WriteupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createSupabaseServer()
  const { data: writeup } = await supabase.from('writeups').select('*').eq('id', id).eq('published', true).single()
  if (!writeup) notFound()

  const diffColor: Record<string, string> = {
    easy: '#00ff41', medium: '#ffaa00', hard: '#ff4444', insane: '#ff00ff',
  }

  return (
    <>
      <style>{`
        body { background: var(--bg); }
        .wr-back {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: rgba(5,10,5,0.95); backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          padding: 0 2rem; height: 52px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .wr-wrap { max-width: 820px; margin: 0 auto; padding: 80px 1.5rem 4rem; }
        .wr-cover { width: 100%; height: auto; display: block; border: 1px solid var(--border); margin-bottom: 2rem; }
        .wr-meta { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 1.5rem; }
        .wr-title { font-family: Orbitron, monospace; font-size: clamp(1.4rem,4vw,2.2rem); font-weight: 900; color: var(--green); letter-spacing: 2px; margin-bottom: 1rem; line-height: 1.2; }
        .wr-body { color: var(--text); font-size: 14px; line-height: 1.9; }
        .wr-body h1, .wr-body h2, .wr-body h3 { font-family: Orbitron, monospace; color: var(--green); margin: 2rem 0 0.8rem; letter-spacing: 1px; }
        .wr-body h2 { font-size: 1.1rem; border-bottom: 1px solid var(--border); padding-bottom: 6px; }
        .wr-body h3 { font-size: 0.95rem; color: var(--green-dim); }
        .wr-body p { margin-bottom: 1rem; color: var(--text); }
        .wr-body ul, .wr-body ol { margin: 0 0 1rem 1.5rem; color: var(--muted); }
        .wr-body li { margin-bottom: 4px; }
        .wr-body code { background: rgba(0,255,65,0.08); border: 1px solid var(--border); padding: 2px 6px; font-family: JetBrains Mono, monospace; font-size: 12px; color: var(--green); }
        .wr-body pre { background: #000; border: 1px solid var(--border); border-left: 3px solid var(--green); padding: 1rem; overflow-x: auto; margin-bottom: 1.2rem; }
        .wr-body pre code { background: none; border: none; padding: 0; color: var(--green-dim); font-size: 12px; line-height: 1.7; }
        .wr-body blockquote { border-left: 3px solid var(--green-dim); padding-left: 1rem; color: var(--muted); margin: 1rem 0; }
        .wr-body img { max-width: 100%; border: 1px solid var(--border); display: block; margin: 1rem 0; }
        .wr-body a { color: var(--green); }
        .wr-body table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; font-size: 13px; }
        .wr-body th { background: var(--green-faint); color: var(--green); font-family: Share Tech Mono, monospace; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; padding: 8px 12px; border: 1px solid var(--border); }
        .wr-body td { padding: 8px 12px; border: 1px solid var(--border); color: var(--muted); }
        .wr-body hr { border: none; border-top: 1px solid var(--border); margin: 2rem 0; }
        .wr-attachment { margin-top: 2rem; padding: 1rem; border: 1px solid var(--border); background: var(--bg2); display: flex; align-items: center; gap: 12px; }
      `}</style>

      {/* Top bar */}
      <div className="wr-back">
        <Link href="/#writeups" style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: 'var(--muted)', textDecoration: 'none', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
          ← WRITEUPS
        </Link>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, padding: '2px 6px', border: '1px solid var(--border)', color: 'var(--muted)' }}>{writeup.platform}</span>
          <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, padding: '2px 6px', border: `1px solid ${diffColor[writeup.difficulty]}`, color: diffColor[writeup.difficulty] }}>{writeup.difficulty}</span>
        </div>
      </div>

      <div className="wr-wrap">

        {/* Cover image */}
        {writeup.cover_image_url && (
          <img src={writeup.cover_image_url} alt={writeup.title} className="wr-cover" />
        )}

        {/* Meta */}
        <div className="wr-meta">
          <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, padding: '3px 8px', border: '1px solid var(--border)', color: 'var(--muted)', letterSpacing: 1 }}>{writeup.platform}</span>
          {writeup.machine_os && <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, padding: '3px 8px', border: '1px solid var(--border)', color: 'var(--muted)' }}>{writeup.machine_os}</span>}
          <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, padding: '3px 8px', border: `1px solid ${diffColor[writeup.difficulty]}`, color: diffColor[writeup.difficulty] }}>{writeup.difficulty}</span>
          <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--muted)' }}>{format(new Date(writeup.created_at), 'dd MMM yyyy')}</span>
        </div>

        {/* Title */}
        <h1 className="wr-title">{writeup.title}</h1>

        {/* Tags */}
        {writeup.tags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '2rem' }}>
            {writeup.tags.map((t: string) => (
              <span key={t} style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, padding: '2px 7px', border: '1px solid var(--border)', color: 'var(--muted)', letterSpacing: 1 }}>{t}</span>
            ))}
          </div>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, var(--green), transparent)', marginBottom: '2rem' }} />

        {/* Content */}
        <div className="wr-body">
          <WriteupContent content={writeup.content || ''} />
        </div>

        {/* Attachment */}
        {writeup.attachment_url && (
          <div className="wr-attachment">
            <span style={{ color: 'var(--green)', fontSize: 20 }}>📎</span>
            <div>
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--muted)', letterSpacing: 1, marginBottom: 4 }}>ATTACHMENT</div>
              <a href={writeup.attachment_url} target="_blank" rel="noreferrer"
                style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: 'var(--green)', textDecoration: 'none', letterSpacing: 1 }}>
                ↓ Download {writeup.attachment_url.split('/').pop()}
              </a>
            </div>
          </div>
        )}

      </div>
    </>
  )
}
