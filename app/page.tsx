import { createSupabaseServer } from '@/lib/supabase-server'
import Nav from '@/components/Nav'
import HeroSection from '@/components/sections/HeroSection'
import StatsSection from '@/components/sections/StatsSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import TimelineSection from '@/components/sections/TimelineSection'
import WriteupsSection from '@/components/sections/WriteupsSection'
import CheatsheetsSection from '@/components/sections/CheatsheetsSection'
import ContactSection from '@/components/sections/ContactSection'
import ViewCounter from '@/components/ViewCounter'
import Footer from '@/components/Footer'

export const revalidate = 60 // ISR every 60s

export default async function Home() {
  const supabase = await createSupabaseServer()

  const [
    { data: profile },
    { data: stats },
    { data: projects },
    { data: timeline },
    { data: writeups },
    { data: cheatsheets },
    { data: badges },
    { data: contactLinks },
    { data: views },
  ] = await Promise.all([
    supabase.from('profile').select('*').single(),
    supabase.from('stats').select('*').order('sort_order'),
    supabase.from('projects').select('*').order('sort_order'),
    supabase.from('timeline').select('*').order('sort_order'),
    supabase.from('writeups').select('*').eq('published', true).order('created_at', { ascending: false }),
    supabase.from('cheatsheets').select('*').order('sort_order'),
    supabase.from('badges').select('*').order('sort_order'),
    supabase.from('contact_links').select('*').order('sort_order'),
    supabase.from('views').select('count').eq('id', 1).single(),
  ])

  return (
    <>
      <Nav alias={profile?.alias || '0xIdiot'} />
      <main>
        <HeroSection profile={profile} badges={badges || []} />
        <StatsSection stats={stats || []} />
        <ProjectsSection projects={projects || []} />
        <TimelineSection items={timeline || []} />
        <WriteupsSection writeups={writeups || []} />
        <CheatsheetsSection cheatsheets={cheatsheets || []} />
        <ContactSection links={contactLinks || []} bmcUsername={profile?.bmc_username} />
      </main>
      <Footer alias={profile?.alias || '0xIdiot'} viewCount={views?.count || 0} />
      <ViewCounter />
    </>
  )
}
