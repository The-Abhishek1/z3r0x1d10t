'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { AdminHeader, Field, SaveBtn } from './helpers'
import type { Profile } from '@/types'

export default function AdminProfile() {
  const [data, setData] = useState<Partial<Profile>>({})
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    supabase.from('profile').select('*').single().then(({ data }) => { if (data) setData(data) })
  }, [])

  async function save() {
    setLoading(true)
    const { error } = await supabase.from('profile').update({ ...data, updated_at: new Date().toISOString() }).eq('id', data.id)
    if (error) toast.error(error.message); else toast.success('Profile saved!')
    setLoading(false)
  }

  async function uploadFile(file: File, field: 'avatar_url' | 'resume_url') {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${field}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('portfolio').upload(path, file, { upsert: true })
    if (error) { toast.error(error.message); setUploading(false); return }
    const { data: urlData } = supabase.storage.from('portfolio').getPublicUrl(path)
    setData(d => ({ ...d, [field]: urlData.publicUrl }))
    toast.success('Uploaded!')
    setUploading(false)
  }

  const set = (k: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setData(d => ({ ...d, [k]: e.target.value }))

  return (
    <div>
      <AdminHeader title="PROFILE" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Name"><input type="text" value={data.name || ''} onChange={set('name')} /></Field>
        <Field label="Alias / Handle"><input type="text" value={data.alias || ''} onChange={set('alias')} /></Field>
        <Field label="Tagline" ><input type="text" value={data.tagline || ''} onChange={set('tagline')} /></Field>
        <Field label="Location"><input type="text" value={data.location || ''} onChange={set('location')} /></Field>
        <Field label="Buy Me a Coffee username"><input type="text" value={data.bmc_username || ''} onChange={set('bmc_username')} placeholder="your-bmc-username" /></Field>
      </div>
      <Field label="Bio">
        <textarea rows={5} value={data.bio || ''} onChange={set('bio')} />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Avatar URL">
          <input type="url" value={data.avatar_url || ''} onChange={set('avatar_url')} placeholder="https://..." />
          <div style={{ marginTop: 6 }}>
            <label style={{ cursor: 'pointer', color: 'var(--green-dim)', fontSize: 10 }}>
              or upload: <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], 'avatar_url')} />
            </label>
          </div>
        </Field>
        <Field label="Resume URL / PDF">
          <input type="url" value={data.resume_url || ''} onChange={set('resume_url')} placeholder="https://..." />
          <div style={{ marginTop: 6 }}>
            <label style={{ cursor: 'pointer', color: 'var(--green-dim)', fontSize: 10 }}>
              or upload: <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], 'resume_url')} />
            </label>
          </div>
        </Field>
      </div>
      <SaveBtn loading={loading || uploading} onClick={save} />
    </div>
  )
}
