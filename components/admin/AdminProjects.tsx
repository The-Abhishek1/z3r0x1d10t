'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { AdminHeader, Card, Field, SaveBtn, DeleteBtn } from './helpers'
import UploadBox from './UploadBox'
import type { Project } from '@/types'

const blank: Partial<Project> = {
  name: '', description: '', status: 'shipped',
  stack: [], demo_url: '', github_url: '',
  image_url: '', video_url: '', featured: false, sort_order: 0,
}

export default function AdminProjects() {
  const [items, setItems] = useState<Partial<Project>[]>([])
  const [open, setOpen] = useState<number | null>(null)

  const load = () => supabase.from('projects').select('*').order('sort_order').then(({ data }) => setItems(data || []))
  useEffect(() => { load() }, [])

  const set = (idx: number, k: keyof Project) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setItems(i => i.map((x, j) => j === idx ? { ...x, [k]: e.target.value } : x))

  const setVal = (idx: number, k: keyof Project, v: unknown) =>
    setItems(i => i.map((x, j) => j === idx ? { ...x, [k]: v } : x))

  async function save(item: Partial<Project>) {
    const { error } = item.id
      ? await supabase.from('projects').update(item).eq('id', item.id)
      : await supabase.from('projects').insert(item)
    if (error) toast.error(error.message); else { toast.success('Saved!'); load() }
  }

  async function del(id: string) {
    await supabase.from('projects').delete().eq('id', id)
    toast.success('Deleted'); load()
  }

  return (
    <div>
      <AdminHeader title="PROJECTS" onAdd={() => setItems(i => [...i, { ...blank }])} addLabel="+ Project" />
      {items.map((item, idx) => (
        <Card key={item.id || idx}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: open === idx ? '1.2rem' : 0 }}
            onClick={() => setOpen(open === idx ? null : idx)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {item.image_url && <img src={item.image_url} alt="" style={{ width: 32, height: 32, objectFit: 'cover', border: '1px solid var(--border)' }} />}
              <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 13, color: 'var(--green)' }}>{item.name || 'New Project'}</span>
              <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: 'var(--muted)', letterSpacing: 1 }}>{item.status}</span>
            </div>
            <span style={{ color: 'var(--muted)' }}>{open === idx ? '▲' : '▼'}</span>
          </div>

          {open === idx && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Field label="Name"><input type="text" value={item.name || ''} onChange={set(idx, 'name')} /></Field>
                <Field label="Status">
                  <select value={item.status} onChange={set(idx, 'status')}>
                    {['live','shipped','wip','open-source'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Demo URL"><input type="url" value={item.demo_url || ''} onChange={set(idx, 'demo_url')} /></Field>
                <Field label="GitHub URL"><input type="url" value={item.github_url || ''} onChange={set(idx, 'github_url')} /></Field>
                <Field label="Sort Order"><input type="number" value={item.sort_order || 0} onChange={set(idx, 'sort_order')} /></Field>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 20 }}>
                  <label style={{ margin: 0 }}>Featured</label>
                  <input type="checkbox" checked={item.featured || false} style={{ width: 'auto' }}
                    onChange={e => setVal(idx, 'featured', e.target.checked)} />
                </div>
              </div>
              <Field label="Description">
                <textarea rows={3} value={item.description || ''} onChange={set(idx, 'description')} />
              </Field>
              <Field label="Stack (comma-separated)">
                <input type="text" value={(item.stack || []).join(', ')}
                  onChange={e => setVal(idx, 'stack', e.target.value.split(',').map((s: string) => s.trim()))} />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
                <UploadBox
                  label="Thumbnail / Cover Image"
                  folder="projects/images"
                  accept="image/*"
                  currentUrl={item.image_url}
                  onUploaded={url => setVal(idx, 'image_url', url)}
                />
                <UploadBox
                  label="Demo Video (mp4/webm)"
                  folder="projects/videos"
                  accept="video/mp4,video/webm,video/mov"
                  currentUrl={item.video_url}
                  onUploaded={url => setVal(idx, 'video_url', url)}
                />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <SaveBtn onClick={() => save(item)} label="Save Project" />
                {item.id && <DeleteBtn onClick={() => del(item.id!)} />}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
