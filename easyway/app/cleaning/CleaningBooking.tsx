'use client'

import { useState, useEffect } from 'react'
import {
  ArrowRight, ChevronLeft, Plus, Minus, Check,
  MapPin, User, Mail, Phone, FileText, CheckCircle,
  ShieldCheck, Star, Clock, Sparkles, Upload,
} from 'lucide-react'
import { submitCleaningQuote } from './actions'

// ── Types ──────────────────────────────────────────────────────────────────
type DbItem = {
  id: string; key: string; label: string; description: string
  price: number; sort_order: number; is_active: boolean
}
type DbStep = {
  id: string; type: string; title: string; sub: string
  field: string | null; sort_order: number; is_active: boolean
  cleaning_step_items: DbItem[]
}
type DbService = {
  id: string; key: string; name: string; description: string
  image_url: string; flow_type: 'wizard' | 'quote'; is_active: boolean
  steps: DbStep[]
}

type StepItem = { key: string; label: string; desc?: string; price: number }
type LineItem  = { key: string; label: string; qty: number; price: number }

interface BookingState {
  service: DbService | null
  stepIdx: number
  lines: Record<string, LineItem>
  selected: Record<string, string>
  date: string; time: string; address: string
  accessNotes: string; focusAreas: string
  name: string; phone: string; email: string
  smsOptIn: boolean; coupon: string; submitted: boolean
  loading: boolean; error: string | null
}

const INIT: BookingState = {
  service: null, stepIdx: 0, lines: {}, selected: {},
  date: '', time: '', address: '',
  accessNotes: '', focusAreas: '',
  name: '', phone: '', email: '',
  smsOptIn: true, coupon: '', submitted: false,
  loading: false, error: null,
}

// ── Helpers ────────────────────────────────────────────────────────────────
function useIsMobile(breakpoint = 640) {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < breakpoint)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])
  return mobile
}

function dbItemToStepItem(item: DbItem): StepItem {
  return { key: item.key, label: item.label, desc: item.description || undefined, price: item.price }
}

// ── Field ──────────────────────────────────────────────────────────────────
function Field({ icon, label, name, value, onChange, placeholder = '', type = 'text' }: {
  icon: React.ReactNode; label: string; name: string; value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string; type?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa5b4] pointer-events-none flex">{icon}</span>
        <input
          type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
          className="w-full pl-9 pr-3 py-[11px] bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-[#1a202c] text-sm font-['DM_Sans',sans-serif] outline-none transition-colors duration-150 focus:border-[#8cc7c4] box-border"
        />
      </div>
    </div>
  )
}

// ── Trust bar ──────────────────────────────────────────────────────────────
function TrustBar({ mobile }: { mobile: boolean }) {
  return (
    <div className={`bg-[#152830] flex gap-3 flex-wrap ${mobile ? 'px-4 py-2.5' : 'px-[52px] py-[10px]'}`}>
      {['Licensed & insured', '4.9 stars · 3,000+ reviews', 'Vetted & background-checked', 'Same-day available'].map(t => (
        <div key={t} className="flex items-center gap-[7px] text-xs text-[rgba(255,246,246,0.7)] font-medium">
          <div className="w-[5px] h-[5px] bg-[#8cc7c4] rounded-full shrink-0" />
          {t}
        </div>
      ))}
    </div>
  )
}

function MobileOrderBar({ svcName, total }: { svcName: string; total: number }) {
  return (
    <div className="bg-[#fafbfc] border-b border-[#edf0f4] px-4 py-3 flex justify-between items-center">
      <span className="text-[13px] font-semibold text-[#1a2e35]">{svcName}</span>
      <span className="text-base font-extrabold text-[#8cc7c4]">{total > 0 ? `$${total}` : '—'}</span>
    </div>
  )
}

