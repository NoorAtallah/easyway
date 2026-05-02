'use client'
import { createPortal } from 'react-dom'
import { useRef } from 'react'
import { useState, useTransition, useEffect } from 'react'
import { Mail, Phone, MapPin, X, Clock, ArrowRight, Package } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { updateMovingQuoteStatus, getQuoteStatusHistory } from './actions'
import { EmailModal } from './EmailModal'
import type { MovingQuote } from '@/types/moving'

type Status = 'new' | 'contacted' | 'quoted' | 'won' | 'lost'
type Role = 'admin' | 'manager' | 'staff'
type MovingItem = { id: string; name: string; section: string; cuft: number }

type HistoryEntry = {
  id: string
  from_status: Status | null
  to_status: Status
  changed_by_name: string | null
  changed_by_email: string | null
  changed_at: string
}

const STATUS_OPTIONS: Status[] = ['new', 'contacted', 'quoted', 'won', 'lost']

const statusColors: Record<Status, string> = {
  new:       'bg-[#8cc7c4]/20 text-[#1a2e35] border-[#8cc7c4]/40',
  contacted: 'bg-blue-100 text-blue-700 border-blue-200',
  quoted:    'bg-amber-100 text-amber-700 border-amber-200',
  won:       'bg-green-100 text-green-700 border-green-200',
  lost:      'bg-gray-100 text-gray-500 border-gray-200',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] bg-[#1a2e35] text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-[#8cc7c4] inline-block" />
      {message}
    </div>
  )
}

