'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { AdminHeader, Card, Field, SaveBtn, DeleteBtn } from './helpers'
import type { Badge } from '@/types'

export default function AdminBadges() {
  const [items, setItems] = useState<Badge[]>([])
  const load = () => supabase.from('badges').select('*').order('sort_order').then(({ data }) => setItems(data || []))
  useEffect(() => { load() }, [])

  async function save(item: Badge) {
    const { error } = item.id
      ? await supabase.from('badges').update(item).eq('id', item.id)
      : await supabase.from('badges').insert(item)
    if (error) toast.error(error.message); else { toast.success('Saved!'); load() }
  }
  async function del(id: string) { await supabase.from('badges').delete().eq('id', id); toast.success('Deleted'); load() }
  function add() { setItems(i => [...i, { id: '', label: '', hot: false, sort_order: i.length + 1 } as Badge]) }

  return (
    <div>
      <AdminHeader title="BADGES" onAdd={add} addLabel="+ Badge" />
      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: '1.5rem' }}>Hero section badges. "Hot" badges glow green.</p>
      {items.map((item, idx) => (
        <Card key={item.id || idx}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 8, alignItems: 'end' }}>
            <Field label="Label"><input type="text" value={item.label} onChange={e => setItems(i => i.map((x, j) => j === idx ? { ...x, label: e.target.value } : x))} /></Field>
            <div style={{ paddingBottom: 2 }}>
              <label>Hot (glow)</label>
              <input type="checkbox" checked={item.hot} style={{ width: 'auto', marginTop: 8 }} onChange={e => setItems(i => i.map((x, j) => j === idx ? { ...x, hot: e.target.checked } : x))} />
            </div>
            <SaveBtn onClick={() => save(item)} label="Save" />
            {item.id && <DeleteBtn onClick={() => del(item.id)} />}
          </div>
        </Card>
      ))}
    </div>
  )
}
