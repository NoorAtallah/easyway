'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export type Notification = {
  id: string
  type: string
  service: string
  title: string
  body: string
  quote_id: string | null
  is_read: boolean
  created_at: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // 1. Initial fetch
    supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) setNotifications(data)
        setLoading(false)
      })

    // 2. Single channel with both listeners chained before subscribe
    const channel = supabase
  .channel(`notifications_realtime_${Math.random()}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          setNotifications(prev => [payload.new as Notification, ...prev])
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'notifications' },
        (payload) => {
          setNotifications(prev =>
            prev.map(n => n.id === payload.new.id ? payload.new as Notification : n)
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, []) // single effect, runs once

  const markAllRead = useCallback(async () => {
    const supabase = createClient()
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id)
    if (!unreadIds.length) return
    await supabase.from('notifications').update({ is_read: true }).in('id', unreadIds)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }, [notifications])

  const markOneRead = useCallback(async (id: string) => {
    const supabase = createClient()
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }, [])

  const unreadCount = notifications.filter(n => !n.is_read).length

  return { notifications, loading, unreadCount, markAllRead, markOneRead }
}