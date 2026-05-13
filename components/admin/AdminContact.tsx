'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { AdminHeader, Card, Field, SaveBtn, DeleteBtn } from './helpers'
import type { ContactLink } from '@/types'

export default function AdminContact() {
  const [items, setItems] = useState<Partial<ContactLink>[]>([])
  const load = () => supabase.from('contact_links').select('*').order('sort_order').then(({ data }) => setItems(data || []))
  useEffect(() => { load() }, [])

  const set = (idx: number, k: keyof ContactLink) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setItems(i => i.map((x, j) => j === idx ? { ...x, [k]: e.target.value } : x))

  async function save(item: Partial<ContactLink>) {
    const { error } = item.id
      ? await supabase.from('contact_links').update(item).eq('id', item.id)
      : await supabase.from('contact_links').insert(item)
    if (error) toast.error(error.message); else { toast.success('Saved!'); load() }
  }
  async function del(id: string) { await supabase.from('contact_links').delete().eq('id', id); toast.success('Deleted'); load() }

  return (
    <div>
      <AdminHeader title="CONTACT LINKS" onAdd={() => setItems(i => [...i, { label: '', value: '', url: '', icon: '@', sort_order: i.length + 1 }])} addLabel="+ Link" />
      {items.map((item, idx) => (
        <Card key={item.id || idx}>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 2fr auto auto auto', gap: 8, alignItems: 'end' }}>
            <Field label="Icon"><input type="text" value={item.icon || ''} onChange={set(idx, 'icon')} style={{ width: 48 }} /></Field>
            <Field label="Label"><input type="text" value={item.label || ''} onChange={set(idx, 'label')} /></Field>
            <Field label="URL"><input type="url" value={item.url || ''} onChange={set(idx, 'url')} /></Field>
            <Field label="Display Value"><input type="text" value={item.value || ''} onChange={set(idx, 'value')} /></Field>
            <SaveBtn onClick={() => save(item)} label="Save" />
            {item.id && <DeleteBtn onClick={() => del(item.id!)} />}
          </div>
        </Card>
      ))}
    </div>
  )
}
