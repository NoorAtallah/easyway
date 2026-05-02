'use client'

import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import { Leaf, Truck, Sparkles, Waves, Wrench, TrendingUp, Users, CheckCircle, Clock } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────
type BaseQuote = {
  id: string
  email: string
  status: string
  created_at: string
}

type NamedQuote = BaseQuote & { first_name: string; last_name: string }
type CleaningQuoteRow = BaseQuote & { name: string }

type Props = {
  userName: string
  landscaping: NamedQuote[]
  plumbing: NamedQuote[]
  cleaning: CleaningQuoteRow[]
  poolCare: NamedQuote[]
  poolFilling: NamedQuote[]
  moving: NamedQuote[]
}

// ── Helpers ───────────────────────────────────────────────────
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function getMonthKey(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function getWeekKey(iso: string) {
  const d = new Date(iso)
  const start = new Date(d)
  start.setDate(d.getDate() - d.getDay())
  return start.toISOString().slice(0, 10)
}

const STATUS_PENDING = ['new', 'contacted']
const STATUS_WON = ['won', 'completed', 'confirmed']

const SERVICE_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode; tab: string }> = {
  landscaping: { label: 'Landscaping', color: '#8cc7c4', icon: <Leaf size={12} />, tab: 'landscaping' },
  moving:      { label: 'Moving',      color: '#60a5fa', icon: <Truck size={12} />, tab: 'moving' },
  cleaning:    { label: 'Cleaning',    color: '#fbbf24', icon: <Sparkles size={12} />, tab: 'cleaning' },
  pool:        { label: 'Pool',        color: '#22d3ee', icon: <Waves size={12} />, tab: 'pool' },
  plumbing:    { label: 'Plumbing',    color: '#f97316', icon: <Wrench size={12} />, tab: 'plumbing' },
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

// ── Stat card ─────────────────────────────────────────────────
function StatCard({ label, value, icon, accent, sub }: {
  label: string; value: number; icon: React.ReactNode
  accent: string; sub?: string
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
      {sub && <p className="text-xs text-[#9aa5b4] mt-1">{sub}</p>}
    </div>
  )
}

// ── Recent activity item ──────────────────────────────────────
function ActivityItem({ name, service, status, time }: {
  name: string; service: string; status: string; time: string
}) {
  const cfg = SERVICE_CONFIG[service]
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-[#edf0f4] last:border-0">
      <div className="w-8 h-8 rounded-full bg-[#f4f6f8] flex items-center justify-center shrink-0"
        style={{ color: cfg?.color ?? '#9aa5b4' }}>
        {cfg?.icon ?? <Users size={12} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#1a2e35] truncate">{name}</p>
        <p className="text-xs text-[#9aa5b4]">{cfg?.label ?? service}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className={`text-[10px] font-bold uppercase tracking-[0.5px] px-2 py-[2px] rounded-full ${STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-500'}`}>
          {status}
        </span>
        <span className="text-[11px] text-[#9aa5b4]">{time}</span>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function AdminOverview({
  userName, landscaping, plumbing, cleaning, poolCare, poolFilling, moving,
}: Props) {

  const allQuotes = useMemo(() => [
    ...landscaping.map(q => ({ ...q, service: 'landscaping', name: `${q.first_name} ${q.last_name}` })),
    ...plumbing.map(q => ({ ...q, service: 'plumbing', name: `${q.first_name} ${q.last_name}` })),
    ...cleaning.map(q => ({ ...q, service: 'cleaning', name: q.name })),
    ...poolCare.map(q => ({ ...q, service: 'pool', name: `${q.first_name} ${q.last_name}` })),
    ...poolFilling.map(q => ({ ...q, service: 'pool', name: `${q.first_name} ${q.last_name}` })),
    ...moving.map(q => ({ ...q, service: 'moving', name: `${q.first_name} ${q.last_name}` })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()), [
    landscaping, plumbing, cleaning, poolCare, poolFilling, moving
  ])

  // Stats
  const total = allQuotes.length
  const pending = allQuotes.filter(q => STATUS_PENDING.includes(q.status)).length
  const won = allQuotes.filter(q => STATUS_WON.includes(q.status)).length
  const uniqueCustomers = new Set(allQuotes.map(q => q.email.toLowerCase())).size

  // By service chart
  const byService = useMemo(() => [
    { name: 'Landscaping', count: landscaping.length, fill: '#8cc7c4' },
    { name: 'Moving',      count: moving.length,      fill: '#60a5fa' },
    { name: 'Cleaning',    count: cleaning.length,    fill: '#fbbf24' },
    { name: 'Pool',        count: poolCare.length + poolFilling.length, fill: '#22d3ee' },
    { name: 'Plumbing',    count: plumbing.length,    fill: '#f97316' },
  ], [landscaping, moving, cleaning, poolCare, poolFilling, plumbing])

  // Last 8 weeks trend
  const weeklyTrend = useMemo(() => {
    const weeks: Record<string, number> = {}
    const now = new Date()
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i * 7)
      const key = getWeekKey(d.toISOString())
      weeks[key] = 0
    }
    allQuotes.forEach(q => {
      const key = getWeekKey(q.created_at)
      if (key in weeks) weeks[key]++
    })
    return Object.entries(weeks).map(([week, count]) => ({
      week: new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count,
    }))
  }, [allQuotes])

  // This month vs last month
  const now = new Date()
  const thisMonth = getMonthKey(now.toISOString())
  const lastMonthDate = new Date(now)
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
  const lastMonth = getMonthKey(lastMonthDate.toISOString())
  const thisMonthCount = allQuotes.filter(q => getMonthKey(q.created_at) === thisMonth).length
  const lastMonthCount = allQuotes.filter(q => getMonthKey(q.created_at) === lastMonth).length
  const monthDelta = lastMonthCount > 0 ? Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100) : null

  // Recent 8
  const recent = allQuotes.slice(0, 8)

  return (
    <div className="font-['DM_Sans',sans-serif]">
      {/* Header */}
      <div className="mb-7">
        <h1 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1a2e35] m-0">Dashboard</h1>
        <p className="text-sm text-[#718096] mt-1">Welcome back, {userName}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Bookings" value={total}
          icon={<TrendingUp size={16} />} accent="border-t-[#8cc7c4]"
          sub={monthDelta !== null ? `${monthDelta >= 0 ? '+' : ''}${monthDelta}% vs last month` : undefined}
        />
        <StatCard
          label="Pending" value={pending}
          icon={<Clock size={16} />} accent="border-t-amber-400"
          sub={`${total > 0 ? Math.round((pending / total) * 100) : 0}% of total`}
        />
        <StatCard
          label="Won" value={won}
          icon={<CheckCircle size={16} />} accent="border-t-emerald-500"
          sub={`${total > 0 ? Math.round((won / total) * 100) : 0}% conversion`}
        />
        <StatCard
          label="Customers" value={uniqueCustomers}
          icon={<Users size={16} />} accent="border-t-indigo-400"
          sub="Unique emails"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

        {/* Bookings by service */}
        <div className="bg-white border border-[#dde3ea] rounded-xl p-5">
          <h2 className="text-sm font-bold text-[#1a2e35] mb-4">Bookings by service</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byService} barSize={32}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9aa5b4' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9aa5b4' }} axisLine={false} tickLine={false} width={24} />
              <Tooltip
                contentStyle={{ border: '1px solid #dde3ea', borderRadius: 8, fontSize: 12 }}
                cursor={{ fill: '#f4f6f8' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {byService.map((entry, i) => (
                  <rect key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly trend */}
        <div className="bg-white border border-[#dde3ea] rounded-xl p-5">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-sm font-bold text-[#1a2e35]">Weekly trend</h2>
            <div className="text-right">
              <p className="text-xs text-[#9aa5b4]">This month</p>
              <p className="text-lg font-bold text-[#1a2e35]">{thisMonthCount}
                {monthDelta !== null && (
                  <span className={`text-xs font-medium ml-1.5 ${monthDelta >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                    {monthDelta >= 0 ? '+' : ''}{monthDelta}%
                  </span>
                )}
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#edf0f4" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9aa5b4' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9aa5b4' }} axisLine={false} tickLine={false} width={24} allowDecimals={false} />
              <Tooltip
                contentStyle={{ border: '1px solid #dde3ea', borderRadius: 8, fontSize: 12 }}
                cursor={{ stroke: '#dde3ea' }}
              />
              <Line
                type="monotone" dataKey="count" stroke="#8cc7c4"
                strokeWidth={2} dot={{ fill: '#8cc7c4', r: 3 }} activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent activity */}
        <div className="bg-white border border-[#dde3ea] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#1a2e35]">Recent activity</h2>
            <a href="/admin/bookings" className="text-xs text-[#8cc7c4] font-medium hover:text-[#1a2e35] no-underline transition-colors">
              View all →
            </a>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-[#9aa5b4] text-center py-8">No bookings yet.</p>
          ) : (
            recent.map(q => (
              <ActivityItem
                key={q.id}
                name={q.name}
                service={q.service}
                status={q.status}
                time={timeAgo(q.created_at)}
              />
            ))
          )}
        </div>

        {/* Service breakdown */}
        <div className="bg-white border border-[#dde3ea] rounded-xl p-5">
          <h2 className="text-sm font-bold text-[#1a2e35] mb-4">Status breakdown</h2>
          <div className="flex flex-col gap-3">
            {byService.map(({ name, count, fill }) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0
              return (
                <div key={name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-[#4a5568]">{name}</span>
                    <span className="text-xs text-[#9aa5b4]">{count} · {pct}%</span>
                  </div>
                  <div className="h-1.5 bg-[#f4f6f8] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: fill }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Won vs Pending summary */}
          <div className="mt-5 pt-4 border-t border-[#edf0f4] grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Won', value: won, color: 'text-emerald-600' },
              { label: 'Pending', value: pending, color: 'text-amber-500' },
              { label: 'Lost', value: allQuotes.filter(q => q.status === 'lost').length, color: 'text-gray-400' },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-[#9aa5b4]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}