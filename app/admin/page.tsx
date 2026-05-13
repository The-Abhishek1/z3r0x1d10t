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
  { id: 'profile',    label: 'Profile',       icon: '👤' },
  { id: 'stats',      label: 'Stats',         icon: '📊' },
  { id: 'badges',     label: 'Badges',        icon: '🏷️' },
  { id: 'projects',   label: 'Projects',      icon: '🚀' },
  { id: 'timeline',   label: 'Timeline',      icon: '📅' },
  { id: 'writeups',   label: 'Writeups',      icon: '📝' },
  { id: 'cheatsheets',label: 'Cheatsheets',   icon: '📋' },
  { id: 'contact',    label: 'Contact Links', icon: '🔗' },
  { id: 'messages',   label: 'Messages',      icon: '💬' },
]

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Share Tech Mono, monospace', color: 'var(--green)' }}>
      Loading<span className="blink">_</span>
    </div>
  )

  if (!session) return (
    <div style={{ maxWidth: 420, margin: '10vh auto', padding: '2rem' }}>
      <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 20, fontWeight: 900, color: 'var(--green)', marginBottom: '0.5rem', textShadow: '0 0 20px var(--green-glow)' }}>0xIdiot Admin</div>
      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--muted)', letterSpacing: 2, marginBottom: '2rem' }}>AUTHENTICATION REQUIRED</div>
      <Auth supabaseClient={supabase} appearance={{
        theme: ThemeSupa,
        variables: { default: { colors: {
          brand: '#00ff41', brandAccent: '#00cc33',
          inputBackground: '#080f08', inputText: '#c8ffc8',
          inputBorder: 'rgba(0,255,65,0.15)', inputBorderFocus: '#00ff41',
          inputBorderHover: 'rgba(0,255,65,0.4)', inputLabelText: '#5a8a5a',
          defaultButtonBackground: '#080f08', defaultButtonBackgroundHover: '#0a140a',
        }}},
      }} providers={[]} />
    </div>
  )

  if (session.user.email !== ADMIN_EMAIL) {
    supabase.auth.signOut()
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#ff4444', fontFamily: 'Share Tech Mono, monospace' }}>Access denied.</div>
  }

  const activeTabObj = tabs.find(t => t.id === activeTab)

  function selectTab(id: string) {
    setActiveTab(id)
    setSidebarOpen(false)
  }

  return (
    <>
      <style>{`
        .admin-layout { display: flex; min-height: 100vh; position: relative; }

        /* Sidebar */
        .admin-sidebar {
          width: 200px; background: var(--bg2);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          flex-shrink: 0; position: sticky; top: 0; height: 100vh; overflow-y: auto;
        }
        .admin-main { flex: 1; padding: 2rem; overflow-y: auto; min-width: 0; }

        /* Mobile topbar */
        .admin-topbar {
          display: none; align-items: center; justify-content: space-between;
          padding: 0 1rem; height: 52px;
          background: var(--bg2); border-bottom: 1px solid var(--border);
          position: sticky; top: 0; z-index: 50;
        }
        .admin-hamburger {
          background: none; border: 1px solid var(--border);
          color: var(--green); cursor: pointer; padding: 6px 10px;
          font-family: Share Tech Mono, monospace; font-size: 11px; letter-spacing: 1px;
        }

        /* Mobile overlay sidebar */
        .admin-overlay {
          display: none; position: fixed; inset: 0; z-index: 200;
        }
        .admin-overlay.open { display: flex; }
        .admin-overlay-bg {
          position: absolute; inset: 0; background: rgba(0,0,0,0.7);
        }
        .admin-overlay-panel {
          position: relative; z-index: 1; width: 240px; background: var(--bg2);
          border-right: 1px solid var(--border); display: flex; flex-direction: column;
          height: 100%; overflow-y: auto;
        }

        /* Sidebar nav items */
        .admin-nav-item {
          display: flex; align-items: center; gap: 10px;
          width: 100%; text-align: left; padding: 11px 1rem;
          font-family: Share Tech Mono, monospace; font-size: 11px;
          letter-spacing: 1px; text-transform: uppercase;
          background: transparent; border: none; border-left: 2px solid transparent;
          cursor: pointer; transition: all 0.15s; color: var(--muted);
        }
        .admin-nav-item.active {
          background: var(--green-faint); color: var(--green);
          border-left-color: var(--green);
        }
        .admin-nav-item:hover:not(.active) { color: var(--text); background: rgba(255,255,255,0.02); }
        .admin-nav-icon { font-size: 14px; flex-shrink: 0; }

        /* Responsive */
        @media (max-width: 768px) {
          .admin-sidebar { display: none; }
          .admin-topbar { display: flex; }
          .admin-main { padding: 1rem; }
        }
      `}</style>

      <div className="admin-layout">

        {/* Desktop sidebar */}
        <aside className="admin-sidebar">
          <SidebarContent
            session={session}
            activeTab={activeTab}
            onSelect={selectTab}
            onSignOut={() => supabase.auth.signOut()}
          />
        </aside>

        {/* Mobile topbar */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
          <div className="admin-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 13, fontWeight: 900, color: 'var(--green)', letterSpacing: 2 }}>ADMIN</span>
              <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--muted)' }}>
                {activeTabObj?.icon} {activeTabObj?.label}
              </span>
            </div>
            <button className="admin-hamburger" onClick={() => setSidebarOpen(true)}>☰ MENU</button>
          </div>

          {/* Main content */}
          <main className="admin-main">
            {activeTab === 'profile'     && <AdminProfile />}
            {activeTab === 'stats'       && <AdminStats />}
            {activeTab === 'badges'      && <AdminBadges />}
            {activeTab === 'projects'    && <AdminProjects />}
            {activeTab === 'timeline'    && <AdminTimeline />}
            {activeTab === 'writeups'    && <AdminWriteups />}
            {activeTab === 'cheatsheets' && <AdminCheatsheets />}
            {activeTab === 'contact'     && <AdminContact />}
            {activeTab === 'messages'    && <AdminMessages />}
          </main>
        </div>

        {/* Mobile overlay sidebar */}
        <div className={`admin-overlay ${sidebarOpen ? 'open' : ''}`}>
          <div className="admin-overlay-bg" onClick={() => setSidebarOpen(false)} />
          <div className="admin-overlay-panel">
            <SidebarContent
              session={session}
              activeTab={activeTab}
              onSelect={selectTab}
              onSignOut={() => { supabase.auth.signOut(); setSidebarOpen(false) }}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>

      </div>
    </>
  )
}

function SidebarContent({ session, activeTab, onSelect, onSignOut, onClose }: {
  session: Session
  activeTab: string
  onSelect: (id: string) => void
  onSignOut: () => void
  onClose?: () => void
}) {
  return (
    <>
      <div style={{ padding: '1.2rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 13, fontWeight: 900, color: 'var(--green)', letterSpacing: 2 }}>ADMIN</div>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: 'var(--muted)', marginTop: 2, letterSpacing: 1 }}>
            {session.user.email?.split('@')[0]}
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', cursor: 'pointer', padding: '4px 8px', fontFamily: 'Share Tech Mono, monospace', fontSize: 10 }}>✕</button>
        )}
      </div>

      <nav style={{ flex: 1, padding: '0.5rem 0' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => onSelect(t.id)}
            className={`admin-nav-item ${activeTab === t.id ? 'active' : ''}`}>
            <span className="admin-nav-icon">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <a href="/" target="_blank" style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: 'var(--muted)', textDecoration: 'none', letterSpacing: 1 }}>↗ View Site</a>
        <button onClick={onSignOut} style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', letterSpacing: 1, padding: 0 }}>Sign Out</button>
      </div>
    </>
  )
}
