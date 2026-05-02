'use client'
import { createPortal } from 'react-dom'
import { useRef, useState, useTransition, useEffect } from 'react'
import { Mail, Phone, MapPin, X, Clock, ArrowRight, Waves, Droplets } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { updatePoolCareQuoteStatus, updatePoolFillingQuoteStatus, getQuoteStatusHistory } from './actions'
import { EmailModal } from './EmailModal'
import type { PoolCareQuote, PoolFillingQuote } from '@/types/pool'

type Status = 'new' | 'contacted' | 'quoted' | 'won' | 'lost'
type Role = 'admin' | 'manager' | 'staff'
type PoolTab = 'care' | 'filling'

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
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t) }, [onDone])
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] bg-[#1a2e35] text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-[#8cc7c4] inline-block" />
      {message}
    </div>
  )
}

function StatusDropdown({ quoteId, currentStatus, onChange, onUpdate }: {
  quoteId: string; currentStatus: Status
  onChange: (s: Status) => void
  onUpdate: (id: string, s: Status) => Promise<{ success: boolean; error?: string }>
}) {
  const [open, setOpen]             = useState(false)
  const [isPending, startTransition] = useTransition()
  const [pos, setPos]               = useState({ top: 0, left: 0 })
  const btnRef                      = useRef<HTMLButtonElement>(null)

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - r.bottom
      const dropH = STATUS_OPTIONS.length * 36
      setPos({ top: spaceBelow < dropH ? r.top - dropH - 4 : r.bottom + 4, left: r.left })
    }
    setOpen(o => !o)
  }

  const handleSelect = (s: Status) => {
    setOpen(false)
    if (s === currentStatus) return
    startTransition(async () => {
      const result = await onUpdate(quoteId, s)
      if (result.success) onChange(s)
      else alert(result.error ?? 'Failed')
    })
  }

  return (
    <div className="relative inline-block">
      <button ref={btnRef} onClick={handleOpen} disabled={isPending}
        className={`text-[10px] font-bold uppercase tracking-[0.5px] px-2.5 py-[4px] rounded-full border cursor-pointer flex items-center gap-1 ${statusColors[currentStatus]} ${isPending ? 'opacity-50' : ''}`}>
        {currentStatus}
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && typeof document !== 'undefined' && createPortal(
        <>
          <div className="fixed inset-0 z-[90]" onClick={() => setOpen(false)} />
          <div className="fixed bg-white border border-[#dde3ea] rounded-md shadow-lg z-[99] min-w-[120px] overflow-hidden"
            style={{ top: pos.top, left: pos.left }} onClick={e => e.stopPropagation()}>
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

// ── Care Detail Panel ──────────────────────────────────────────────────────
function CareDetailPanel({ quote, userRole, onClose }: { quote: PoolCareQuote; userRole: Role; onClose: () => void }) {
  const [history, setHistory] = useState<HistoryEntry[] | null>(null)
  const canSeeHistory = userRole === 'admin' || userRole === 'manager'

  useEffect(() => {
    if (!canSeeHistory) return
    getQuoteStatusHistory(quote.id, 'pool_care').then(setHistory)
  }, [quote.id, canSeeHistory])

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[200]" onClick={onClose} />
      <aside className="fixed top-0 right-0 h-screen w-full max-w-[500px] bg-white z-[201] shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
        <div className="sticky top-0 bg-white border-b border-[#dde3ea] px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1a2e35] m-0">Quote details</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded border-none bg-transparent cursor-pointer">
            <X size={18} className="text-[#4a5568]" />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-6">
          <section>
            <p className="text-[11px] tracking-[0.12em] uppercase text-[#718096] font-bold mb-2">Customer</p>
            {quote.reference_id && <p className="text-xs font-mono font-semibold text-[#8cc7c4] mb-2">{quote.reference_id}</p>}
            <p className="text-lg font-semibold text-[#1a2e35] m-0">{quote.first_name} {quote.last_name}</p>
            <div className="flex flex-col gap-1.5 mt-2 text-sm">
              <a href={`mailto:${quote.email}`} className="flex items-center gap-2 text-[#4a5568] hover:text-[#8cc7c4] no-underline"><Mail size={14} />{quote.email}</a>
              <a href={`tel:${quote.phone}`} className="flex items-center gap-2 text-[#4a5568] hover:text-[#8cc7c4] no-underline"><Phone size={14} />{quote.phone}</a>
            </div>
          </section>
          <section>
            <p className="text-[11px] tracking-[0.12em] uppercase text-[#718096] font-bold mb-2">Service location</p>
            <div className="flex items-start gap-2 text-sm text-[#4a5568]">
              <MapPin size={14} className="mt-0.5 shrink-0" />
              <div><div>{quote.address}</div><div className="text-[#9aa5b4]">{quote.city}, {quote.zip_code}</div></div>
            </div>
          </section>
          {quote.pool_size && (
            <section>
              <p className="text-[11px] tracking-[0.12em] uppercase text-[#718096] font-bold mb-2">Pool size</p>
              <p className="text-sm text-[#4a5568]">{quote.pool_size} gallons</p>
            </section>
          )}
          {quote.notes && (
            <section>
              <p className="text-[11px] tracking-[0.12em] uppercase text-[#718096] font-bold mb-2">Notes</p>
              <p className="text-sm text-[#4a5568] leading-relaxed m-0">{quote.notes}</p>
            </section>
          )}
          <section>
            <p className="text-[11px] tracking-[0.12em] uppercase text-[#718096] font-bold mb-2">Current status</p>
            <span className={`text-[10px] font-bold uppercase tracking-[0.5px] px-2.5 py-[4px] rounded-full border inline-block ${statusColors[quote.status as Status]}`}>{quote.status}</span>
            <p className="text-xs text-[#9aa5b4] mt-2 m-0">Received {formatDateTime(quote.created_at)}</p>
          </section>
          {canSeeHistory && (
            <section>
              <p className="text-[11px] tracking-[0.12em] uppercase text-[#718096] font-bold mb-3 flex items-center gap-1.5"><Clock size={12} /> Status history</p>
              {history === null ? <p className="text-sm text-[#9aa5b4]">Loading...</p>
                : history.length === 0 ? <p className="text-sm text-[#9aa5b4]">No changes yet.</p>
                : (
                  <div className="flex flex-col gap-3">
                    {history.map(h => (
                      <div key={h.id} className="border-l-2 border-[#8cc7c4] pl-3 py-0.5">
                        <div className="flex items-center gap-1.5 text-xs mb-1">
                          {h.from_status ? (<><span className={`uppercase font-bold px-1.5 py-[1px] rounded-full ${statusColors[h.from_status]}`}>{h.from_status}</span><ArrowRight size={11} className="text-[#9aa5b4]" /><span className={`uppercase font-bold px-1.5 py-[1px] rounded-full ${statusColors[h.to_status]}`}>{h.to_status}</span></>) : (<span className={`uppercase font-bold px-1.5 py-[1px] rounded-full ${statusColors[h.to_status]}`}>Set to {h.to_status}</span>)}
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

// ── Filling Detail Panel ───────────────────────────────────────────────────
function FillingDetailPanel({ quote, userRole, onClose }: { quote: PoolFillingQuote; userRole: Role; onClose: () => void }) {
  const [history, setHistory] = useState<HistoryEntry[] | null>(null)
  const canSeeHistory = userRole === 'admin' || userRole === 'manager'

  useEffect(() => {
    if (!canSeeHistory) return
    getQuoteStatusHistory(quote.id, 'pool_filling').then(setHistory)
  }, [quote.id, canSeeHistory])

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[200]" onClick={onClose} />
      <aside className="fixed top-0 right-0 h-screen w-full max-w-[500px] bg-white z-[201] shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
        <div className="sticky top-0 bg-white border-b border-[#dde3ea] px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1a2e35] m-0">Quote details</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded border-none bg-transparent cursor-pointer">
            <X size={18} className="text-[#4a5568]" />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-6">
          <section>
            <p className="text-[11px] tracking-[0.12em] uppercase text-[#718096] font-bold mb-2">Customer</p>
            {quote.reference_id && <p className="text-xs font-mono font-semibold text-[#8cc7c4] mb-2">{quote.reference_id}</p>}
            <p className="text-lg font-semibold text-[#1a2e35] m-0">{quote.first_name} {quote.last_name}</p>
            <div className="flex flex-col gap-1.5 mt-2 text-sm">
              <a href={`mailto:${quote.email}`} className="flex items-center gap-2 text-[#4a5568] hover:text-[#8cc7c4] no-underline"><Mail size={14} />{quote.email}</a>
            </div>
          </section>
          <section>
            <p className="text-[11px] tracking-[0.12em] uppercase text-[#718096] font-bold mb-2">Service location</p>
            <div className="flex items-start gap-2 text-sm text-[#4a5568]">
              <MapPin size={14} className="mt-0.5 shrink-0" />
              <div><div>{quote.street}</div><div className="text-[#9aa5b4]">{quote.city}, {quote.state} {quote.zip_code}</div></div>
            </div>
          </section>
          <section>
            <p className="text-[11px] tracking-[0.12em] uppercase text-[#718096] font-bold mb-2">Pool volume</p>
            <p className="text-sm font-semibold text-[#1a2e35]">{Number(quote.gallons).toLocaleString()} gallons</p>
          </section>
          <section>
            <p className="text-[11px] tracking-[0.12em] uppercase text-[#718096] font-bold mb-2">Current status</p>
            <span className={`text-[10px] font-bold uppercase tracking-[0.5px] px-2.5 py-[4px] rounded-full border inline-block ${statusColors[quote.status as Status]}`}>{quote.status}</span>
            <p className="text-xs text-[#9aa5b4] mt-2 m-0">Received {formatDateTime(quote.created_at)}</p>
          </section>
          {canSeeHistory && (
            <section>
              <p className="text-[11px] tracking-[0.12em] uppercase text-[#718096] font-bold mb-3 flex items-center gap-1.5"><Clock size={12} /> Status history</p>
              {history === null ? <p className="text-sm text-[#9aa5b4]">Loading...</p>
                : history.length === 0 ? <p className="text-sm text-[#9aa5b4]">No changes yet.</p>
                : (
                  <div className="flex flex-col gap-3">
                    {history.map(h => (
                      <div key={h.id} className="border-l-2 border-[#8cc7c4] pl-3 py-0.5">
                        <div className="flex items-center gap-1.5 text-xs mb-1">
                          {h.from_status ? (<><span className={`uppercase font-bold px-1.5 py-[1px] rounded-full ${statusColors[h.from_status]}`}>{h.from_status}</span><ArrowRight size={11} className="text-[#9aa5b4]" /><span className={`uppercase font-bold px-1.5 py-[1px] rounded-full ${statusColors[h.to_status]}`}>{h.to_status}</span></>) : (<span className={`uppercase font-bold px-1.5 py-[1px] rounded-full ${statusColors[h.to_status]}`}>Set to {h.to_status}</span>)}
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

// ── Main component ─────────────────────────────────────────────────────────
export default function PoolQuotesTable({
  careQuotes: initialCare,
  fillingQuotes: initialFilling,
  userRole,
  onCountChange,
}: {
  careQuotes: PoolCareQuote[]
  fillingQuotes: PoolFillingQuote[]
  userRole: Role
  onCountChange?: (delta: number) => void
}) {
  const [poolTab, setPoolTab]           = useState<PoolTab>('care')
  const [care, setCare]                 = useState(initialCare)
  const [filling, setFilling]           = useState(initialFilling)
  const [selectedCare, setSelectedCare] = useState<PoolCareQuote | null>(null)
  const [selectedFilling, setSelectedFilling] = useState<PoolFillingQuote | null>(null)
  const [emailCare, setEmailCare]       = useState<PoolCareQuote | null>(null)
  const [emailFilling, setEmailFilling] = useState<PoolFillingQuote | null>(null)
  const [toast, setToast]               = useState<string | null>(null)

  // Realtime — care
  useEffect(() => {
    const supabase = createClient()
    const ch = supabase.channel(`pool_care_${Math.random()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pool_care_quotes' }, payload => {
        if (payload.eventType === 'INSERT') {
          const q = payload.new as PoolCareQuote
          setCare(prev => [q, ...prev])
          onCountChange?.(1)
          setToast(`New pool care quote from ${q.first_name} ${q.last_name}`)
        }
        if (payload.eventType === 'UPDATE') {
          const u = payload.new as PoolCareQuote
          setCare(prev => prev.map(q => q.id === u.id ? u : q))
          setSelectedCare(prev => prev?.id === u.id ? u : prev)
        }
        if (payload.eventType === 'DELETE') {
          const r = payload.old as PoolCareQuote
          setCare(prev => prev.filter(q => q.id !== r.id))
          setSelectedCare(prev => prev?.id === r.id ? null : prev)
          onCountChange?.(-1)
        }
      }).subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [onCountChange])

  // Realtime — filling
  useEffect(() => {
    const supabase = createClient()
    const ch = supabase.channel(`pool_filling_${Math.random()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pool_filling_quotes' }, payload => {
        if (payload.eventType === 'INSERT') {
          const q = payload.new as PoolFillingQuote
          setFilling(prev => [q, ...prev])
          onCountChange?.(1)
          setToast(`New pool filling quote from ${q.first_name} ${q.last_name}`)
        }
        if (payload.eventType === 'UPDATE') {
          const u = payload.new as PoolFillingQuote
          setFilling(prev => prev.map(q => q.id === u.id ? u : q))
          setSelectedFilling(prev => prev?.id === u.id ? u : prev)
        }
        if (payload.eventType === 'DELETE') {
          const r = payload.old as PoolFillingQuote
          setFilling(prev => prev.filter(q => q.id !== r.id))
          setSelectedFilling(prev => prev?.id === r.id ? null : prev)
          onCountChange?.(-1)
        }
      }).subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [onCountChange])

  const handleCareStatus = (id: string, s: Status) => {
    setCare(prev => prev.map(q => q.id === id ? { ...q, status: s } : q))
    if (selectedCare?.id === id) setSelectedCare(prev => prev ? { ...prev, status: s } : null)
  }
  const handleFillingStatus = (id: string, s: Status) => {
    setFilling(prev => prev.map(q => q.id === id ? { ...q, status: s } : q))
    if (selectedFilling?.id === id) setSelectedFilling(prev => prev ? { ...prev, status: s } : null)
  }

  const activeQuotes = poolTab === 'care' ? care : filling
  const isEmpty = activeQuotes.length === 0

  return (
    <>
      {/* Inner sub-tabs */}
      <div className="flex gap-1 border-b border-[#dde3ea] mb-4">
        {([
          { id: 'care' as PoolTab, label: 'Pool Care', icon: <Waves size={13} />, count: care.length },
          { id: 'filling' as PoolTab, label: 'Water Filling', icon: <Droplets size={13} />, count: filling.length },
        ]).map(({ id, label, icon, count }) => (
          <button key={id} onClick={() => setPoolTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm border-none bg-transparent cursor-pointer whitespace-nowrap transition-colors relative
              ${poolTab === id ? 'text-[#1a2e35] font-semibold' : 'text-[#718096] hover:text-[#1a2e35]'}`}>
            {icon}{label}
            {count > 0 && (
              <span className={`text-[11px] font-bold px-1.5 py-[2px] rounded-full min-w-[20px] text-center
                ${poolTab === id ? 'bg-[#8cc7c4] text-[#1a2e35]' : 'bg-[#edf0f4] text-[#4a5568]'}`}>
                {count}
              </span>
            )}
            {poolTab === id && <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#8cc7c4]" />}
          </button>
        ))}
      </div>

      {isEmpty ? (
        <div className="bg-white border border-[#dde3ea] rounded-lg p-12 text-center">
          <p className="text-[#718096] text-sm">
            No {poolTab === 'care' ? 'pool care' : 'water filling'} quotes yet.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[#dde3ea] rounded-lg overflow-hidden">
          {/* ── Pool Care table ── */}
          {poolTab === 'care' && (
            <>
              <div className="md:hidden divide-y divide-[#edf0f4]">
                {care.map(q => (
                  <div key={q.id} onClick={() => setSelectedCare(q)} className="p-4 hover:bg-[#fafbfc] cursor-pointer">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="font-semibold text-[#1a2e35] text-sm">{q.first_name} {q.last_name}</div>
                        <div className="text-xs text-[#9aa5b4] mt-0.5">
                          {formatDate(q.created_at)}
                          {q.reference_id && <span className="ml-2 font-mono font-semibold text-[#8cc7c4]">{q.reference_id}</span>}
                        </div>
                      </div>
                      <StatusDropdown quoteId={q.id} currentStatus={q.status as Status} onChange={s => handleCareStatus(q.id, s)} onUpdate={updatePoolCareQuoteStatus} />
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-[#4a5568] mb-2">
                      <button onClick={e => { e.stopPropagation(); setEmailCare(q) }} className="flex items-center gap-1.5 hover:text-[#8cc7c4] text-[#4a5568] border-none bg-transparent cursor-pointer p-0 text-xs">
                        <Mail size={11} />{q.email}
                      </button>
                      <a href={`tel:${q.phone}`} onClick={e => e.stopPropagation()} className="flex items-center gap-1.5 hover:text-[#8cc7c4]"><Phone size={11} />{q.phone}</a>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#718096]">
                      <div className="flex items-center gap-1"><MapPin size={11} />{q.city}, {q.zip_code}</div>
                      {q.pool_size && <span>{q.pool_size} gal</span>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="hidden md:block">
                <table className="w-full text-sm">
                  <thead className="bg-[#fafbfc] border-b border-[#dde3ea]">
                    <tr className="text-left text-[11px] tracking-[0.1em] uppercase text-[#4a5568] font-bold">
                      <th className="px-4 py-3">Ref</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Pool size</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Received</th>
                    </tr>
                  </thead>
                  <tbody>
                    {care.map(q => (
                      <tr key={q.id} onClick={() => setSelectedCare(q)} className="border-b border-[#edf0f4] last:border-0 hover:bg-[#fafbfc] cursor-pointer">
                        <td className="px-4 py-3"><span className="text-xs font-mono font-semibold text-[#8cc7c4]">{q.reference_id ?? '—'}</span></td>
                        <td className="px-4 py-3"><div className="font-semibold text-[#1a2e35]">{q.first_name} {q.last_name}</div></td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1 text-[#4a5568] text-xs">
                            <button onClick={e => { e.stopPropagation(); setEmailCare(q) }} className="flex items-center gap-1.5 hover:text-[#8cc7c4] text-[#4a5568] border-none bg-transparent cursor-pointer p-0 text-xs"><Mail size={12} />{q.email}</button>
                            <a href={`tel:${q.phone}`} onClick={e => e.stopPropagation()} className="flex items-center gap-1.5 hover:text-[#8cc7c4]"><Phone size={12} />{q.phone}</a>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-start gap-1.5 text-[#4a5568] text-xs">
                            <MapPin size={12} className="mt-0.5 shrink-0" />
                            <div><div>{q.address}</div><div className="text-[#9aa5b4]">{q.city}, {q.zip_code}</div></div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><span className="text-xs text-[#4a5568]">{q.pool_size ? `${q.pool_size} gal` : '—'}</span></td>
                        <td className="px-4 py-3"><StatusDropdown quoteId={q.id} currentStatus={q.status as Status} onChange={s => handleCareStatus(q.id, s)} onUpdate={updatePoolCareQuoteStatus} /></td>
                        <td className="px-4 py-3 text-[#718096] text-xs whitespace-nowrap">{formatDate(q.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ── Pool Filling table ── */}
          {poolTab === 'filling' && (
            <>
              <div className="md:hidden divide-y divide-[#edf0f4]">
                {filling.map(q => (
                  <div key={q.id} onClick={() => setSelectedFilling(q)} className="p-4 hover:bg-[#fafbfc] cursor-pointer">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="font-semibold text-[#1a2e35] text-sm">{q.first_name} {q.last_name}</div>
                        <div className="text-xs text-[#9aa5b4] mt-0.5">
                          {formatDate(q.created_at)}
                          {q.reference_id && <span className="ml-2 font-mono font-semibold text-[#8cc7c4]">{q.reference_id}</span>}
                        </div>
                      </div>
                      <StatusDropdown quoteId={q.id} currentStatus={q.status as Status} onChange={s => handleFillingStatus(q.id, s)} onUpdate={updatePoolFillingQuoteStatus} />
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-[#4a5568] mb-2">
                      <button onClick={e => { e.stopPropagation(); setEmailFilling(q) }} className="flex items-center gap-1.5 hover:text-[#8cc7c4] text-[#4a5568] border-none bg-transparent cursor-pointer p-0 text-xs">
                        <Mail size={11} />{q.email}
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#718096]">
                      <div className="flex items-center gap-1"><MapPin size={11} />{q.city}, {q.state}</div>
                      <span>{Number(q.gallons).toLocaleString()} gal</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="hidden md:block">
                <table className="w-full text-sm">
                  <thead className="bg-[#fafbfc] border-b border-[#dde3ea]">
                    <tr className="text-left text-[11px] tracking-[0.1em] uppercase text-[#4a5568] font-bold">
                      <th className="px-4 py-3">Ref</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Gallons</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Received</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filling.map(q => (
                      <tr key={q.id} onClick={() => setSelectedFilling(q)} className="border-b border-[#edf0f4] last:border-0 hover:bg-[#fafbfc] cursor-pointer">
                        <td className="px-4 py-3"><span className="text-xs font-mono font-semibold text-[#8cc7c4]">{q.reference_id ?? '—'}</span></td>
                        <td className="px-4 py-3"><div className="font-semibold text-[#1a2e35]">{q.first_name} {q.last_name}</div></td>
                        <td className="px-4 py-3">
                          <button onClick={e => { e.stopPropagation(); setEmailFilling(q) }} className="flex items-center gap-1.5 hover:text-[#8cc7c4] text-[#4a5568] border-none bg-transparent cursor-pointer p-0 text-xs"><Mail size={12} />{q.email}</button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-start gap-1.5 text-[#4a5568] text-xs">
                            <MapPin size={12} className="mt-0.5 shrink-0" />
                            <div><div>{q.street}</div><div className="text-[#9aa5b4]">{q.city}, {q.state} {q.zip_code}</div></div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><span className="text-xs font-semibold text-[#4a5568]">{Number(q.gallons).toLocaleString()}</span></td>
                        <td className="px-4 py-3"><StatusDropdown quoteId={q.id} currentStatus={q.status as Status} onChange={s => handleFillingStatus(q.id, s)} onUpdate={updatePoolFillingQuoteStatus} /></td>
                        <td className="px-4 py-3 text-[#718096] text-xs whitespace-nowrap">{formatDate(q.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {selectedCare    && <CareDetailPanel    quote={selectedCare}    userRole={userRole} onClose={() => setSelectedCare(null)} />}
      {selectedFilling && <FillingDetailPanel quote={selectedFilling} userRole={userRole} onClose={() => setSelectedFilling(null)} />}

      {emailCare && (
        <EmailModal
          quote={{ ...emailCare, id: emailCare.reference_id ?? emailCare.id }}
          customerName={`${emailCare.first_name} ${emailCare.last_name}`}
          serviceType="Pool Care"
          jobDetails={emailCare.pool_size ? `Pool size: ${emailCare.pool_size} gallons` : 'Pool maintenance service'}
          address={`${emailCare.address}, ${emailCare.city} ${emailCare.zip_code}`}
          onClose={() => setEmailCare(null)}
        />
      )}
      {emailFilling && (
        <EmailModal
          quote={{ ...emailFilling, id: emailFilling.reference_id ?? emailFilling.id }}
          customerName={`${emailFilling.first_name} ${emailFilling.last_name}`}
          serviceType="Water Pool Filling"
          jobDetails={`${Number(emailFilling.gallons).toLocaleString()} gallons`}
          address={`${emailFilling.street}, ${emailFilling.city}, ${emailFilling.state} ${emailFilling.zip_code}`}
          onClose={() => setEmailFilling(null)}
        />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </>
  )
}