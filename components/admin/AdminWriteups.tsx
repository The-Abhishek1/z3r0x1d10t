'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { AdminHeader, Card, Field, SaveBtn, DeleteBtn } from './helpers'
import UploadBox from './UploadBox'
import type { Writeup } from '@/types'

const blank: Partial<Writeup> = {
  title: '', platform: 'HTB', difficulty: 'easy',
  content: '', external_url: '', machine_os: 'Linux',
  cover_image_url: '', attachment_url: '', tags: [], published: false,
}

export default function AdminWriteups() {
  const [items, setItems] = useState<Partial<Writeup>[]>([])
  const [open, setOpen] = useState<number | null>(null)

  const load = () => supabase.from('writeups').select('*').order('created_at', { ascending: false }).then(({ data }) => setItems(data || []))
  useEffect(() => { load() }, [])

  const set = (idx: number, k: keyof Writeup) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setItems(i => i.map((x, j) => j === idx ? { ...x, [k]: e.target.value } : x))

  const setVal = (idx: number, k: keyof Writeup, v: unknown) =>
    setItems(i => i.map((x, j) => j === idx ? { ...x, [k]: v } : x))

  async function save(item: Partial<Writeup>) {
    const { error } = item.id
      ? await supabase.from('writeups').update(item).eq('id', item.id)
      : await supabase.from('writeups').insert(item)
    if (error) toast.error(error.message); else { toast.success('Saved!'); load() }
  }

  async function del(id: string) {
    await supabase.from('writeups').delete().eq('id', id)
    toast.success('Deleted'); load()
  }

  const diffColor: Record<string, string> = { easy: '#00ff41', medium: '#ffaa00', hard: '#ff4444', insane: '#ff00ff' }

  return (
    <div>
      <AdminHeader title="WRITEUPS" onAdd={() => setItems(i => [{ ...blank }, ...i])} addLabel="+ Writeup" />
      {items.map((item, idx) => (
        <Card key={item.id || idx}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: open === idx ? '1.2rem' : 0 }}
            onClick={() => setOpen(open === idx ? null : idx)}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {item.cover_image_url && <img src={item.cover_image_url} alt="" style={{ width: 28, height: 28, objectFit: 'cover', border: '1px solid var(--border)' }} />}
              <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, padding: '1px 5px', border: '1px solid var(--border)', color: 'var(--muted)' }}>{item.platform}</span>
              <span style={{ fontSize: 12, color: 'var(--text)' }}>{item.title || 'New Writeup'}</span>
              <span style={{ fontSize: 9, fontFamily: 'Share Tech Mono, monospace', color: item.difficulty ? diffColor[item.difficulty] : 'var(--muted)' }}>{item.difficulty}</span>
              <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: item.published ? 'var(--green)' : '#ffaa00' }}>{item.published ? 'published' : 'draft'}</span>
            </div>
            <span style={{ color: 'var(--muted)' }}>{open === idx ? '▲' : '▼'}</span>
          </div>

          {open === idx && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <Field label="Title"><input type="text" value={item.title || ''} onChange={set(idx, 'title')} /></Field>
                <Field label="Platform">
                  <select value={item.platform} onChange={set(idx, 'platform')}>
                    {['HTB','THM','picoCTF','PortSwigger','Other'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Difficulty">
                  <select value={item.difficulty} onChange={set(idx, 'difficulty')}>
                    {['easy','medium','hard','insane'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </Field>
                <Field label="Machine OS">
                  <select value={item.machine_os || ''} onChange={set(idx, 'machine_os')}>
                    {['Linux','Windows','Other'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="External URL (optional)">
                  <input type="url" value={item.external_url || ''} onChange={set(idx, 'external_url')} />
                </Field>
                <div style={{ paddingTop: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label style={{ margin: 0 }}>Published</label>
                  <input type="checkbox" checked={item.published || false} style={{ width: 'auto' }}
                    onChange={e => setVal(idx, 'published', e.target.checked)} />
                </div>
              </div>

              <Field label="Tags (comma-separated)">
                <input type="text" value={(item.tags || []).join(', ')}
                  onChange={e => setVal(idx, 'tags', e.target.value.split(',').map((s: string) => s.trim()))} />
              </Field>

              <Field label="Content (Markdown — leave blank if using external URL)">
                <textarea rows={12} value={item.content || ''} onChange={set(idx, 'content')}
                  style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }} />
              </Field>

              {/* Media uploads */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
                <UploadBox
                  label="Cover Image"
                  folder="writeups/images"
                  accept="image/*"
                  currentUrl={item.cover_image_url}
                  onUploaded={url => setVal(idx, 'cover_image_url', url)}
                />
                <UploadBox
                  label="Attachment (PDF / notes / script)"
                  folder="writeups/attachments"
                  accept=".pdf,.txt,.md,.py,.sh,.zip"
                  currentUrl={item.attachment_url}
                  onUploaded={url => setVal(idx, 'attachment_url', url)}
                />
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <SaveBtn onClick={() => save(item)} label="Save Writeup" />
                {item.id && <DeleteBtn onClick={() => del(item.id!)} />}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
