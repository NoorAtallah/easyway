'use client'

import { useState, useEffect } from 'react'
import LandscapingQuotesTable from './LandscapingQuotesTable'
import PlumbingQuotesTable from './PlumbingQuotesTable'
import CleaningQuotesTable from './CleaningQuotesTable'
import PoolQuotesTable from './PoolQuotesTable'
import MovingQuotesTable from './Movingquotestable'
import type { PlumbingQuote } from '@/types/plumbing'
import { Plus, Search } from 'lucide-react'
import type { CleaningQuote } from '@/types/cleaning'
import type { LandscapingQuote } from '@/types/landscaping'
import type { PoolCareQuote, PoolFillingQuote } from '@/types/pool'
import type { MovingQuote } from '@/types/moving'
import { NewBookingModal } from './NewBookingModal'
import { createClient } from '@/lib/supabase/client'

type TabId = 'landscaping' | 'moving' | 'cleaning' | 'pool' | 'plumbing'
type Role = 'admin' | 'manager' | 'staff'
type MovingItem = { id: string; name: string; section: string; cuft: number }

const TABS: { id: TabId; label: string }[] = [
  { id: 'landscaping', label: 'Landscaping' },
  { id: 'moving',      label: 'Moving' },
  { id: 'cleaning',    label: 'Cleaning' },
  { id: 'pool',        label: 'Pool Maintenance' },
  { id: 'plumbing',    label: 'Plumbing' },
]

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

