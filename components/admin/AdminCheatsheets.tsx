'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { AdminHeader, Card, Field, SaveBtn, DeleteBtn } from './helpers'
import UploadBox from './UploadBox'
import type { Cheatsheet } from '@/types'

export default function AdminCheatsheets() {
  const [items, setItems] = useState<Partial<Cheatsheet>[]>([])
  const [open, setOpen] = useState<number | null>(null)

  const load = () => supabase.from('cheatsheets').select('*').order('sort_order').then(({ data }) => setItems(data || []))
  useEffect(() => { load() }, [])

  const setVal = (idx: number, k: keyof Cheatsheet, v: unknown) =>
    setItems(i => i.map((x, j) => j === idx ? { ...x, [k]: v } : x))

  async function save(item: Partial<Cheatsheet>) {
    const { error } = item.id
      ? await supabase.from('cheatsheets').update(item).eq('id', item.id)
      : await supabase.from('cheatsheets').insert(item)
    if (error) toast.error(error.message); else { toast.success('Saved!'); load() }
  }

  async function del(id: string) {
    await supabase.from('cheatsheets').delete().eq('id', id)
    toast.success('Deleted'); load()
  }

  function addEntry(idx: number) {
    setItems(i => i.map((x, j) => j === idx ? { ...x, entries: [...(x.entries || []), { label: '', cmd: '' }] } : x))
  }

  function setEntry(csIdx: number, eIdx: number, k: 'label' | 'cmd', v: string) {
    setItems(i => i.map((x, j) => j === csIdx
      ? { ...x, entries: (x.entries || []).map((e, ei) => ei === eIdx ? { ...e, [k]: v } : e) }
      : x))
  }

  function removeEntry(csIdx: number, eIdx: number) {
    setItems(i => i.map((x, j) => j === csIdx
      ? { ...x, entries: (x.entries || []).filter((_, ei) => ei !== eIdx) }
      : x))
  }

  return (
    <div>
      <AdminHeader title="CHEATSHEETS" onAdd={() => setItems(i => [...i, { title: '', category: 'General', entries: [], sort_order: i.length + 1 }])} addLabel="+ Sheet" />
      {items.map((item, idx) => (
        <Card key={item.id || idx}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: open === idx ? '1.2rem' : 0 }}
            onClick={() => setOpen(open === idx ? null : idx)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {item.reference_url?.match(/\.(png|jpg|jpeg|webp)$/i) &&
                <img src={item.reference_url} alt="" style={{ width: 28, height: 28, objectFit: 'cover', border: '1px solid var(--border)' }} />}
              <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: 'var(--green)' }}>{item.title || 'New Cheatsheet'}</span>
              <span style={{ color: 'var(--muted)', fontSize: 10 }}>[{item.category}]</span>
              <span style={{ fontSize: 9, color: 'var(--muted)' }}>{(item.entries || []).length} entries</span>
            </div>
            <span style={{ color: 'var(--muted)' }}>{open === idx ? '▲' : '▼'}</span>
          </div>

          {open === idx && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: 8 }}>
                <Field label="Title">
                  <input type="text" value={item.title || ''} onChange={e => setVal(idx, 'title', e.target.value)} />
                </Field>
                <Field label="Category">
                  <input type="text" value={item.category || ''} onChange={e => setVal(idx, 'category', e.target.value)} />
                </Field>
                <Field label="Order">
                  <input type="number" value={item.sort_order || 0} onChange={e => setVal(idx, 'sort_order', parseInt(e.target.value))} />
                </Field>
              </div>

              {/* Entries */}
              <div style={{ marginTop: 12, marginBottom: 8 }}>
                <label>Commands / Entries</label>
                {(item.entries || []).map((entry, ei) => (
                  <div key={ei} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: 6, marginBottom: 6 }}>
                    <input type="text" value={entry.label} placeholder="Label (e.g. Full port scan)"
                      onChange={e => setEntry(idx, ei, 'label', e.target.value)} />
                    <input type="text" value={entry.cmd} placeholder="Command or value"
                      onChange={e => setEntry(idx, ei, 'cmd', e.target.value)}
                      style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }} />
                    <button onClick={() => removeEntry(idx, ei)}
                      style={{ background: 'none', border: '1px solid #ff4444', color: '#ff4444', cursor: 'pointer', padding: '4px 8px', fontFamily: 'Share Tech Mono, monospace', fontSize: 10 }}>×</button>
                  </div>
                ))}
                <button onClick={() => addEntry(idx)}
                  style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, letterSpacing: 1, padding: '5px 10px', border: '1px dashed var(--border-bright)', color: 'var(--muted)', background: 'none', cursor: 'pointer', marginTop: 4 }}>
                  + Add Entry
                </button>
              </div>

              {/* Reference image or PDF */}
              <UploadBox
                label="Reference Image or PDF (optional — shown alongside cheatsheet)"
                folder="cheatsheets"
                accept="image/*,.pdf"
                currentUrl={item.reference_url}
                onUploaded={url => setVal(idx, 'reference_url', url)}
              />

              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <SaveBtn onClick={() => save(item)} label="Save Sheet" />
                {item.id && <DeleteBtn onClick={() => del(item.id!)} />}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
