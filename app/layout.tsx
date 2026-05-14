import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { createSupabaseServer } from '@/lib/supabase-server'

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createSupabaseServer()
  const { data: profile } = await supabase.from('profile').select('name,tagline,avatar_url').single()

  return {
    title: `${profile?.name || 'z3r0x1d10t'} — Cybersecurity Engineer`,
    description: profile?.tagline || 'Cybersecurity Engineer & Full-Stack Developer. TryHackMe Top 1%.',
    keywords: ['cybersecurity', 'penetration testing', 'ethical hacking', 'CTF', 'Abhishek N', 'z3r0x1d10t'],
    icons: {
      icon: profile?.avatar_url || '/favicon.ico',
      apple: profile?.avatar_url || '/favicon.ico',
    },
    openGraph: {
      title: profile?.name || '0xIdiot',
      description: profile?.tagline || 'Cybersecurity Engineer & Full-Stack Developer',
      images: profile?.avatar_url ? [profile.avatar_url] : [],
    },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#080f08',
              color: '#c8ffc8',
              border: '1px solid rgba(0,255,65,0.3)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
            },
          }}
        />
      </body>
    </html>
  )
}
