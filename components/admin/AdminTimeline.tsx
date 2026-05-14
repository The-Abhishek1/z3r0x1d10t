'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { AdminHeader, Card, Field, SaveBtn, DeleteBtn } from './helpers'
import type { TimelineItem } from '@/types'

export default function AdminTimeline() {
  const [items, setItems] = useState<Partial<TimelineItem>[]>([])
  const [open, setOpen] = useState<number | null>(null)

  const load = () => supabase.from('timeline').select('*').order('date_sort', { ascending: false }).then(({ data }) => setItems(data || []))
  useEffect(() => { load() }, [])

  const set = (idx: number, k: keyof TimelineItem) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setItems(i => i.map((x, j) => j === idx ? { ...x, [k]: e.target.value } : x))

  const setVal = (idx: number, k: keyof TimelineItem, v: unknown) =>
    setItems(i => i.map((x, j) => j === idx ? { ...x, [k]: v } : x))

  async function save(item: Partial<TimelineItem>) {
    const { error } = item.id
      ? await supabase.from('timeline').update(item).eq('id', item.id)
      : await supabase.from('timeline').insert(item)
    if (error) toast.error(error.message); else { toast.success('Saved!'); load() }
  }

  async function del(id: string) {
    await supabase.from('timeline').delete().eq('id', id)
    toast.success('Deleted'); load()
  }

  return (
    <div>
      <AdminHeader
        title="TIMELINE"
        onAdd={() => setItems(i => [...i, {
          date_label: '', title: '', body: '',
          tags: [], highlight: false,
          sort_order: i.length + 1,
          date_sort: 0,
        } as Partial<TimelineItem>])}
        addLabel="+ Entry"
      />
      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--muted)', marginBottom: '1rem', padding: '8px 10px', border: '1px solid var(--border)', letterSpacing: 1 }}>
        💡 Set <strong style={{ color: 'var(--green-dim)' }}>Date Sort</strong> to control order — higher number = shown first (more recent). e.g. current year = 10, oldest = 1, future targets = 0
      </div>
      {items.map((item, idx) => (
        <Card key={item.id || idx}>
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: open === idx ? '1rem' : 0 }}
            onClick={() => setOpen(open === idx ? null : idx)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', minWidth: 0 }}>
              {/* Date sort badge */}
              <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, padding: '1px 6px', border: '1px solid var(--border)', color: 'var(--green-dim)', flexShrink: 0 }}>
                #{(item as any).date_sort ?? '?'}
              </span>
              <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--green-dim)', flexShrink: 0 }}>{item.date_label || 'New Entry'}</span>
              <span style={{ fontSize: 12, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
              {item.highlight && <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 8, color: 'var(--green)', border: '1px solid var(--green)', padding: '0 4px' }}>★</span>}
            </div>
            <span style={{ color: 'var(--muted)', flexShrink: 0, marginLeft: 8 }}>{open === idx ? '▲' : '▼'}</span>
          </div>

          {open === idx && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
                <Field label="Date Label">
                  <input type="text" value={item.date_label || ''} onChange={set(idx, 'date_label')} placeholder="Apr 2025" />
                </Field>
                <Field label="Title">
                  <input type="text" value={item.title || ''} onChange={set(idx, 'title')} />
                </Field>
                <Field label="Date Sort (higher = newer, shown first)">
                  <input
                    type="number"
                    value={(item as any).date_sort ?? 0}
                    onChange={e => setVal(idx, 'date_sort' as keyof TimelineItem, parseInt(e.target.value) || 0)}
                    placeholder="e.g. 10"
                  />
                </Field>
                <div style={{ paddingTop: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label style={{ margin: 0 }}>Highlight (glow)</label>
                  <input type="checkbox" checked={item.highlight || false} style={{ width: 'auto', cursor: 'pointer' }}
                    onChange={e => setVal(idx, 'highlight', e.target.checked)} />
                </div>
              </div>

              <Field label="Body">
                <textarea rows={3} value={item.body || ''} onChange={set(idx, 'body')} />
              </Field>

              <Field label="Tags (comma-separated)">
                <input type="text" value={(item.tags || []).join(', ')}
                  onChange={e => setVal(idx, 'tags', e.target.value.split(',').map((s: string) => s.trim()))} />
              </Field>

              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
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
