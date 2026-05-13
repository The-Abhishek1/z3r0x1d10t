import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Admin — 0xIdiot Portfolio' }
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>{children}</div>
}
