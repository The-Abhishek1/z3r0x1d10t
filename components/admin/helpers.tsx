'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

export function AdminHeader({ title, onAdd, addLabel = '+ Add' }: { title: string; onAdd?: () => void; addLabel?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
      <h1 style={{ fontFamily: 'Orbitron, monospace', fontSize: 18, fontWeight: 700, color: 'var(--green)', letterSpacing: 2 }}>{title}</h1>
      {onAdd && <button onClick={onAdd} style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, letterSpacing: 1, padding: '8px 16px', border: '1px solid var(--green)', color: 'var(--green)', background: 'transparent', cursor: 'pointer' }}>{addLabel}</button>}
    </div>
  )
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: 12 }}><label>{label}</label>{children}</div>
}

export function SaveBtn({ loading, onClick, label = 'Save' }: { loading?: boolean; onClick?: () => void; label?: string }) {
  return (
    <button onClick={onClick} disabled={loading} style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, letterSpacing: 1, padding: '8px 20px', border: '1px solid var(--green)', color: 'var(--bg)', background: loading ? 'var(--muted)' : 'var(--green)', cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8 }}>
      {loading ? 'Saving...' : label}
    </button>
  )
}

export function DeleteBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, letterSpacing: 1, padding: '6px 12px', border: '1px solid #ff4444', color: '#ff4444', background: 'transparent', cursor: 'pointer' }}>Delete</button>
  )
}

export function Card({ children }: { children: React.ReactNode }) {
  return <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '1.5rem', marginBottom: 12 }}>{children}</div>
}
