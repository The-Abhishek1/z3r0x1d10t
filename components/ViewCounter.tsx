'use client'
import { useEffect } from 'react'

export default function ViewCounter() {
  useEffect(() => {
    fetch('/api/views', { method: 'POST' }).catch(() => {})
  }, [])
  return null
}