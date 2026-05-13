'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import type { Session } from '@supabase/supabase-js'
import toast from 'react-hot-toast'
import AdminProfile from '@/components/admin/AdminProfile'
import AdminStats from '@/components/admin/AdminStats'
import AdminProjects from '@/components/admin/AdminProjects'
import AdminTimeline from '@/components/admin/AdminTimeline'
import AdminWriteups from '@/components/admin/AdminWriteups'
import AdminCheatsheets from '@/components/admin/AdminCheatsheets'
import AdminMessages from '@/components/admin/AdminMessages'
import AdminBadges from '@/components/admin/AdminBadges'
import AdminContact from '@/components/admin/AdminContact'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL!

const tabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'stats', label: 'Stats' },
  { id: 'badges', label: 'Badges' },
  { id: 'projects', label: 'Projects' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'writeups', label: 'Writeups' },
  { id: 'cheatsheets', label: 'Cheatsheets' },
  { id: 'contact', label: 'Contact Links' },
  { id: 'messages', label: 'Messages' },
]

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Share Tech Mono, monospace', color: 'var(--green)' }}>Loading<span className="blink">_</span></div>

  if (!session) return (
    <div style={{ maxWidth: 420, margin: '10vh auto', padding: '2rem' }}>
      <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 20, fontWeight: 900, color: 'var(--green)', marginBottom: '0.5rem', textShadow: '0 0 20px var(--green-glow)' }}>0xIdiot Admin</div>
      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--muted)', letterSpacing: 2, marginBottom: '2rem' }}>AUTHENTICATION REQUIRED</div>
      <Auth supabaseClient={supabase} appearance={{
        theme: ThemeSupa,
        variables: { default: { colors: { brand: '#00ff41', brandAccent: '#00cc33', inputBackground: '#080f08', inputText: '#c8ffc8', inputBorder: 'rgba(0,255,65,0.15)', inputBorderFocus: '#00ff41', inputBorderHover: 'rgba(0,255,65,0.4)', inputLabelText: '#5a8a5a', defaultButtonBackground: '#080f08', defaultButtonBackgroundHover: '#0a140a' } } },
      }} providers={[]} />
    </div>
  )

  if (session.user.email !== ADMIN_EMAIL) {
    supabase.auth.signOut()
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#ff4444', fontFamily: 'Share Tech Mono, monospace' }}>Access denied. Wrong account.</div>
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: 200, background: 'var(--bg2)', borderRight: '1px solid var(--border)', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem 1rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 13, fontWeight: 900, color: 'var(--green)', letterSpacing: 2 }}>ADMIN</div>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: 'var(--muted)', marginTop: 2, letterSpacing: 1 }}>{session.user.email?.split('@')[0]}</div>
        </div>
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '10px 1rem', fontFamily: 'Share Tech Mono, monospace',
              fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
              background: activeTab === t.id ? 'var(--green-faint)' : 'transparent',
              color: activeTab === t.id ? 'var(--green)' : 'var(--muted)',
              border: 'none', borderLeft: activeTab === t.id ? '2px solid var(--green)' : '2px solid transparent',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>{t.label}</button>
          ))}
        </nav>
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <a href="/" target="_blank" style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: 'var(--muted)', textDecoration: 'none', letterSpacing: 1 }}>↗ View Site</a>
          <button onClick={() => supabase.auth.signOut()} style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', letterSpacing: 1, padding: 0 }}>Sign Out</button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {activeTab === 'profile' && <AdminProfile />}
        {activeTab === 'stats' && <AdminStats />}
        {activeTab === 'badges' && <AdminBadges />}
        {activeTab === 'projects' && <AdminProjects />}
        {activeTab === 'timeline' && <AdminTimeline />}
        {activeTab === 'writeups' && <AdminWriteups />}
        {activeTab === 'cheatsheets' && <AdminCheatsheets />}
        {activeTab === 'contact' && <AdminContact />}
        {activeTab === 'messages' && <AdminMessages />}
      </main>
    </div>
  )
}
