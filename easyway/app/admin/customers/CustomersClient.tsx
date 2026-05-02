'use client'

import { useMemo, useState } from 'react'
import { Search, ChevronDown, ChevronUp, Leaf, Truck, Sparkles, Waves, Wrench, Users, Mail, Phone, Calendar } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────
type QuoteRow = {
  id: string
  reference_id: string | null
  email: string
  phone?: string | null
  status: string
  created_at: string
  name?: string
  first_name?: string
  last_name?: string
  service: string
}

type Customer = {
  email: string
  name: string
  phone: string
  services: string[]
  quotes: QuoteRow[]
  firstSeen: string
  lastSeen: string
}

type Props = {
  landscaping: any[]
  plumbing: any[]
  cleaning: any[]
  poolCare: any[]
  poolFilling: any[]
  moving: any[]
}

// ── Config ────────────────────────────────────────────────────
const SERVICE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  landscaping: { label: 'Landscaping', color: '#1a7a6e', bg: '#e0f4f2', icon: <Leaf size={10} /> },
  moving:      { label: 'Moving',      color: '#1d4ed8', bg: '#dbeafe', icon: <Truck size={10} /> },
  cleaning:    { label: 'Cleaning',    color: '#92400e', bg: '#fef3c7', icon: <Sparkles size={10} /> },
  pool:        { label: 'Pool',        color: '#0e7490', bg: '#cffafe', icon: <Waves size={10} /> },
  plumbing:    { label: 'Plumbing',    color: '#9a3412', bg: '#ffedd5', icon: <Wrench size={10} /> },
}

const STATUS_COLORS: Record<string, string> = {
  new:       'bg-[#8cc7c4]/20 text-[#1a2e35]',
  contacted: 'bg-blue-100 text-blue-700',
  quoted:    'bg-amber-100 text-amber-700',
  won:       'bg-green-100 text-green-700',
  completed: 'bg-green-100 text-green-700',
  confirmed: 'bg-purple-100 text-purple-700',
  lost:      'bg-gray-100 text-gray-500',
}

// ── Helpers ───────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function ServiceBadge({ service }: { service: string }) {
  const cfg = SERVICE_CONFIG[service]
  if (!cfg) return null
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-[3px] rounded-full"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}>
      {cfg.icon} {cfg.label}
    </span>
  )
}

