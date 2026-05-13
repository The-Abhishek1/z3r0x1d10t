'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { AdminHeader, Card, DeleteBtn } from './helpers'
import type { Message } from '@/types'
import { formatDistanceToNow } from 'date-fns'

export default function AdminMessages() {
  const [items, setItems] = useState<Message[]>([])
  const [open, setOpen] = useState<string | null>(null)

  const load = () => supabase.from('messages').select('*').order('created_at', { ascending: false }).then(({ data }) => setItems((data as Message[]) || []))
  useEffect(() => { load() }, [])

  async function markRead(id: string) {
    await supabase.from('messages').update({ read: true }).eq('id', id)
    setItems(i => i.map(x => x.id === id ? { ...x, read: true } : x))
  }
  async function del(id: string) {
    await supabase.from('messages').delete().eq('id', id)
    toast.success('Deleted'); load()
  }

  const unread = items.filter(m => !m.read).length

  return (
    <div>
      <AdminHeader title={`MESSAGES ${unread > 0 ? `(${unread} unread)` : ''}`} />
      {items.length === 0 && <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: 'var(--muted)', padding: '2rem', border: '1px dashed var(--border)', textAlign: 'center' }}>No messages yet.</div>}
      {items.map(msg => (
        <Card key={msg.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ cursor: 'pointer', flex: 1 }} onClick={() => { setOpen(open === msg.id ? null : msg.id); if (!msg.read) markRead(msg.id) }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                {!msg.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', flexShrink: 0 }} />}
                <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 12, color: msg.read ? 'var(--muted)' : 'var(--text)' }}>{msg.name}</span>
                <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--muted)' }}>{msg.email}</span>
                <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: 'var(--muted)', marginLeft: 'auto' }}>{formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}</span>
              </div>
              {msg.subject && <div style={{ fontSize: 11, color: 'var(--green-dim)', fontFamily: 'Share Tech Mono, monospace', marginBottom: 4 }}>re: {msg.subject}</div>}
              {open === msg.id && (
                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7, marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 12, whiteSpace: 'pre-wrap' }}>{msg.message}</div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 6, marginLeft: 12, flexShrink: 0 }}>
              <a href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Your message'}`} style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: 'var(--green-dim)', textDecoration: 'none', border: '1px solid var(--border)', padding: '4px 8px' }}>Reply</a>
              <DeleteBtn onClick={() => del(msg.id)} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
