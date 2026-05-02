'use client'

import { useEffect, useRef, useState } from 'react'
import { Bell, X, Leaf, Truck, Sparkles, Waves, Wrench } from 'lucide-react'
import { useNotifications, type Notification } from '../hooks/useNotifications'

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  landscaping:  <Leaf size={14} className="text-[#8cc7c4]" />,
  moving:       <Truck size={14} className="text-blue-400" />,
  cleaning:     <Sparkles size={14} className="text-amber-400" />,
  pool:         <Waves size={14} className="text-cyan-400" />,
  plumbing:     <Wrench size={14} className="text-orange-400" />,
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

// Toast that auto-dismisses
function NotifToast({ notif, onDone }: { notif: Notification; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="fixed bottom-6 right-6 z-[400] bg-[#1a2e35] text-white rounded-xl shadow-2xl p-4 w-[300px] animate-in slide-in-from-bottom-3 fade-in duration-300 flex gap-3 items-start">
      <div className="mt-0.5 shrink-0 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
        {SERVICE_ICONS[notif.service] ?? <Bell size={14} className="text-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-white m-0">{notif.title}</p>
        <p className="text-xs text-white/70 mt-0.5 m-0 truncate">{notif.body}</p>
      </div>
      <button
        onClick={onDone}
        className="shrink-0 border-none bg-transparent cursor-pointer p-0 text-white/50 hover:text-white"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export default function NotificationBell() {
  const { notifications, loading, unreadCount, markAllRead, markOneRead } = useNotifications()
  const [open, setOpen] = useState(false)
  const [toasts, setToasts] = useState<Notification[]>([])
  const panelRef = useRef<HTMLDivElement>(null)
  const prevCountRef = useRef(unreadCount)

  // Show toast when new notification arrives
  useEffect(() => {
    if (notifications.length === 0) return
    const latest = notifications[0]
    const isNew = !latest.is_read &&
      new Date(latest.created_at).getTime() > Date.now() - 5000

    if (isNew && prevCountRef.current !== unreadCount) {
      setToasts(prev => [...prev, latest])
    }
    prevCountRef.current = unreadCount
  }, [notifications, unreadCount])

  // Close panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <>
      {/* Bell button */}
      <div className="relative" ref={panelRef}>
        <button
          onClick={() => { setOpen(!open); if (!open) markAllRead() }}
          className="relative p-2 rounded-lg hover:bg-[#edf0f4] border-none bg-transparent cursor-pointer transition-colors"
        >
          <Bell size={20} className="text-[#4a5568]" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#8cc7c4] text-[#1a2e35] text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-in zoom-in duration-150">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown panel */}
        {open && (
          <div className="absolute right-0 top-full mt-2 w-[360px] bg-white border border-[#dde3ea] rounded-xl shadow-2xl z-[300] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#edf0f4]">
              <h3 className="text-sm font-bold text-[#1a2e35] m-0">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-[#8cc7c4] hover:text-[#1a2e35] border-none bg-transparent cursor-pointer font-medium transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[420px] overflow-y-auto">
              {loading ? (
                <div className="p-6 text-center text-sm text-[#9aa5b4]">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell size={24} className="text-[#dde3ea] mx-auto mb-2" />
                  <p className="text-sm text-[#9aa5b4] m-0">No notifications yet</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markOneRead(n.id)}
                    className={`flex gap-3 px-4 py-3 border-b border-[#edf0f4] last:border-0 cursor-pointer transition-colors hover:bg-[#fafbfc] ${!n.is_read ? 'bg-[#8cc7c4]/5' : ''}`}
                  >
                    {/* Icon */}
                    <div className="shrink-0 w-8 h-8 rounded-full bg-[#edf0f4] flex items-center justify-center mt-0.5">
                      {SERVICE_ICONS[n.service] ?? <Bell size={14} className="text-[#718096]" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-xs m-0 leading-snug ${!n.is_read ? 'font-semibold text-[#1a2e35]' : 'font-medium text-[#4a5568]'}`}>
                          {n.title}
                        </p>
                        {!n.is_read && (
                          <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#8cc7c4] mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-[#718096] m-0 mt-0.5 truncate">{n.body}</p>
                      <p className="text-[11px] text-[#9aa5b4] m-0 mt-1">{timeAgo(n.created_at)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Toasts */}
      {toasts.map(t => (
        <NotifToast
          key={t.id}
          notif={t}
          onDone={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
        />
      ))}
    </>
  )
}