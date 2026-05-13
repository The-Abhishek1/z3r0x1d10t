'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { AdminHeader, Card, Field, SaveBtn, DeleteBtn } from './helpers'
import type { Stat } from '@/types'

export default function AdminStats() {
  const [items, setItems] = useState<Stat[]>([])

  const load = () => supabase.from('stats').select('*').order('sort_order').then(({ data }) => setItems(data || []))
  useEffect(() => { load() }, [])

  async function save(item: Stat) {
    const { error } = item.id
      ? await supabase.from('stats').update(item).eq('id', item.id)
      : await supabase.from('stats').insert(item)
    if (error) toast.error(error.message); else { toast.success('Saved!'); load() }
  }

  async function del(id: string) {
    await supabase.from('stats').delete().eq('id', id)
    toast.success('Deleted'); load()
  }

  function add() {
    setItems(i => [...i, { id: '', label: '', value: '', sub: '', sort_order: i.length + 1 } as Stat])
  }

  return (
    <div>
      <AdminHeader title="STATS" onAdd={add} />
      {items.map((item, idx) => (
        <Card key={item.id || idx}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 8, alignItems: 'end' }}>
            <Field label="Value"><input type="text" value={item.value} onChange={e => setItems(i => i.map((x, j) => j === idx ? { ...x, value: e.target.value } : x))} /></Field>
            <Field label="Label"><input type="text" value={item.label} onChange={e => setItems(i => i.map((x, j) => j === idx ? { ...x, label: e.target.value } : x))} /></Field>
            <Field label="Sub text"><input type="text" value={item.sub || ''} onChange={e => setItems(i => i.map((x, j) => j === idx ? { ...x, sub: e.target.value } : x))} /></Field>
            <div style={{ display: 'flex', gap: 6, paddingBottom: 2 }}>
              <SaveBtn onClick={() => save(item)} label="Save" />
              {item.id && <DeleteBtn onClick={() => del(item.id)} />}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
