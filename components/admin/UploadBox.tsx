'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface UploadBoxProps {
  label: string
  folder: string                      // storage folder e.g. 'projects' | 'writeups'
  accept: string                      // e.g. 'image/*,video/*,.pdf'
  currentUrl?: string
  onUploaded: (url: string) => void
}

export default function UploadBox({ label, folder, accept, currentUrl, onUploaded }: UploadBoxProps) {
  const [uploading, setUploading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('portfolio').upload(path, file, { upsert: true })
    if (error) { toast.error('Upload failed: ' + error.message); setUploading(false); return }
    const { data } = supabase.storage.from('portfolio').getPublicUrl(path)
    onUploaded(data.publicUrl)
    toast.success('Uploaded!')
    setUploading(false)
  }

  const isVideo = currentUrl?.match(/\.(mp4|webm|mov)$/i)
  const isImage = currentUrl?.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)
  const isPdf   = currentUrl?.match(/\.pdf$/i)

  return (
    <div style={{ marginBottom: 12 }}>
      <label>{label}</label>

      {/* Preview */}
      {currentUrl && (
        <div style={{ marginBottom: 8, padding: 8, border: '1px solid var(--border)', background: 'var(--bg)' }}>
          {isImage && <img src={currentUrl} alt="preview" style={{ maxWidth: '100%', maxHeight: 160, display: 'block', objectFit: 'cover' }} />}
          {isVideo && <video src={currentUrl} controls style={{ maxWidth: '100%', maxHeight: 160 }} />}
          {isPdf   && <div style={{ fontSize: 11, color: 'var(--green-dim)', fontFamily: 'Share Tech Mono, monospace' }}>📄 PDF attached — <a href={currentUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--green)' }}>view</a></div>}
          {!isImage && !isVideo && !isPdf && <div style={{ fontSize: 11, color: 'var(--green-dim)', fontFamily: 'Share Tech Mono, monospace' }}>📎 <a href={currentUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--green)' }}>{currentUrl.split('/').pop()}</a></div>}
        </div>
      )}

      {/* URL input */}
      <input
        type="url"
        value={currentUrl || ''}
        placeholder="https://... or upload below"
        onChange={e => onUploaded(e.target.value)}
        style={{ marginBottom: 6 }}
      />

      {/* File upload */}
      <label style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        cursor: uploading ? 'not-allowed' : 'pointer',
        border: '1px dashed var(--border-bright)',
        padding: '6px 12px', color: 'var(--muted)',
        fontFamily: 'Share Tech Mono, monospace', fontSize: 10,
        letterSpacing: 1, transition: 'all 0.2s',
      }}>
        {uploading ? 'Uploading...' : `↑ Upload file (${accept})`}
        <input
          type="file"
          accept={accept}
          disabled={uploading}
          style={{ display: 'none' }}
          onChange={handleFile}
        />
      </label>
    </div>
  )
}