// ── Stat card ─────────────────────────────────────────────────
function StatCard({ label, value, icon, accent }: {
  label: string; value: number; icon: React.ReactNode; accent: string
}) {
  return (
    <div className={`bg-white rounded-xl border-t-4 ${accent} border border-[#dde3ea] p-5`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#718096]">{label}</p>
        <div className="w-8 h-8 rounded-lg bg-[#f4f6f8] flex items-center justify-center text-[#4a5568]">
          {icon}
        </div>
      </div>
      <p className="font-['Playfair_Display',serif] text-4xl font-bold text-[#1a2e35]">{value.toLocaleString()}</p>
    </div>
  )
}

// ── Customer row ──────────────────────────────────────────────
function CustomerRow({ customer }: { customer: Customer }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border-b border-[#edf0f4] last:border-0">
      {/* Main row */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="grid grid-cols-[1fr_auto] md:grid-cols-[2fr_1.5fr_1fr_auto] gap-4 items-center px-5 py-4 hover:bg-[#fafbfc] cursor-pointer transition-colors"
      >
        {/* Name + email */}
        <div className="min-w-0">
          <p className="font-semibold text-[#1a2e35] text-sm truncate">{customer.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Mail size={11} className="text-[#9aa5b4] shrink-0" />
            <p className="text-xs text-[#718096] truncate">{customer.email}</p>
          </div>
          {customer.phone && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <Phone size={11} className="text-[#9aa5b4] shrink-0" />
              <p className="text-xs text-[#9aa5b4]">{customer.phone}</p>
            </div>
          )}
        </div>

        {/* Services */}
        <div className="hidden md:flex flex-wrap gap-1">
          {customer.services.map(s => <ServiceBadge key={s} service={s} />)}
        </div>

        {/* Stats */}
        <div className="hidden md:flex flex-col gap-0.5">
          <p className="text-xs font-semibold text-[#1a2e35]">{customer.quotes.length} quote{customer.quotes.length !== 1 ? 's' : ''}</p>
          <div className="flex items-center gap-1 text-[#9aa5b4]">
            <Calendar size={10} />
            <p className="text-[11px]">{formatDate(customer.firstSeen)}</p>
          </div>
        </div>

        {/* Expand */}
        <div className="flex items-center gap-2">
          {/* Mobile service badges */}
          <div className="flex md:hidden flex-wrap gap-1">
            {customer.services.map(s => <ServiceBadge key={s} service={s} />)}
          </div>
          {expanded
            ? <ChevronUp size={16} className="text-[#9aa5b4] shrink-0" />
            : <ChevronDown size={16} className="text-[#9aa5b4] shrink-0" />
          }
        </div>
      </div>

      {/* Expanded quotes */}
      {expanded && (
        <div className="bg-[#fafbfc] border-t border-[#edf0f4] px-5 py-3">
          <p className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#9aa5b4] mb-2">Quote history</p>
          <div className="flex flex-col gap-2">
            {customer.quotes.map(q => (
              <div key={q.id} className="flex items-center gap-3 bg-white border border-[#edf0f4] rounded-lg px-3 py-2.5">
                <ServiceBadge service={q.service} />
                {q.reference_id && (
                  <span className="text-xs font-mono font-semibold text-[#8cc7c4]">{q.reference_id}</span>
                )}
                <span className={`text-[10px] font-bold uppercase tracking-[0.5px] px-2 py-[2px] rounded-full ${STATUS_COLORS[q.status] ?? 'bg-gray-100 text-gray-500'}`}>
                  {q.status}
                </span>
                <span className="text-xs text-[#9aa5b4] ml-auto">{formatDate(q.created_at)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────
export default function CustomersClient({
  landscaping, plumbing, cleaning, poolCare, poolFilling, moving,
}: Props) {

  const [search, setSearch] = useState('')

  // Normalize all quotes into one shape
  const allQuotes: QuoteRow[] = useMemo(() => [
    ...landscaping.map(q => ({ ...q, service: 'landscaping', name: `${q.first_name} ${q.last_name}` })),
    ...plumbing.map(q => ({ ...q, service: 'plumbing', name: `${q.first_name} ${q.last_name}` })),
    ...cleaning.map(q => ({ ...q, service: 'cleaning' })),
    ...poolCare.map(q => ({ ...q, service: 'pool', name: `${q.first_name} ${q.last_name}` })),
    ...poolFilling.map(q => ({ ...q, service: 'pool', name: `${q.first_name} ${q.last_name}` })),
    ...moving.map(q => ({ ...q, service: 'moving', name: `${q.first_name} ${q.last_name}` })),
  ], [landscaping, plumbing, cleaning, poolCare, poolFilling, moving])

  // Build customer map by email
  const customers: Customer[] = useMemo(() => {
    const map = new Map<string, Customer>()

    for (const q of allQuotes) {
      const email = q.email.toLowerCase().trim()
      const name = q.name ?? `${q.first_name ?? ''} ${q.last_name ?? ''}`.trim()
      const phone = q.phone ?? ''

      if (!map.has(email)) {
        map.set(email, {
          email,
          name,
          phone,
          services: [],
          quotes: [],
          firstSeen: q.created_at,
          lastSeen: q.created_at,
        })
      }

      const customer = map.get(email)!
      customer.quotes.push(q)

      if (!customer.services.includes(q.service)) {
        customer.services.push(q.service)
      }

      if (new Date(q.created_at) < new Date(customer.firstSeen)) {
        customer.firstSeen = q.created_at
      }
      if (new Date(q.created_at) > new Date(customer.lastSeen)) {
        customer.lastSeen = q.created_at
      }

      // Use most recent name/phone
      if (new Date(q.created_at) > new Date(customer.lastSeen)) {
        if (name) customer.name = name
        if (phone) customer.phone = phone
      }
    }

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
    )
  }, [allQuotes])

  // Stats
  const thisMonth = new Date()
  thisMonth.setDate(1)
  thisMonth.setHours(0, 0, 0, 0)

  const newThisMonth = customers.filter(c => new Date(c.firstSeen) >= thisMonth).length
  const multiService = customers.filter(c => c.services.length > 1).length

  // Search
  const q = search.trim().toLowerCase()
  const visible = q
    ? customers.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone?.includes(q)
      )
    : customers

  return (
    <div className="font-['DM_Sans',sans-serif]">
      {/* Header */}
      <div className="mb-7">
        <h1 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1a2e35] m-0 mt-10">Customers</h1>
        <p className="text-sm text-[#718096] mt-1">All unique customers across every service.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total customers" value={customers.length}
          icon={<Users size={16} />} accent="border-t-indigo-400"
        />
        <StatCard
          label="New this month" value={newThisMonth}
          icon={<Calendar size={16} />} accent="border-t-[#8cc7c4]"
        />
        <StatCard
          label="Multi-service" value={multiService}
          icon={<Sparkles size={16} />} accent="border-t-amber-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-[#dde3ea] rounded-xl overflow-hidden">
        {/* Search bar */}
        <div className="px-5 py-3.5 border-b border-[#dde3ea] flex items-center gap-3">
          <div className="relative flex-1 max-w-[320px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa5b4] pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email or phone"
              className="w-full pl-8 pr-3 py-2 text-sm border border-[#dde3ea] rounded-lg focus:outline-none focus:border-[#8cc7c4] focus:ring-2 focus:ring-[#8cc7c4]/20 transition placeholder:text-[#c4cdd6]"
            />
          </div>
          <p className="text-xs text-[#9aa5b4] ml-auto">{visible.length} customer{visible.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Table header — desktop */}
        <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_auto] gap-4 px-5 py-2.5 bg-[#fafbfc] border-b border-[#dde3ea] text-[10px] uppercase tracking-[0.1em] text-[#9aa5b4] font-bold">
          <span>Customer</span>
          <span>Services</span>
          <span>Activity</span>
          <span />
        </div>

        {/* Rows */}
        {visible.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-[#9aa5b4]">
              {search ? `No customers found for "${search}"` : 'No customers yet.'}
            </p>
          </div>
        ) : (
          visible.map(customer => (
            <CustomerRow key={customer.email} customer={customer} />
          ))
        )}
      </div>
    </div>
  )
}