function ItemsList({ items, movingItems }: {
  items: Record<string, number>
  movingItems: MovingItem[]
}) {
  const entries = Object.entries(items).filter(([, count]) => count > 0)
  if (entries.length === 0) return <p className="text-sm text-[#9aa5b4]">No items listed.</p>

  const grouped = new Map<string, { name: string; cuft: number; count: number }[]>()

  for (const [key, count] of entries) {
    // Try UUID lookup first
    const found = movingItems.find(i => i.id === key)

    let section: string
    let name: string
    let cuft: number

    if (found) {
      // New format: UUID key
      section = found.section
      name = found.name
      cuft = found.cuft
    } else if (key.includes('__')) {
      // Old format: "Section__Item name"
      const [s, n] = key.split('__')
      section = s
      name = n
      cuft = 0
    } else {
      section = 'Other'
      name = key
      cuft = 0
    }

    if (!grouped.has(section)) grouped.set(section, [])
    grouped.get(section)!.push({ name, cuft, count })
  }

  return (
    <div className="flex flex-col gap-3">
      {Array.from(grouped.entries()).map(([section, sectionItems]) => (
        <div key={section}>
          <p className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#9aa5b4] mb-1">{section}</p>
          <div className="bg-[#fafbfc] border border-[#edf0f4] rounded-lg overflow-hidden">
            {sectionItems.map(({ name, cuft, count }, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 border-b border-[#edf0f4] last:border-0 text-xs">
                <div>
                  <span className="font-medium text-[#1a2e35]">{name}</span>
                  {cuft > 0 && <span className="text-[#9aa5b4] ml-1.5">· {cuft} cu.ft</span>}
                </div>
                <span className="font-bold text-[#1a2e35]">× {count}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function StatusDropdown({ quoteId, currentStatus, onChange }: {
  quoteId: string
  currentStatus: Status
  onChange: (newStatus: Status) => void
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const dropdownHeight = STATUS_OPTIONS.length * 36
      const top = spaceBelow < dropdownHeight ? rect.top - dropdownHeight - 4 : rect.bottom + 4
      setDropdownPos({ top, left: rect.left })
    }
    setOpen(o => !o)
  }

  const handleSelect = (status: Status) => {
    setOpen(false)
    if (status === currentStatus) return
    startTransition(async () => {
      const result = await updateMovingQuoteStatus(quoteId, status)
      if (result.success) onChange(status)
      else alert(result.error ?? 'Failed')
    })
  }

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={handleOpen}
        disabled={isPending}
        className={`text-[10px] font-bold uppercase tracking-[0.5px] px-2.5 py-[4px] rounded-full border cursor-pointer flex items-center gap-1 ${statusColors[currentStatus]} ${isPending ? 'opacity-50' : ''}`}
      >
        {currentStatus}
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && typeof document !== 'undefined' && createPortal(
        <>
          <div className="fixed inset-0 z-[90]" onClick={() => setOpen(false)} />
          <div
            className="fixed bg-white border border-[#dde3ea] rounded-md shadow-lg z-[99] min-w-[120px] overflow-hidden"
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
            onClick={e => e.stopPropagation()}
          >
            {STATUS_OPTIONS.map(s => (
              <button key={s} onClick={() => handleSelect(s)}
                className={`w-full text-left px-3 py-2 text-xs uppercase tracking-[0.5px] font-bold border-none bg-transparent cursor-pointer hover:bg-[#fafbfc] ${s === currentStatus ? 'text-[#8cc7c4]' : 'text-[#4a5568]'}`}>
                {s}
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </div>
  )
}

function DetailPanel({ quote, userRole, movingItems, onClose }: {
  quote: MovingQuote; userRole: Role; movingItems: MovingItem[]; onClose: () => void
}) {
  const [history, setHistory] = useState<HistoryEntry[] | null>(null)
  const canSeeHistory = userRole === 'admin' || userRole === 'manager'

  useEffect(() => {
    if (!canSeeHistory) return
    getQuoteStatusHistory(quote.id, 'moving').then(setHistory)
  }, [quote.id, canSeeHistory])

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[200] transition-opacity" onClick={onClose} />
      <aside className="fixed top-0 right-0 h-screen w-full max-w-[500px] bg-white z-[201] shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
        <div className="sticky top-0 bg-white border-b border-[#dde3ea] px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1a2e35] m-0">Quote details</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded border-none bg-transparent cursor-pointer">
            <X size={18} className="text-[#4a5568]" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">

          {/* Customer */}
          <section>
            <p className="text-[11px] tracking-[0.12em] uppercase text-[#718096] font-bold mb-2">Customer</p>
            {quote.reference_id && (
              <p className="text-xs font-mono font-semibold text-[#8cc7c4] mb-2">{quote.reference_id}</p>
            )}
            <p className="text-lg font-semibold text-[#1a2e35] m-0">{quote.first_name} {quote.last_name}</p>
            <div className="flex flex-col gap-1.5 mt-2 text-sm">
              <a href={`mailto:${quote.email}`} className="flex items-center gap-2 text-[#4a5568] hover:text-[#8cc7c4] no-underline">
                <Mail size={14} /> {quote.email}
              </a>
              <a href={`tel:${quote.phone}`} className="flex items-center gap-2 text-[#4a5568] hover:text-[#8cc7c4] no-underline">
                <Phone size={14} /> {quote.phone}
              </a>
            </div>
          </section>

          {/* Move details */}
          <section>
            <p className="text-[11px] tracking-[0.12em] uppercase text-[#718096] font-bold mb-2">Move details</p>
            <div className="bg-[#fafbfc] border border-[#edf0f4] rounded-lg overflow-hidden">
              <div className="flex items-start gap-3 px-3 py-2.5 border-b border-[#edf0f4]">
                <MapPin size={14} className="text-[#8cc7c4] mt-0.5 shrink-0" />
                <div className="flex-1 text-xs">
                  <p className="text-[#9aa5b4] m-0">Pickup</p>
                  <p className="font-semibold text-[#1a2e35] m-0">{quote.pickup_city}, {quote.pickup_state} <span className="font-normal text-[#9aa5b4]">({quote.pickup_zip})</span></p>
                </div>
              </div>
              <div className="flex items-start gap-3 px-3 py-2.5 border-b border-[#edf0f4]">
                <MapPin size={14} className="text-[#1a2e35] mt-0.5 shrink-0" />
                <div className="flex-1 text-xs">
                  <p className="text-[#9aa5b4] m-0">Dropoff</p>
                  <p className="font-semibold text-[#1a2e35] m-0">{quote.dropoff_city}, {quote.dropoff_state} <span className="font-normal text-[#9aa5b4]">({quote.dropoff_zip})</span></p>
                </div>
              </div>
              <div className="flex justify-between items-center px-3 py-2.5 border-b border-[#edf0f4] text-xs">
                <span className="text-[#9aa5b4]">Distance</span>
                <span className="font-bold text-[#8cc7c4]">{quote.distance_miles} miles</span>
              </div>
              <div className="flex justify-between items-center px-3 py-2.5 border-b border-[#edf0f4] text-xs">
                <span className="text-[#9aa5b4]">Total volume</span>
                <span className="font-semibold text-[#1a2e35]">{quote.total_cuft} cu.ft</span>
              </div>
              {quote.preferred_date && (
                <div className="flex justify-between items-center px-3 py-2.5 border-b border-[#edf0f4] text-xs">
                  <span className="text-[#9aa5b4]">Preferred date</span>
                  <span className="font-semibold text-[#1a2e35]">{quote.preferred_date}</span>
                </div>
              )}
              <div className="flex justify-between items-center px-3 py-2.5 text-xs">
                <span className="text-[#9aa5b4]">Vehicle move</span>
                <span className={`font-semibold ${quote.need_vehicle ? 'text-[#1a2e35]' : 'text-[#9aa5b4]'}`}>
                  {quote.need_vehicle ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </section>

          {/* Items */}
          <section>
            <p className="text-[11px] tracking-[0.12em] uppercase text-[#718096] font-bold mb-2 flex items-center gap-1.5">
              <Package size={12} /> Items list
            </p>
            <ItemsList items={quote.items} movingItems={movingItems} />
          </section>

          {/* Status */}
          <section>
            <p className="text-[11px] tracking-[0.12em] uppercase text-[#718096] font-bold mb-2">Current status</p>
            <span className={`text-[10px] font-bold uppercase tracking-[0.5px] px-2.5 py-[4px] rounded-full border inline-block ${statusColors[quote.status]}`}>
              {quote.status}
            </span>
            <p className="text-xs text-[#9aa5b4] mt-2 m-0">Received {formatDateTime(quote.created_at)}</p>
          </section>

          {/* History */}
          {canSeeHistory && (
            <section>
              <p className="text-[11px] tracking-[0.12em] uppercase text-[#718096] font-bold mb-3 flex items-center gap-1.5">
                <Clock size={12} /> Status history
              </p>
              {history === null ? (
                <p className="text-sm text-[#9aa5b4]">Loading...</p>
              ) : history.length === 0 ? (
                <p className="text-sm text-[#9aa5b4]">No changes yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {history.map(h => (
                    <div key={h.id} className="border-l-2 border-[#8cc7c4] pl-3 py-0.5">
                      <div className="flex items-center gap-1.5 text-xs mb-1">
                        {h.from_status ? (
                          <>
                            <span className={`uppercase font-bold px-1.5 py-[1px] rounded-full ${statusColors[h.from_status]}`}>{h.from_status}</span>
                            <ArrowRight size={11} className="text-[#9aa5b4]" />
                            <span className={`uppercase font-bold px-1.5 py-[1px] rounded-full ${statusColors[h.to_status]}`}>{h.to_status}</span>
                          </>
                        ) : (
                          <span className={`uppercase font-bold px-1.5 py-[1px] rounded-full ${statusColors[h.to_status]}`}>Set to {h.to_status}</span>
                        )}
                      </div>
                      <p className="text-xs text-[#4a5568] m-0">by <span className="font-semibold text-[#1a2e35]">{h.changed_by_name || h.changed_by_email || 'Unknown'}</span></p>
                      <p className="text-[11px] text-[#9aa5b4] m-0 mt-0.5">{formatDateTime(h.changed_at)}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </aside>
    </>
  )
}

export default function MovingQuotesTable({
  quotes: initialQuotes, userRole, movingItems = [], onCountChange,
}: {
  quotes: MovingQuote[]
  userRole: Role
  movingItems?: MovingItem[]
  onCountChange?: (delta: number) => void
}) {
  const [quotes, setQuotes] = useState(initialQuotes)
  const [selectedQuote, setSelectedQuote] = useState<MovingQuote | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [emailQuote, setEmailQuote] = useState<MovingQuote | null>(null)

useEffect(() => {
  const supabase = createClient()
  const channel = supabase
    .channel('moving_quotes_realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'moving_quotes' },
      (payload) => {
        console.log('Moving realtime payload:', payload)
        if (payload.eventType === 'INSERT') {
          const newQuote = payload.new as MovingQuote
          setQuotes(prev => [newQuote, ...prev])
          onCountChange?.(1)
          setToast(`New quote from ${newQuote.first_name} ${newQuote.last_name}`)
        }
        if (payload.eventType === 'UPDATE') {
          const updated = payload.new as MovingQuote
          setQuotes(prev => prev.map(q => q.id === updated.id ? updated : q))
          setSelectedQuote(prev => prev?.id === updated.id ? updated : prev)
        }
        if (payload.eventType === 'DELETE') {
          const removed = payload.old as Pick<MovingQuote, 'id'>
          setQuotes(prev => prev.filter(q => q.id !== removed.id))
          setSelectedQuote(prev => prev?.id === removed.id ? null : prev)
          onCountChange?.(-1)
        }
      }
    )
    .subscribe()
  return () => { supabase.removeChannel(channel) }
}, [onCountChange])

  const handleStatusChange = (id: string, newStatus: Status) => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q))
    if (selectedQuote?.id === id) setSelectedQuote(prev => prev ? { ...prev, status: newStatus } : null)
  }

  if (quotes.length === 0) {
    return (
      <div className="bg-white border border-[#dde3ea] rounded-lg p-12 text-center">
        <p className="text-[#718096] text-sm">No moving quotes yet. They'll appear here when customers submit the form.</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white border border-[#dde3ea] rounded-lg overflow-hidden">

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-[#edf0f4]">
          {quotes.map(q => (
            <div key={q.id} onClick={() => setSelectedQuote(q)} className="p-4 hover:bg-[#fafbfc] cursor-pointer">
              <div className="text-xs text-[#9aa5b4] mb-1">
                {formatDate(q.created_at)}
                {q.reference_id && (
                  <span className="ml-2 font-mono font-semibold text-[#8cc7c4]">{q.reference_id}</span>
                )}
              </div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="font-semibold text-[#1a2e35] text-sm">{q.first_name} {q.last_name}</div>
                <StatusDropdown quoteId={q.id} currentStatus={q.status} onChange={s => handleStatusChange(q.id, s)} />
              </div>
              <div className="flex flex-col gap-1 text-xs text-[#4a5568] mb-2">
                <button onClick={e => { e.stopPropagation(); setEmailQuote(q) }}
                  className="flex items-center gap-1.5 hover:text-[#8cc7c4] text-[#4a5568] border-none bg-transparent cursor-pointer p-0 text-xs">
                  <Mail size={11} /> {q.email}
                </button>
                <a href={`tel:${q.phone}`} onClick={e => e.stopPropagation()} className="flex items-center gap-1.5 hover:text-[#8cc7c4]">
                  <Phone size={11} /> {q.phone}
                </a>
              </div>
              <div className="flex items-center justify-between text-xs text-[#718096]">
                <div className="flex items-center gap-1">
                  <MapPin size={11} />
                  {q.pickup_city} → {q.dropoff_city}
                </div>
                <span>{q.distance_miles} mi · {q.total_cuft} cu.ft</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-[#fafbfc] border-b border-[#dde3ea]">
              <tr className="text-left text-[11px] tracking-[0.1em] uppercase text-[#4a5568] font-bold">
                <th className="px-4 py-3">Ref</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Volume</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Received</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map(q => (
                <tr key={q.id} onClick={() => setSelectedQuote(q)}
                  className="border-b border-[#edf0f4] last:border-0 hover:bg-[#fafbfc] cursor-pointer">
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono font-semibold text-[#8cc7c4]">{q.reference_id ?? '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[#1a2e35]">{q.first_name} {q.last_name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1 text-[#4a5568] text-xs">
                      <button onClick={e => { e.stopPropagation(); setEmailQuote(q) }}
                        className="flex items-center gap-1.5 hover:text-[#8cc7c4] text-[#4a5568] border-none bg-transparent cursor-pointer p-0 text-xs">
                        <Mail size={12} /> {q.email}
                      </button>
                      <a href={`tel:${q.phone}`} onClick={e => e.stopPropagation()} className="flex items-center gap-1.5 hover:text-[#8cc7c4]">
                        <Phone size={12} /> {q.phone}
                      </a>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-xs text-[#4a5568]">
                      <MapPin size={11} className="text-[#8cc7c4] shrink-0" />
                      <div>
                        <div className="font-medium text-[#1a2e35]">{q.pickup_city} → {q.dropoff_city}</div>
                        <div className="text-[#9aa5b4]">{q.distance_miles} miles</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-[#4a5568]">{q.total_cuft} cu.ft</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#718096] whitespace-nowrap">
                    {q.preferred_date ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusDropdown quoteId={q.id} currentStatus={q.status} onChange={s => handleStatusChange(q.id, s)} />
                  </td>
                  <td className="px-4 py-3 text-[#718096] text-xs whitespace-nowrap">
                    {formatDate(q.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedQuote && (
        <DetailPanel
          quote={selectedQuote}
          userRole={userRole}
          movingItems={movingItems}
          onClose={() => setSelectedQuote(null)}
        />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {emailQuote && (
        <EmailModal
          quote={{ ...emailQuote, id: emailQuote.reference_id ?? emailQuote.id }}
          customerName={`${emailQuote.first_name} ${emailQuote.last_name}`}
          serviceType="Moving"
          jobDetails={`${emailQuote.total_cuft} cu.ft · ${emailQuote.distance_miles} miles`}
          address={`${emailQuote.pickup_city}, ${emailQuote.pickup_state} → ${emailQuote.dropoff_city}, ${emailQuote.dropoff_state}`}
          date={emailQuote.preferred_date ?? undefined}
          onClose={() => setEmailQuote(null)}
        />
      )}
    </>
  )
}