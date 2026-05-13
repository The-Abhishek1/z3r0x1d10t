export default function Footer({ alias, viewCount }: { alias: string; viewCount: number }) {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)', padding: '1.5rem 2rem',
      textAlign: 'center', fontFamily: 'Share Tech Mono, monospace',
      fontSize: 10, color: 'var(--muted)', letterSpacing: 1,
    }}>
      <span style={{ color: 'var(--green)' }}>{alias}</span> · built with terminal energy · {new Date().getFullYear()}
      <div style={{ marginTop: 6, fontSize: 10, color: 'var(--muted)' }}>
        <span style={{ color: 'var(--green-dim)' }}>{viewCount.toLocaleString()}</span> visitors · root@0xidiot:~$ <span className="blink">_</span>
      </div>
    </footer>
  )
}
