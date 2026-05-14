'use client'
import { useEffect, useRef, useState } from 'react'
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
  const [uploadingInline, setUploadingInline] = useState(false)
  const textareaRefs = useRef<Record<number, HTMLTextAreaElement | null>>({})

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

  // Upload image and insert markdown at cursor
  async function uploadInlineImage(idx: number, file: File) {
    setUploadingInline(true)
    const ext = file.name.split('.').pop()
    const path = `writeups/inline/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('portfolio').upload(path, file, { upsert: true })
    if (error) { toast.error('Upload failed: ' + error.message); setUploadingInline(false); return }
    const { data } = supabase.storage.from('portfolio').getPublicUrl(path)
    const markdownImg = `\n![screenshot](${data.publicUrl})\n`

    // Insert at cursor position in textarea
    const textarea = textareaRefs.current[idx]
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const current = (items[idx]?.content || '')
      const newContent = current.slice(0, start) + markdownImg + current.slice(end)
      setVal(idx, 'content', newContent)
      // Restore cursor after insert
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + markdownImg.length
        textarea.focus()
      }, 50)
    } else {
      setVal(idx, 'content', (items[idx]?.content || '') + markdownImg)
    }
    toast.success('Image inserted!')
    setUploadingInline(false)
  }

  const diffColor: Record<string, string> = { easy: '#00ff41', medium: '#ffaa00', hard: '#ff4444', insane: '#ff00ff' }

  return (
    <div>
      <AdminHeader title="WRITEUPS" onAdd={() => { setItems(i => [{ ...blank }, ...i]); setOpen(0) }} addLabel="+ Writeup" />
      {items.map((item, idx) => (
        <Card key={item.id || idx}>
          {/* Collapse header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: open === idx ? '1.2rem' : 0 }}
            onClick={() => setOpen(open === idx ? null : idx)}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              {item.cover_image_url && <img src={item.cover_image_url} alt="" style={{ width: 36, height: 24, objectFit: 'cover', border: '1px solid var(--border)', flexShrink: 0 }} />}
              <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, padding: '1px 5px', border: '1px solid var(--border)', color: 'var(--muted)' }}>{item.platform}</span>
              <span style={{ fontSize: 12, color: 'var(--text)' }}>{item.title || 'New Writeup'}</span>
              {item.difficulty && <span style={{ fontSize: 9, fontFamily: 'Share Tech Mono, monospace', color: diffColor[item.difficulty] }}>{item.difficulty}</span>}
              <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: item.published ? 'var(--green)' : '#ffaa00' }}>{item.published ? '● published' : '○ draft'}</span>
            </div>
            <span style={{ color: 'var(--muted)', flexShrink: 0 }}>{open === idx ? '▲' : '▼'}</span>
          </div>

          {open === idx && (
            <div>
              {/* Row 1 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 8, marginBottom: 8 }}>
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
              </div>

              {/* Row 2 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 8, marginBottom: 8 }}>
                <Field label="External URL (leave blank for inline content)">
                  <input type="url" value={item.external_url || ''} onChange={set(idx, 'external_url')} placeholder="https://app.hackthebox.com/..." />
                </Field>
                <Field label="Tags (comma-separated)">
                  <input type="text" value={(item.tags || []).join(', ')}
                    onChange={e => setVal(idx, 'tags', e.target.value.split(',').map((s: string) => s.trim()))} />
                </Field>
                <div style={{ paddingTop: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label style={{ margin: 0 }}>Published</label>
                  <input type="checkbox" checked={item.published || false} style={{ width: 'auto', cursor: 'pointer' }}
                    onChange={e => setVal(idx, 'published', e.target.checked)} />
                </div>
              </div>

              {/* Cover image — SEPARATE clearly labeled */}
              <div style={{ border: '1px solid var(--border)', padding: '1rem', marginBottom: 12, background: 'rgba(0,255,65,0.02)' }}>
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: 'var(--green)', letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase' }}>
                  ▶ Cover Image (shown on writeup card + detail page header)
                </div>
                <UploadBox
                  label="Upload cover image"
                  folder="writeups/covers"
                  accept="image/*"
                  currentUrl={item.cover_image_url}
                  onUploaded={url => setVal(idx, 'cover_image_url', url)}
                />
              </div>

              {/* Markdown content with inline image toolbar */}
              <div style={{ border: '1px solid var(--border)', marginBottom: 12 }}>
                <div style={{ background: 'var(--bg3)', padding: '6px 10px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: 'var(--green)', letterSpacing: 2, textTransform: 'uppercase' }}>▶ Content (Markdown)</span>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {/* Quick format buttons */}
                    {[
                      { label: 'H2', insert: '\n## ' },
                      { label: 'H3', insert: '\n### ' },
                      { label: '```', insert: '\n```bash\n\n```\n' },
                      { label: 'bold', insert: '**text**' },
                      { label: '> quote', insert: '\n> ' },
                      { label: '---', insert: '\n---\n' },
                    ].map(btn => (
                      <button key={btn.label} onClick={() => {
                        const ta = textareaRefs.current[idx]
                        if (!ta) return
                        const s = ta.selectionStart
                        const cur = items[idx]?.content || ''
                        const newVal = cur.slice(0, s) + btn.insert + cur.slice(s)
                        setVal(idx, 'content', newVal)
                        setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + btn.insert.length; ta.focus() }, 10)
                      }} style={{
                        fontFamily: 'Share Tech Mono, monospace', fontSize: 9, padding: '2px 7px',
                        border: '1px solid var(--border)', color: 'var(--muted)', background: 'none',
                        cursor: 'pointer', letterSpacing: 1,
                      }}>{btn.label}</button>
                    ))}
                    {/* Inline image upload */}
                    <label style={{
                      fontFamily: 'Share Tech Mono, monospace', fontSize: 9, padding: '2px 9px',
                      border: '1px solid var(--green-dim)', color: 'var(--green-dim)', cursor: uploadingInline ? 'wait' : 'pointer', letterSpacing: 1,
                    }}>
                      {uploadingInline ? 'uploading...' : '↑ img'}
                      <input type="file" accept="image/*" disabled={uploadingInline} style={{ display: 'none' }}
                        onChange={e => e.target.files?.[0] && uploadInlineImage(idx, e.target.files[0])} />
                    </label>
                  </div>
                </div>
                <textarea
                  ref={el => { textareaRefs.current[idx] = el }}
                  rows={16}
                  value={item.content || ''}
                  onChange={set(idx, 'content')}
                  placeholder={`## Challenge Info\n- **Platform:** HackTheBox\n- **Difficulty:** Easy\n\n## Enumeration\n...\n\n## Exploitation\n\`\`\`bash\ncurl http://target/api\n\`\`\`\n\n## Flag\n\`HTB{...}\``}
                  style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, lineHeight: 1.6, resize: 'vertical', border: 'none', outline: 'none', width: '100%', padding: '10px', background: 'var(--bg)' }}
                />
              </div>

              {/* Attachment */}
              <div style={{ border: '1px solid var(--border)', padding: '1rem', marginBottom: 12 }}>
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: 'var(--muted)', letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase' }}>
                  ▶ Attachment (PDF / script / notes — optional)
                </div>
                <UploadBox
                  label="Upload attachment"
                  folder="writeups/attachments"
                  accept=".pdf,.txt,.md,.py,.sh,.zip"
                  currentUrl={item.attachment_url}
                  onUploaded={url => setVal(idx, 'attachment_url', url)}
                />
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <SaveBtn onClick={() => save(item)} label="Save Writeup" />
                {item.id && <DeleteBtn onClick={() => del(item.id!)} />}
                {item.id && item.published && (
                  <a href={`/writeups/${item.id}`} target="_blank" rel="noreferrer"
                    style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, padding: '8px 14px', border: '1px solid var(--border)', color: 'var(--muted)', textDecoration: 'none', marginTop: 6 }}>
                    ↗ Preview
                  </a>
                )}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
