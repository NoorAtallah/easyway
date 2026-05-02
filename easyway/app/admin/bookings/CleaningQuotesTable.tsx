'use client'
import { createPortal } from 'react-dom'
import { useRef, useCallback } from 'react'
import { useState, useTransition, useEffect } from 'react'
import { Mail, Phone, MapPin, X, Clock, ArrowRight, Receipt } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { updateCleaningQuoteStatus, getQuoteStatusHistory } from './actions'
import type { CleaningQuote } from '@/types/cleaning'
import { EmailModal } from './EmailModal'

type Status = 'new' | 'contacted' | 'quoted' | 'confirmed' | 'completed' | 'lost'

type Role = 'admin' | 'manager' | 'staff'

type HistoryEntry = {
  id: string
  from_status: Status | null
  to_status: Status
  changed_by_name: string | null
  changed_by_email: string | null
  changed_at: string
}

const STATUS_OPTIONS: Status[] = ['new', 'contacted', 'quoted', 'confirmed', 'completed', 'lost']

const statusColors: Record<Status, string> = {
  new:       'bg-[#8cc7c4]/20 text-[#1a2e35] border-[#8cc7c4]/40',
  contacted: 'bg-blue-100 text-blue-700 border-blue-200',
  quoted:    'bg-amber-100 text-amber-700 border-amber-200',
  confirmed: 'bg-purple-100 text-purple-700 border-purple-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  lost:      'bg-gray-100 text-gray-500 border-gray-200',
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
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

function StatusDropdown({
  quoteId, currentStatus, onChange,
}: {
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
      // Flip upward if too close to bottom of viewport
      const spaceBelow = window.innerHeight - rect.bottom
      const dropdownHeight = STATUS_OPTIONS.length * 36 // ~36px per item
      const top = spaceBelow < dropdownHeight
        ? rect.top - dropdownHeight - 4
        : rect.bottom + 4
      setDropdownPos({ top, left: rect.left })
    }
    setOpen(o => !o)
  }

  const handleSelect = (status: Status) => {
    setOpen(false)
    if (status === currentStatus) return
    startTransition(async () => {
      const result = await updateCleaningQuoteStatus(quoteId, status)
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

function DetailPanel({ quote, userRole, onClose }: {
  quote: CleaningQuote; userRole: Role; onClose: () => void
}) {
  const [history, setHistory] = useState<HistoryEntry[] | null>(null)
  const canSeeHistory = userRole === 'admin' || userRole === 'manager'

  useEffect(() => {
    if (!canSeeHistory) return
    getQuoteStatusHistory(quote.id, 'cleaning').then(setHistory)
  }, [quote.id, canSeeHistory])

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[200] transition-opacity" onClick={onClose} />
      <aside className="fixed top-0 right-0 h-screen w-full max-w-[500px] bg-white z-[201] shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
        <div className="sticky top-0 bg-white border-b border-[#dde3ea] px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1a2e35] m-0">Booking details</h2>
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
            <p className="text-lg font-semibold text-[#1a2e35] m-0">{quote.name}</p>
            <div className="flex flex-col gap-1.5 mt-2 text-sm">
              <a href={`mailto:${quote.email}`} className="flex items-center gap-2 text-[#4a5568] hover:text-[#8cc7c4] no-underline">
                <Mail size={14} /> {quote.email}
              </a>
              <a href={`tel:${quote.phone}`} className="flex items-center gap-2 text-[#4a5568] hover:text-[#8cc7c4] no-underline">
                <Phone size={14} /> {quote.phone}
              </a>
            </div>
          </section>

          {/* Service */}
          <section>
            <p className="text-[11px] tracking-[0.12em] uppercase text-[#718096] font-bold mb-2">Service</p>
            <p className="text-sm font-semibold text-[#1a2e35]">{quote.service_name}</p>
            {quote.date && (
              <p className="text-xs text-[#718096] mt-1">
                {quote.date}{quote.time ? ` at ${quote.time}` : ''}
              </p>
            )}
          </section>

          {/* Address */}
          {quote.address && (
            <section>
              <p className="text-[11px] tracking-[0.12em] uppercase text-[#718096] font-bold mb-2">Service location</p>
              <div className="flex items-start gap-2 text-sm text-[#4a5568]">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span>{quote.address}</span>
              </div>
            </section>
          )}

          {/* Line items */}
          {quote.line_items?.length > 0 && (
            <section>
              <p className="text-[11px] tracking-[0.12em] uppercase text-[#718096] font-bold mb-2 flex items-center gap-1.5">
                <Receipt size={12} /> Order summary
              </p>
              <div className="bg-[#fafbfc] border border-[#edf0f4] rounded-lg overflow-hidden">
                {quote.line_items.map(l => (
                  <div key={l.key} className="flex justify-between items-center px-3 py-2 border-b border-[#edf0f4] last:border-0 text-xs">
                    <span className="text-[#4a5568]">{l.qty}x {l.label}</span>
                    <span className="font-semibold text-[#1a2e35]">${l.qty * l.price}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center px-3 py-2.5 bg-[#f4f6f8] text-sm font-bold text-[#1a2e35]">
                  <span>Total</span>
                  <span className="text-[#8cc7c4]">${quote.total}</span>
                </div>
              </div>
            </section>
          )}

          {/* Notes */}
          {quote.access_notes && (
            <section>
              <p className="text-[11px] tracking-[0.12em] uppercase text-[#718096] font-bold mb-2">Access notes</p>
              <p className="text-sm text-[#4a5568] leading-relaxed m-0">{quote.access_notes}</p>
            </section>
          )}
          {quote.focus_areas && (
            <section>
              <p className="text-[11px] tracking-[0.12em] uppercase text-[#718096] font-bold mb-2">Focus areas</p>
              <p className="text-sm text-[#4a5568] leading-relaxed m-0">{quote.focus_areas}</p>
            </section>
          )}

          {/* Status */}
          <section>
            <p className="text-[11px] tracking-[0.12em] uppercase text-[#718096] font-bold mb-2">Current status</p>
            <span className={`text-[10px] font-bold uppercase tracking-[0.5px] px-2.5 py-[4px] rounded-full border inline-block ${statusColors[quote.status as Status]}`}>
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

export default function CleaningQuotesTable({
  quotes: initialQuotes, userRole, onCountChange,
}: {
  quotes: CleaningQuote[]; userRole: Role; onCountChange?: (delta: number) => void
}) {
  const [quotes, setQuotes] = useState(initialQuotes)
  const [selectedQuote, setSelectedQuote] = useState<CleaningQuote | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [emailQuote, setEmailQuote] = useState<CleaningQuote | null>(null)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`cleaning_quotes_${Math.random()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cleaning_quotes' }, payload => {
        if (payload.eventType === 'INSERT') {
          const q = payload.new as CleaningQuote
          setQuotes(prev => [q, ...prev])
          onCountChange?.(1)
          setToast(`New booking from ${q.name} — ${q.service_name}`)
        }
        if (payload.eventType === 'UPDATE') {
          const updated = payload.new as CleaningQuote
          setQuotes(prev => prev.map(q => q.id === updated.id ? updated : q))
          setSelectedQuote(prev => prev?.id === updated.id ? updated : prev)
        }
        if (payload.eventType === 'DELETE') {
          const removed = payload.old as CleaningQuote
          setQuotes(prev => prev.filter(q => q.id !== removed.id))
          setSelectedQuote(prev => prev?.id === removed.id ? null : prev)
          onCountChange?.(-1)
        }
      })
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
        <p className="text-[#718096] text-sm">No cleaning bookings yet. They'll appear here when customers submit the form.</p>
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
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="font-semibold text-[#1a2e35] text-sm">{q.name}</div>
                  <div className="text-xs text-[#9aa5b4] mt-0.5">{formatDate(q.created_at)}</div>
                </div>
                <StatusDropdown
                  quoteId={q.id}
                  currentStatus={q.status as Status}
                  onChange={s => handleStatusChange(q.id, s)}
                />
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
                <span className="font-medium text-[#4a5568]">{q.service_name}</span>
                {q.total > 0 && <span className="font-bold text-[#8cc7c4]">${q.total}</span>}
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
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Total</th>
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
  <span className="text-xs font-mono font-semibold text-[#8cc7c4]">
    {q.reference_id ?? '—'}
  </span>
</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[#1a2e35]">{q.name}</div>
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
                    <span className="text-sm text-[#4a5568]">{q.service_name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-bold ${q.total > 0 ? 'text-[#8cc7c4]' : 'text-[#9aa5b4]'}`}>
                      {q.total > 0 ? `$${q.total}` : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#718096] whitespace-nowrap">
                    {q.date ? `${q.date}${q.time ? ` · ${q.time}` : ''}` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusDropdown
                      quoteId={q.id}
                      currentStatus={q.status as Status}
                      onChange={s => handleStatusChange(q.id, s)}
                    />
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
        <DetailPanel quote={selectedQuote} userRole={userRole} onClose={() => setSelectedQuote(null)} />
      )}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

          {emailQuote && (
  <EmailModal
    quote={{ ...emailQuote, id: emailQuote.reference_id ?? emailQuote.id }}
    customerName={emailQuote.name}
    serviceType={emailQuote.service_name}
    jobDetails={emailQuote.service_name}
    address={emailQuote.address ?? undefined}
    date={emailQuote.date ? `${emailQuote.date}${emailQuote.time ? ` at ${emailQuote.time}` : ''}` : undefined}
    initialLineItems={(() => {
      const items = typeof emailQuote.line_items === 'string'
        ? JSON.parse(emailQuote.line_items)
        : emailQuote.line_items ?? []
      return items.map((l: any) => ({
        id: `${l.key}-${Math.random()}`,
        label: `${l.qty}x ${l.label}`,
        price: String(l.qty * l.price),
      }))
    })()}
    onClose={() => setEmailQuote(null)}
  />
)}
    </>
  )
}