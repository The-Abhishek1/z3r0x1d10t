'use client'
import { useEffect } from 'react'

export default function ViewCounter() {
  useEffect(() => {
    // Only count once per session
    if (sessionStorage.getItem('viewed')) return
    sessionStorage.setItem('viewed', '1')
    fetch('/api/views', { method: 'POST' }).catch(() => {})
  }, [])
  return null
}