// ── Step content ───────────────────────────────────────────────────────────
function StepContent({ step, st, mobile, bookedSlots, onIncr, onDecr, onSelectOne, onUpd }: {
  step: DbStep; st: BookingState; mobile: boolean
  bookedSlots: string[]
  onIncr: (item: StepItem) => void
  onDecr: (key: string) => void
  onSelectOne: (item: StepItem, groupKeys: string[]) => void
  onUpd: <K extends keyof BookingState>(key: K, val: BookingState[K]) => void
}) {
  const lines = st.lines
  const items = step.cleaning_step_items.map(dbItemToStepItem)

  if (step.type === 'counter') return (
    <>
      {step.sub && <p className="text-[13px] text-[#718096] mb-4 leading-relaxed">{step.sub}</p>}
      <div className="border border-[#edf0f4] rounded-md overflow-hidden">
        {items.map((item, i) => {
          const qty = lines[item.key]?.qty ?? 0
          return (
            <div
              key={item.key}
              className={`flex items-center justify-between ${mobile ? 'px-3 py-3' : 'px-4 py-[13px]'} ${i < items.length - 1 ? 'border-b border-[#edf0f4]' : ''} ${qty > 0 ? 'bg-[rgba(140,199,196,0.04)]' : 'bg-white'}`}
            >
              <div className="flex-1 pr-3 min-w-0">
                <div className={`${mobile ? 'text-[13px]' : 'text-sm'} ${qty > 0 ? 'font-semibold text-[#1a2e35]' : 'text-[#4a5568]'}`}>{item.label}</div>
                {item.desc && <div className="text-[11px] text-[#9aa5b4] mt-0.5">{item.desc}</div>}
                {item.price > 0 && <div className="text-[11px] text-[#8cc7c4] mt-0.5">${item.price} per item</div>}
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                {qty > 0 && (
                  <button onClick={() => onDecr(item.key)} className="w-7 h-7 rounded-full border-[1.5px] border-[#dde3ea] bg-white cursor-pointer flex items-center justify-center text-[#718096]">
                    <Minus size={12} />
                  </button>
                )}
                {qty > 0 && <span className="text-sm font-bold text-[#1a2e35] min-w-[16px] text-center">{qty}</span>}
                <button
                  onClick={() => onIncr(item)}
                  className={`w-7 h-7 rounded-full border-[1.5px] cursor-pointer flex items-center justify-center shrink-0 ${qty > 0 ? 'border-[#8cc7c4] bg-[rgba(140,199,196,0.12)] text-[#1a2e35]' : 'border-[#dde3ea] bg-white text-[#718096]'}`}
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )

  if (step.type === 'select') {
    const groupKeys = items.map(i => i.key)
    const groupId = groupKeys[0]
    const selKey = st.selected?.[groupId] ?? groupKeys.find(k => (lines[k]?.qty ?? 0) > 0) ?? ''
    return (
      <>
        {step.sub && <p className="text-[13px] text-[#718096] mb-4 leading-relaxed">{step.sub}</p>}
        <div className="border border-[#edf0f4] rounded-md overflow-hidden">
          {items.map((item, i) => {
            const sel = selKey === item.key
            return (
              <button
                key={item.key}
                onClick={() => onSelectOne(item, groupKeys)}
                className={`flex items-center justify-between w-full text-left ${mobile ? 'px-3 py-[13px]' : 'px-4 py-3.5'} ${i < items.length - 1 ? 'border-b border-[#edf0f4]' : ''} border-t-0 border-r-0 cursor-pointer font-['DM_Sans',sans-serif] transition-[background,border-color] duration-150 ${sel ? 'bg-[rgba(140,199,196,0.06)] border-l-[3px] border-l-[#8cc7c4]' : 'bg-white border-l-[3px] border-l-transparent'}`}
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className={`${mobile ? 'text-[13px]' : 'text-sm'} ${sel ? 'font-semibold text-[#1a2e35]' : 'text-[#4a5568]'}`}>{item.label}</div>
                  {item.desc && <div className="text-[11px] text-[#9aa5b4] mt-[3px] leading-snug">{item.desc}</div>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {item.price > 0 && <span className="text-[13px] text-[#8cc7c4] font-semibold">+${item.price}</span>}
                  {sel && (
                    <div className="w-5 h-5 rounded-full bg-[#8cc7c4] flex items-center justify-center shrink-0">
                      <Check size={11} color="#1a2e35" strokeWidth={2.5} />
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </>
    )
  }

  if (step.type === 'textarea') {
    const fieldKey = (step.field ?? 'accessNotes') as keyof BookingState
    const val = (st[fieldKey] as string) ?? ''
    return (
      <>
        {step.sub && <p className="text-[13px] text-[#718096] mb-4 leading-relaxed">{step.sub}</p>}
        <div className="relative">
          <FileText size={15} className="absolute left-3 top-3 text-[#9aa5b4] pointer-events-none" />
          <textarea
            rows={5} placeholder="Type here..." value={val}
            onChange={e => onUpd(fieldKey, e.target.value as any)}
            className="w-full pl-9 pr-3 py-[11px] bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-[#1a202c] text-sm font-['DM_Sans',sans-serif] outline-none resize-y leading-relaxed box-border focus:border-[#8cc7c4] transition-colors duration-150"
          />
        </div>
      </>
    )
  }

  if (step.type === 'photo') return (
    <>
      <p className="text-[13px] text-[#718096] mb-4 leading-relaxed">Upload photos of stains, damage, or specialty items.</p>
      <div className={`border-[1.5px] border-dashed border-[#dde3ea] rounded-md text-center cursor-pointer bg-[#fafbfc] transition-[border-color] duration-150 hover:border-[#8cc7c4] ${mobile ? 'px-4 py-8' : 'px-6 py-11'}`}>
        <Upload size={26} color="#8cc7c4" strokeWidth={1.5} className="mx-auto mb-2.5" />
        <p className="text-sm text-[#4a5568] m-0 mb-1">Click to upload or drag & drop</p>
        <p className="text-xs text-[#9aa5b4] m-0">PNG, JPG, HEIC up to 20MB each</p>
      </div>
    </>
  )

  if (step.type === 'datetime') {
  const days: { short: string; num: number; mon: string; date: string }[] = []
  const DAY = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const today = new Date()
  for (let i = 1; i <= 14; i++) {  // show 14 days instead of 7
    const d = new Date(today); d.setDate(today.getDate() + i)
    days.push({
      short: DAY[d.getDay()], num: d.getDate(),
      mon: MON[d.getMonth()], date: d.toISOString().split('T')[0]
    })
  }
  const times = [
    '9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
    '12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM',
    '3:00 PM','3:30 PM','4:00 PM',
  ]

  return (
    <>
      <p className="text-[13px] text-[#718096] mb-4 leading-relaxed">
        Pick a date and arrival time. Greyed out slots are already booked.
      </p>

      {/* Date picker */}
      <div className={`flex gap-[7px] mb-4 ${mobile ? 'overflow-x-auto pb-1' : ''}`}>
        {days.map(d => {
          const active = st.date === d.date
          // Check if entire day is fully booked (all 15 slots taken)
          const dayBookedCount = times.filter(t =>
            bookedSlots.includes(`${d.date}__${t}`)
          ).length
          const fullyBooked = dayBookedCount === times.length

          return (
            <button
              key={d.date}
              onClick={() => !fullyBooked && onUpd('date', d.date)}
              disabled={fullyBooked}
              className={`flex flex-col items-center px-2.5 py-[9px] rounded-md min-w-[50px] shrink-0 border-[1.5px] font-['DM_Sans',sans-serif] transition-all duration-150 ${
                fullyBooked
                  ? 'border-[#edf0f4] bg-[#fafbfc] opacity-40 cursor-not-allowed'
                  : active
                  ? 'border-[#8cc7c4] bg-[rgba(140,199,196,0.08)] cursor-pointer'
                  : 'border-[#dde3ea] bg-white cursor-pointer'
              }`}
            >
              <span className="text-[10px] font-medium text-[#9aa5b4]">{d.short}</span>
              <span className={`text-[15px] font-bold mt-0.5 ${active ? 'text-[#1a2e35]' : 'text-[#2d3748]'}`}>
                {d.num}
              </span>
              <span className="text-[10px] text-[#9aa5b4] mt-px">{d.mon}</span>
            </button>
          )
        })}
      </div>

      {/* Time picker */}
      {st.date && (
        <div className={`grid gap-[7px] ${mobile ? 'grid-cols-3' : 'grid-cols-4'}`}>
          {times.map(t => {
            const active = st.time === t
            const booked = bookedSlots.includes(`${st.date}__${t}`)
            return (
              <button
                key={t}
                onClick={() => !booked && onUpd('time', t)}
                disabled={booked}
                title={booked ? 'Already booked' : undefined}
                className={`py-[9px] px-1 rounded text-center text-xs font-medium border-[1.5px] font-['DM_Sans',sans-serif] transition-all duration-150 relative ${
                  booked
                    ? 'border-[#edf0f4] bg-[#fafbfc] text-[#c4c9d4] cursor-not-allowed line-through'
                    : active
                    ? 'border-[#8cc7c4] bg-[rgba(140,199,196,0.08)] text-[#1a2e35] cursor-pointer'
                    : 'border-[#dde3ea] bg-white text-[#4a5568] cursor-pointer'
                }`}
              >
                {t}
              </button>
            )
          })}
        </div>
      )}

      {!st.date && (
        <p className="text-xs text-[#9aa5b4] mt-2">Select a date to see available times.</p>
      )}
    </>
  )
}

  if (step.type === 'address') return (
    <>
      <p className="text-[13px] text-[#718096] mb-4 leading-relaxed">Where should we send the team?</p>
      <Field icon={<MapPin size={15} />} label="Service address" name="address" value={st.address} onChange={e => onUpd('address', e.target.value)} placeholder="123 Main St, Chicago, IL 60601" />
    </>
  )

  if (step.type === 'contact') return (
    <>
      <p className="text-[13px] text-[#718096] mb-4 leading-relaxed">We'll use these to confirm your booking.</p>
      <div className="flex flex-col gap-3.5">
        <Field icon={<User size={15} />} label="Full name" name="name" value={st.name} onChange={e => onUpd('name', e.target.value)} placeholder="Jane Smith" />
        <div className={`grid gap-3.5 ${mobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
          <Field icon={<Phone size={15} />} label="Phone number" name="phone" value={st.phone} onChange={e => onUpd('phone', e.target.value)} placeholder="(773) 000-0000" />
          <Field icon={<Mail size={15} />} label="Email address" name="email" value={st.email} onChange={e => onUpd('email', e.target.value)} placeholder="you@example.com" type="email" />
        </div>
        <label className="flex items-start gap-[9px] cursor-pointer">
          <input type="checkbox" checked={st.smsOptIn} onChange={e => onUpd('smsOptIn', e.target.checked)} className="w-[15px] h-[15px] mt-0.5 shrink-0 accent-[#8cc7c4]" />
          <span className="text-[13px] text-[#718096] leading-relaxed">Send me notifications about this appointment via text message</span>
        </label>
        <Field icon={<Sparkles size={15} />} label="Coupon code (optional)" name="coupon" value={st.coupon} onChange={e => onUpd('coupon', e.target.value)} placeholder="Enter code" />
        {st.error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2">{st.error}</p>
        )}
        <hr className="border-none border-t border-[#edf0f4] my-1" />
        <button
          onClick={async () => {
            onUpd('loading', true)
            onUpd('error', null)
            const lines = Object.values(st.lines).filter(l => l.qty > 0)
            const total = lines.reduce((s, l) => s + l.qty * l.price, 0)
            const result = await submitCleaningQuote({
              serviceId: st.service!.id,
              serviceKey: st.service!.key,
              serviceName: st.service!.name,
              lineItems: lines,
              total,
              date: st.date,
              time: st.time,
              address: st.address,
              accessNotes: st.accessNotes,
              focusAreas: st.focusAreas,
              name: st.name,
              phone: st.phone,
              email: st.email,
              smsOptIn: st.smsOptIn,
              coupon: st.coupon,
            })
            onUpd('loading', false)
            if (result.success) {
              onUpd('submitted', true)
            } else {
              onUpd('error', result.error ?? 'Something went wrong')
            }
          }}
          disabled={st.loading}
          className="flex items-center justify-center gap-2 w-full py-[15px] px-8 bg-[#8cc7c4] hover:bg-[#6fb8b4] border-none rounded text-[#1a2e35] text-[15px] font-extrabold tracking-[0.03em] font-['DM_Sans',sans-serif] cursor-pointer transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {st.loading ? 'Submitting...' : <> Book Now <ArrowRight size={15} /> </>}
        </button>
        <p className="text-xs text-[#9aa5b4] text-center leading-relaxed">
          You'll receive confirmation by email. No charge until the job is confirmed.
        </p>
      </div>
    </>
  )

  return null
}

// ── Main component ─────────────────────────────────────────────────────────
export default function CleaningBooking({
  services,
  bookedSlots,
}: {
  services: DbService[]
  bookedSlots: string[]  // ['2026-04-28__10:00 AM', ...]
}) {
  const mobile = useIsMobile(680)
  const [st, setSt] = useState<BookingState>(INIT)

  function upd<K extends keyof BookingState>(key: K, val: BookingState[K]) {
    setSt(p => ({ ...p, [key]: val }))
  }

  const steps = st.service?.steps ?? []
  const curStep = steps[st.stepIdx]
  const total = Object.values(st.lines).reduce((s, l) => s + l.qty * l.price, 0)
  const lines = Object.values(st.lines).filter(l => l.qty > 0)

  function incr(item: StepItem) {
    setSt(p => {
      const cur = p.lines[item.key] ?? { ...item, qty: 0 }
      return { ...p, lines: { ...p.lines, [item.key]: { ...cur, qty: cur.qty + 1 } } }
    })
  }

  function decr(key: string) {
    setSt(p => {
      const cur = p.lines[key]; if (!cur || cur.qty <= 0) return p
      const next = { ...p.lines }
      cur.qty === 1 ? delete next[key] : (next[key] = { ...cur, qty: cur.qty - 1 })
      return { ...p, lines: next }
    })
  }

  function selectOne(item: StepItem, groupKeys: string[]) {
    const groupId = groupKeys[0]
    setSt(p => {
      const nextLines = { ...p.lines }
      groupKeys.forEach(k => delete nextLines[k])
      if (item.price > 0) nextLines[item.key] = { ...item, qty: 1 }
      return { ...p, lines: nextLines, selected: { ...p.selected, [groupId]: item.key } }
    })
  }

  // ── Service selection ──────────────────────────────────────────────────
  if (!st.service) return (
    <main className="min-h-screen bg-[#f4f6f8] font-['DM_Sans',sans-serif] pt-[72px]">
      <div className={`bg-[#1a2e35] border-b-[3px] border-[#8cc7c4] relative overflow-hidden ${mobile ? 'px-5 pt-9 pb-10' : 'px-[52px] pt-14 pb-14'}`}>
        {!mobile && <>
          <div className="absolute right-20 top-10 w-[220px] h-[220px] rounded-full border border-[rgba(140,199,196,0.1)] pointer-events-none" />
          <div className="absolute right-10 top-0 w-[320px] h-[320px] rounded-full border border-[rgba(140,199,196,0.06)] pointer-events-none" />
        </>}
        <p className="text-[11px] tracking-[0.2em] uppercase text-[#8cc7c4] font-semibold mb-3.5">Cleaning Services</p>
        <h1 className="font-['Playfair_Display',Georgia,serif] text-[clamp(2rem,4.5vw,3.4rem)] font-extrabold text-[#FFF6F6] leading-[1.1] tracking-[-0.03em] m-0">
          Clean Home,{' '}<em className="italic text-[#8cc7c4]">Effortlessly.</em>
        </h1>
        <p className="mt-3.5 text-sm text-[rgba(255,246,246,0.6)] max-w-[460px] leading-[1.7]">
          Choose your service, configure the details, and get an instant price. No surprises.
        </p>
      </div>
      <TrustBar mobile={mobile} />

      <div className={`max-w-[1000px] mx-auto ${mobile ? 'px-4 pt-7 pb-16' : 'px-6 pt-12 pb-20'}`}>
        <p className="text-[11px] tracking-[0.18em] uppercase text-[#9aa5b4] font-semibold mb-2">Select Service</p>
        <p className="text-[13px] text-[#718096] mb-6 leading-relaxed">Most services include add-ons and can be combined if no single option meets your needs.</p>

        {services.length === 0 ? (
          <div className="text-center py-16 text-[#9aa5b4] text-sm">No services available yet.</div>
        ) : (
          <div
            className={`grid gap-4 ${mobile ? 'grid-cols-2 gap-3' : ''}`}
            style={{ gridTemplateColumns: mobile ? undefined : 'repeat(auto-fill, minmax(210px, 1fr))' }}
          >
            {services.map(svc => (
              <div
                key={svc.id}
                onClick={() => setSt({ ...INIT, service: svc })}
                className="rounded-xl overflow-hidden border border-[#dde3ea] bg-white cursor-pointer transition-[border-color,transform] duration-200 hover:border-[#8cc7c4] hover:scale-[1.02]"
              >
                <div
                  className="relative bg-cover bg-center bg-[#edf0f4]"
                  style={{ height: mobile ? 100 : 150, backgroundImage: svc.image_url ? `url('${svc.image_url}')` : undefined }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(140,199,196,0.13)] to-transparent" />
                </div>
                <div className={mobile ? 'p-3 pb-3.5' : 'px-[18px] pt-4 pb-5'}>
                  <h3 className={`font-['Playfair_Display',Georgia,serif] font-bold text-[#1a2e35] m-0 mb-1 leading-snug ${mobile ? 'text-[0.85rem]' : 'text-base'}`}>
                    {svc.name}
                  </h3>
                  {!mobile && <p className="text-xs text-[#718096] leading-relaxed mb-3">{svc.description}</p>}
                  <div className="inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.1em] uppercase text-[#8cc7c4]">
                    Check Prices <ArrowRight size={10} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )

  // ── Success screen ─────────────────────────────────────────────────────
  if (st.submitted) {
    return (
      <main className="min-h-screen bg-[#f4f6f8] font-['DM_Sans',sans-serif] pt-[72px]">
        <div className={`bg-[#1a2e35] border-b-[3px] border-[#8cc7c4] ${mobile ? 'px-4 py-4' : 'px-[52px] py-5'}`} />
        <TrustBar mobile={mobile} />
        <div className={`max-w-[540px] mx-auto px-4 ${mobile ? 'mt-8' : 'mt-14'}`}>
          <div className="bg-white border border-[#dde3ea] rounded-xl overflow-hidden">
            <div className="h-1.5 bg-[#8cc7c4]" />
            <div className={`text-center ${mobile ? 'px-5 py-8' : 'px-9 py-12'}`}>
              <div className="w-[60px] h-[60px] rounded-full bg-[rgba(140,199,196,0.12)] flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={28} color="#8cc7c4" strokeWidth={1.8} />
              </div>
              <h2 className="font-['Playfair_Display',Georgia,serif] text-[1.7rem] font-bold text-[#1a2e35] m-0 mb-3">Booking Requested!</h2>
              <p className="text-sm text-[#718096] leading-[1.7] mb-2">
                Your <strong className="text-[#1a2e35]">{st.service?.name}</strong> appointment has been submitted.
              </p>
              <p className="text-sm text-[#718096] leading-[1.7] mb-6">
                We'll confirm details to <strong className="text-[#1a2e35]">{st.email || 'your email'}</strong> shortly.
              </p>
              {lines.length > 0 && (
                <div className="bg-[#f8fafb] border border-[#edf0f4] rounded-md px-[18px] py-3.5 mb-6 text-left">
                  {lines.map(l => (
                    <div key={l.key} className="flex justify-between text-[13px] text-[#4a5568] py-[3px]">
                      <span>{l.qty}x {l.label}</span>
                      <span className="font-bold">${l.qty * l.price}</span>
                    </div>
                  ))}
                  <div className="border-t border-[#edf0f4] mt-2 pt-2 flex justify-between text-sm font-extrabold text-[#1a2e35]">
                    <span>Total</span><span>${total}</span>
                  </div>
                </div>
              )}
              <button
                onClick={() => setSt(INIT)}
                className="px-6 py-2.5 border-[1.5px] border-[#dde3ea] rounded bg-white text-[#4a5568] text-[13px] cursor-pointer font-['DM_Sans',sans-serif]"
              >
                Book Another Service
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // ── Wizard ─────────────────────────────────────────────────────────────
  const progress = steps.length > 0 ? ((st.stepIdx + 1) / steps.length) * 100 : 0
  const isContact = curStep?.type === 'contact'

  const stepTitle = (() => {
    if (!curStep) return ''
    if (curStep.type === 'datetime') return 'Date & Time'
    if (curStep.type === 'address') return 'Service Address'
    if (curStep.type === 'contact') return 'Your Details'
    if (curStep.type === 'photo') return 'Photos'
    return curStep.title ?? ''
  })()

  return (
    <main className="min-h-screen bg-[#f4f6f8] font-['DM_Sans',sans-serif] pt-[72px]">
      {/* Sub-header */}
      <div className={`bg-[#1a2e35] border-b-[3px] border-[#8cc7c4] flex items-center gap-3.5 ${mobile ? 'px-4 py-3.5' : 'px-[52px] py-5'}`}>
        <button
          onClick={() => st.stepIdx > 0 ? upd('stepIdx', st.stepIdx - 1) : setSt(INIT)}
          className="flex items-center gap-[5px] bg-transparent border-none text-[rgba(255,246,246,0.5)] cursor-pointer text-xs tracking-[0.1em] uppercase font-['DM_Sans',sans-serif] p-0 shrink-0"
        >
          <ChevronLeft size={14} /> Back
        </button>
        <div className="w-px h-[18px] bg-[rgba(255,246,246,0.15)] shrink-0" />
        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.18em] uppercase text-[rgba(140,199,196,0.7)] font-medium m-0">Cleaning Services</p>
          <h1 className={`font-['Playfair_Display',Georgia,serif] font-extrabold text-[#FFF6F6] mt-0.5 tracking-[-0.02em] truncate ${mobile ? 'text-[1.1rem]' : 'text-[1.4rem]'}`}>
            {st.service.name}
          </h1>
        </div>
      </div>
      <TrustBar mobile={mobile} />

      <div className={`max-w-[900px] mx-auto ${mobile ? 'px-0 pt-4 pb-16' : 'px-6 pt-8 pb-20'}`}>
        <div className={`bg-white border border-[#dde3ea] overflow-hidden flex ${mobile ? 'rounded-none flex-col border-x-0' : 'rounded-md flex-row'}`}>
          {mobile && <MobileOrderBar svcName={st.service.name} total={total} />}

          <div className="flex-1 flex flex-col min-w-0">
            <div className={`bg-[#1a2e35] flex items-center justify-between gap-3 ${mobile ? 'px-4 py-3' : 'px-6 py-3.5'}`}>
              <h2 className={`font-bold text-[#FFF6F6] m-0 truncate ${mobile ? 'text-[13px]' : 'text-[15px]'}`}>
                {stepTitle}
              </h2>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-[rgba(255,246,246,0.5)] whitespace-nowrap">{st.stepIdx + 1}/{steps.length}</span>
                <div className={`h-1 bg-[rgba(255,246,246,0.1)] rounded-full shrink-0 ${mobile ? 'w-[50px]' : 'w-20'}`}>
                  <div className="h-full bg-[#8cc7c4] rounded-full transition-[width] duration-400" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>

            <div className={`flex-1 ${mobile ? 'p-4' : 'p-6'}`}>
              {curStep && (
                <StepContent
                  bookedSlots={bookedSlots}
                  step={curStep} st={st} mobile={mobile}
                  onIncr={incr} onDecr={decr}
                  onSelectOne={(item, gk) => selectOne(item, gk)}
                  onUpd={upd}
                />
              )}
            </div>

            {!isContact && (
              <div className={mobile ? 'px-4 pb-4' : 'px-6 pb-6'}>
                <button
                  onClick={() => st.stepIdx < steps.length - 1 ? upd('stepIdx', st.stepIdx + 1) : upd('submitted', true)}
                  className="flex items-center justify-center gap-2 w-full py-[13px] px-6 bg-[#8cc7c4] hover:bg-[#6fb8b4] border-none rounded text-[#1a2e35] text-[15px] font-extrabold tracking-[0.03em] font-['DM_Sans',sans-serif] cursor-pointer transition-colors duration-200"
                >
                  Continue <ArrowRight size={15} />
                </button>
              </div>
            )}
          </div>

          {!mobile && (
            <div className="w-[210px] shrink-0 bg-[#fafbfc] border-l border-[#edf0f4] px-4 py-5 flex flex-col gap-3">
              <p className="text-[11px] font-bold text-[#1a2e35] tracking-[0.08em] uppercase m-0">{st.service.name}</p>
              {lines.length > 0 ? (
                <div className="flex flex-col gap-[5px]">
                  {lines.map(l => (
                    <div key={l.key} className="text-xs text-[#718096]">{l.qty}x {l.label}</div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#9aa5b4] italic m-0">No items selected yet</p>
              )}
              {st.date && (
                <div className="text-xs">
                  <div className="text-[#8cc7c4] font-semibold">
                    {new Date(st.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  {st.time && <div className="text-[#718096] mt-0.5">{st.time}</div>}
                </div>
              )}
              <div className="border-t border-[#edf0f4] pt-3 mt-auto flex justify-between items-baseline">
                <span className="text-xs text-[#9aa5b4]">Total</span>
                <span className="text-xl font-extrabold text-[#8cc7c4]">{total > 0 ? `$${total}` : '—'}</span>
              </div>
            </div>
          )}
        </div>

        <div className={`grid gap-2.5 ${mobile ? 'grid-cols-1 px-4 pt-4' : 'grid-cols-3 mt-5'}`}>
          {[
            { icon: <ShieldCheck size={18} color="#1a2e35" strokeWidth={1.8} />, title: 'Licensed & insured', sub: 'All staff background-checked and certified' },
            { icon: <Star size={18} color="#1a2e35" strokeWidth={1.8} />, title: '4.9 star rating', sub: 'Over 3,000 verified customer reviews' },
            { icon: <Clock size={18} color="#1a2e35" strokeWidth={1.8} />, title: 'Same-day available', sub: 'Fast response for urgent cleaning needs' },
          ].map(({ icon, title, sub }) => (
            <div key={title} className={`bg-white border border-[#dde3ea] rounded-md ${mobile ? 'flex items-center gap-3 p-3' : 'p-4 text-center'}`}>
              <div className={`w-9 h-9 rounded-full bg-[rgba(140,199,196,0.14)] flex items-center justify-center shrink-0 ${mobile ? '' : 'mx-auto mb-2.5'}`}>
                {icon}
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#1a2e35] mb-0.5">{title}</p>
                <p className="text-xs text-[#718096] leading-relaxed m-0">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}