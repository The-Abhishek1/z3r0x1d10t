import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  try {
    await supabaseAdmin()
      .from('views')
      .update({ count: supabaseAdmin().rpc('increment_views') })
      .eq('id', 1)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}