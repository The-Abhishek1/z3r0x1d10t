'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { AdminHeader, Card, Field, SaveBtn, DeleteBtn } from './helpers'
import type { TimelineItem } from '@/types'

export default function AdminTimeline() {
  const [items, setItems] = useState<Partial<TimelineItem>[]>([])
  const [open, setOpen] = useState<number | null>(null)
  const load = () => supabase.from('timeline').select('*').order('sort_order').then(({ data }) => setItems(data || []))
  useEffect(() => { load() }, [])

  const set = (idx: number, k: keyof TimelineItem) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setItems(i => i.map((x, j) => j === idx ? { ...x, [k]: e.target.value } : x))

  async function save(item: Partial<TimelineItem>) {
    const { error } = item.id
      ? await supabase.from('timeline').update(item).eq('id', item.id)
      : await supabase.from('timeline').insert(item)
    if (error) toast.error(error.message); else { toast.success('Saved!'); load() }
  }
  async function del(id: string) { await supabase.from('timeline').delete().eq('id', id); toast.success('Deleted'); load() }

  return (
    <div>
      <AdminHeader title="TIMELINE" onAdd={() => setItems(i => [...i, { date_label: '', title: '', body: '', tags: [], highlight: false, sort_order: i.length + 1 }])} addLabel="+ Entry" />
      {items.map((item, idx) => (
        <Card key={item.id || idx}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: open === idx ? '1rem' : 0 }} onClick={() => setOpen(open === idx ? null : idx)}>
            <div>
              <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--green-dim)', marginRight: 12 }}>{item.date_label || 'New Entry'}</span>
              <span style={{ fontSize: 12, color: 'var(--text)' }}>{item.title}</span>
            </div>
            <span style={{ color: 'var(--muted)' }}>{open === idx ? '▲' : '▼'}</span>
          </div>
          {open === idx && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Field label="Date Label"><input type="text" value={item.date_label || ''} onChange={set(idx, 'date_label')} placeholder="Apr 2025" /></Field>
                <Field label="Title"><input type="text" value={item.title || ''} onChange={set(idx, 'title')} /></Field>
              </div>
              <Field label="Body"><textarea rows={3} value={item.body || ''} onChange={set(idx, 'body')} /></Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
                <Field label="Tags (comma-separated)">
                  <input type="text" value={(item.tags || []).join(', ')} onChange={e => setItems(i => i.map((x, j) => j === idx ? { ...x, tags: e.target.value.split(',').map(s => s.trim()) } : x))} />
                </Field>
                <div style={{ paddingTop: 20 }}>
                  <label>Highlight</label>
                  <input type="checkbox" checked={item.highlight || false} style={{ width: 'auto' }} onChange={e => setItems(i => i.map((x, j) => j === idx ? { ...x, highlight: e.target.checked } : x))} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <SaveBtn onClick={() => save(item)} label="Save" />
                {item.id && <DeleteBtn onClick={() => del(item.id!)} />}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
