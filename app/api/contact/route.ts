import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body
    if (!name || !email || !message) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    const { error } = await supabaseAdmin().from('messages').insert({ name, email, subject, message })
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
