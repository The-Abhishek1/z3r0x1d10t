export interface Profile {
  id: string
  name: string
  alias: string
  tagline: string
  bio: string
  location: string
  avatar_url?: string
  resume_url?: string
  bmc_username?: string
  updated_at: string
}

export interface Stat {
  id: string
  label: string
  value: string
  sub?: string
  icon?: string
  sort_order: number
}

export interface Project {
  id: string
  name: string
  description: string
  status: 'live' | 'shipped' | 'wip' | 'open-source'
  stack: string[]
  demo_url?: string
  github_url?: string
  image_url?: string
  featured: boolean
  sort_order: number
  created_at: string
}

export interface TimelineItem {
  id: string
  date_label: string
  title: string
  body: string
  tags: string[]
  highlight: boolean
  sort_order: number
}

export interface Writeup {
  id: string
  title: string
  platform: string
  difficulty: 'easy' | 'medium' | 'hard' | 'insane'
  content?: string
  external_url?: string
  machine_os?: string
  tags: string[]
  published: boolean
  created_at: string
}

export interface Cheatsheet {
  id: string
  title: string
  category: string
  entries: { label: string; cmd: string }[]
  sort_order: number
}

export interface Badge {
  id: string
  label: string
  hot: boolean
  sort_order: number
}

export interface ContactLink {
  id: string
  label: string
  value: string
  url: string
  icon: string
  sort_order: number
}

export interface Message {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  read: boolean
  created_at: string
}