export default function BookingsTabs({
  counts: initialCounts,
  landscapingQuotes,
  plumbingQuotes,
  cleaningQuotes = [],
  poolCareQuotes = [],
  poolFillingQuotes = [],
  movingQuotes = [],
  movingItems = [],
  userRole,
}: {
  counts: Record<TabId, number>
  landscapingQuotes: LandscapingQuote[]
  plumbingQuotes: PlumbingQuote[]
  cleaningQuotes: CleaningQuote[]
  poolCareQuotes: PoolCareQuote[]
  poolFillingQuotes: PoolFillingQuote[]
  movingQuotes: MovingQuote[]
  movingItems: MovingItem[]
  userRole: Role
}) {
  const [activeTab, setActiveTab]           = useState<TabId>('landscaping')
  const [counts, setCounts]                 = useState(initialCounts)
  const [search, setSearch]                 = useState('')
  const [showNewBooking, setShowNewBooking] = useState(false)
  const [globalToast, setGlobalToast]       = useState<string | null>(null)

  const [liveLandscaping, setLiveLandscaping] = useState(landscapingQuotes)
  const [livePlumbing, setLivePlumbing]       = useState(plumbingQuotes)
  const [liveCleaning, setLiveCleaning]       = useState(cleaningQuotes)
  const [livePoolCare, setLivePoolCare]       = useState(poolCareQuotes)
  const [livePoolFilling, setLivePoolFilling] = useState(poolFillingQuotes)
  const [liveMoving, setLiveMoving]           = useState(movingQuotes)

  const handleCountChange = (tab: TabId, delta: number) => {
    setCounts(prev => ({ ...prev, [tab]: Math.max(0, prev[tab] + delta) }))
  }

  useEffect(() => {
    const supabase = createClient()

    const channels = [
      supabase.channel('global_landscaping')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'landscaping_quotes' }, payload => {
          const q = payload.new as LandscapingQuote
          setLiveLandscaping(prev => [q, ...prev])
          handleCountChange('landscaping', 1)
          setGlobalToast(`New landscaping quote from ${q.first_name} ${q.last_name}`)
        }).subscribe(),

      supabase.channel('global_plumbing')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'plumbing_quotes' }, payload => {
          const q = payload.new as PlumbingQuote
          setLivePlumbing(prev => [q, ...prev])
          handleCountChange('plumbing', 1)
          setGlobalToast(`New plumbing quote from ${q.first_name} ${q.last_name}`)
        }).subscribe(),

      supabase.channel('global_cleaning')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'cleaning_quotes' }, payload => {
          const q = payload.new as CleaningQuote
          setLiveCleaning(prev => [q, ...prev])
          handleCountChange('cleaning', 1)
          setGlobalToast(`New cleaning booking from ${q.name}`)
        }).subscribe(),

      supabase.channel('global_pool_care')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pool_care_quotes' }, payload => {
          const q = payload.new as PoolCareQuote
          setLivePoolCare(prev => [q, ...prev])
          handleCountChange('pool', 1)
          setGlobalToast(`New pool care quote from ${q.first_name} ${q.last_name}`)
        }).subscribe(),

      supabase.channel('global_pool_filling')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pool_filling_quotes' }, payload => {
          const q = payload.new as PoolFillingQuote
          setLivePoolFilling(prev => [q, ...prev])
          handleCountChange('pool', 1)
          setGlobalToast(`New water filling quote from ${q.first_name} ${q.last_name}`)
        }).subscribe(),

  //     supabase.channel('global_moving')
  // .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'moving_quotes' }, payload => {
  //   const q = payload.new as MovingQuote
  //   setLiveMoving(prev => [q, ...prev])
  //   handleCountChange('moving', 1)
  //   setGlobalToast(`New moving quote from ${q.first_name} ${q.last_name}`)
  // }).subscribe(),
    ]

    return () => { channels.forEach(ch => supabase.removeChannel(ch)) }
  }, [])

  const q = search.trim().toLowerCase()

  const visibleLandscaping = q
    ? liveLandscaping.filter(r =>
        r.reference_id?.toLowerCase().includes(q) ||
        `${r.first_name} ${r.last_name}`.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q)
      )
    : liveLandscaping

  const visiblePlumbing = q
    ? livePlumbing.filter(r =>
        r.reference_id?.toLowerCase().includes(q) ||
        `${r.first_name} ${r.last_name}`.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q)
      )
    : livePlumbing

  const visibleCleaning = q
    ? liveCleaning.filter(r =>
        r.reference_id?.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q)
      )
    : liveCleaning

  const visiblePoolCare = q
    ? livePoolCare.filter(r =>
        r.reference_id?.toLowerCase().includes(q) ||
        `${r.first_name} ${r.last_name}`.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q)
      )
    : livePoolCare

  const visiblePoolFilling = q
    ? livePoolFilling.filter(r =>
        r.reference_id?.toLowerCase().includes(q) ||
        `${r.first_name} ${r.last_name}`.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q)
      )
    : livePoolFilling

  const visibleMoving = q
    ? liveMoving.filter(r =>
        r.reference_id?.toLowerCase().includes(q) ||
        `${r.first_name} ${r.last_name}`.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q)
      )
    : liveMoving

  const activeIsEmpty =
    q && (
      (activeTab === 'landscaping' && visibleLandscaping.length === 0) ||
      (activeTab === 'plumbing'    && visiblePlumbing.length === 0)    ||
      (activeTab === 'cleaning'    && visibleCleaning.length === 0)    ||
      (activeTab === 'moving'      && visibleMoving.length === 0)      ||
      (activeTab === 'pool'        && visiblePoolCare.length === 0 && visiblePoolFilling.length === 0)
    )

  return (
    <div className="p-4 md:p-8 font-['DM_Sans',sans-serif] min-w-0 overflow-hidden">

      {/* Page header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1a2e35] m-0">Bookings</h1>
          <p className="text-sm text-[#718096] mt-1">Quote requests from all service pages.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa5b4] pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by ref, name or email"
              className="pl-8 pr-3 py-2 text-sm border border-[#dde3ea] rounded-lg w-[260px] focus:outline-none focus:border-[#8cc7c4] focus:ring-2 focus:ring-[#8cc7c4]/20 transition placeholder:text-[#c4cdd6]"
            />
          </div>
          <button
            onClick={() => setShowNewBooking(true)}
            className="flex items-center gap-2 bg-[#1a2e35] hover:bg-[#243d47] text-white text-sm font-semibold px-4 py-2 rounded-lg border-none cursor-pointer transition whitespace-nowrap"
          >
            <Plus size={15} /> New booking
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#dde3ea] mb-6 overflow-x-auto scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
        {TABS.map(({ id, label }) => {
          const isActive = activeTab === id
          const count    = counts[id]
          return (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSearch('') }}
              className={`flex items-center gap-2 px-4 py-3 text-sm border-none bg-transparent cursor-pointer whitespace-nowrap transition-colors relative
                ${isActive ? 'text-[#1a2e35] font-semibold' : 'text-[#718096] font-normal hover:text-[#1a2e35]'}`}
            >
              {label}
              {count > 0 && (
                <span className={`text-[11px] font-bold px-1.5 py-[2px] rounded-full min-w-[20px] text-center
                  ${isActive ? 'bg-[#8cc7c4] text-[#1a2e35]' : 'bg-[#edf0f4] text-[#4a5568]'}`}>
                  {count}
                </span>
              )}
              {isActive && <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#8cc7c4]" />}
            </button>
          )
        })}
      </div>

      {/* No results */}
      {activeIsEmpty && (
        <div className="bg-white border border-[#dde3ea] rounded-lg p-8 text-center mb-4">
          <p className="text-[#718096] text-sm">
            No bookings found for <span className="font-semibold text-[#1a2e35]">{search}</span>.
          </p>
        </div>
      )}

      {/* Tab content */}
      {activeTab === 'landscaping' && !activeIsEmpty && (
        <LandscapingQuotesTable key={q || 'default'} quotes={visibleLandscaping} userRole={userRole} onCountChange={d => handleCountChange('landscaping', d)} />
      )}
      {activeTab === 'moving' && !activeIsEmpty && (
        <MovingQuotesTable key={q || 'default'} quotes={visibleMoving} movingItems={movingItems} userRole={userRole} onCountChange={d => handleCountChange('moving', d)} />
      )}
      {activeTab === 'cleaning' && !activeIsEmpty && (
        <CleaningQuotesTable key={q || 'default'} quotes={visibleCleaning} userRole={userRole} onCountChange={d => handleCountChange('cleaning', d)} />
      )}
      {activeTab === 'pool' && !activeIsEmpty && (
        <PoolQuotesTable key={q || 'default'} careQuotes={visiblePoolCare} fillingQuotes={visiblePoolFilling} userRole={userRole} onCountChange={d => handleCountChange('pool', d)} />
      )}
      {activeTab === 'plumbing' && !activeIsEmpty && (
        <PlumbingQuotesTable key={q || 'default'} quotes={visiblePlumbing} userRole={userRole} onCountChange={d => handleCountChange('plumbing', d)} />
      )}

      {showNewBooking && <NewBookingModal onClose={() => setShowNewBooking(false)} />}
      {globalToast && <Toast message={globalToast} onDone={() => setGlobalToast(null)} />}
    </div>
  )
}