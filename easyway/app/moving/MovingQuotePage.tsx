'use client'

import { useState, useCallback, useRef } from 'react'
import {
  ArrowRight, ArrowLeft, MapPin, Mail, User, Phone,
  Calendar, Truck, CheckCircle, ShieldCheck, Star, Clock,
  Loader2, AlertCircle, ShoppingCart, X, ChevronDown, ChevronUp,
} from 'lucide-react'
import { submitMovingQuote } from './actions'
import type { MovingItem } from '@/types/moving'
import { ItemCard } from './ItemCard'

const isValidZip = (z: string) => /^\d{5}$/.test(z)

export type PricingRange = {
  id: string
  min_miles: number
  max_miles: number | null
  price_per_cuft: number
}

function getRateForDistance(distanceMiles: number, ranges: PricingRange[]) {
  return ranges.find(r =>
    distanceMiles >= r.min_miles &&
    (r.max_miles === null || distanceMiles <= r.max_miles)
  ) ?? null
}

interface ZipInfo { city: string; state: string }
type ZipStatus = 'idle' | 'loading' | 'ok' | 'error'
interface ZipField { info: ZipInfo | null; status: ZipStatus; error: string }

async function fetchZipInfo(zip: string): Promise<ZipInfo> {
  const res = await fetch(`/api/zipcode?type=info&zip1=${zip}`)
  const data = await res.json()
  if (data.error_msg) throw new Error(data.error_msg)
  return { city: data.city, state: data.state }
}

async function fetchDistance(zip1: string, zip2: string): Promise<number> {
  const res = await fetch(`/api/zipcode?type=distance&zip1=${zip1}&zip2=${zip2}`)
  const data = await res.json()
  if (data.error_msg) throw new Error(data.error_msg)
  return Math.round(data.distance)
}

function groupBySections(items: MovingItem[]) {
  const map = new Map<string, MovingItem[]>()
  for (const item of items) {
    if (!map.has(item.section)) map.set(item.section, [])
    map.get(item.section)!.push(item)
  }
  return Array.from(map.entries()).map(([name, items]) => ({ name, items }))
}

type Counts = Record<string, number>

// ── Shared form fields ────────────────────────────────────────
function Field({
  icon, label, name, value, onChange, placeholder = '', type = 'text',
}: {
  icon: React.ReactNode; label: string; name: string; value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string; type?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] tracking-[0.12em] uppercase font-bold" style={{ color: 'rgba(51,63,54,0.6)' }}>
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex" style={{ color: '#9aa5b4' }}>
          {icon}
        </span>
        <input
          type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
          className="w-full pl-9 pr-3 py-[11px] rounded text-sm font-['DM_Sans',sans-serif] outline-none transition-colors duration-150"
          style={{ background: '#fafbfc', border: '1.5px solid rgba(51,63,54,0.15)', color: 'var(--ew-forest)' }}
          onFocus={e => (e.currentTarget.style.borderColor = 'var(--ew-sky)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(51,63,54,0.15)')}
        />
      </div>
    </div>
  )
}

function ZipInputField({
  icon, label, name, value, onChange, placeholder, zipField,
}: {
  icon: React.ReactNode; label: string; name: string; value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string; zipField: ZipField
}) {
  const borderColor =
    zipField.status === 'ok' ? 'var(--ew-sky)' :
    zipField.status === 'error' ? '#fca5a5' :
    'rgba(51,63,54,0.15)'
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] tracking-[0.12em] uppercase font-bold" style={{ color: 'rgba(51,63,54,0.6)' }}>
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex" style={{ color: '#9aa5b4' }}>
          {icon}
        </span>
        <input
          type="text" name={name} value={value} onChange={onChange}
          placeholder={placeholder} maxLength={5}
          className="w-full pl-9 pr-9 py-[11px] rounded text-sm font-['DM_Sans',sans-serif] outline-none transition-colors duration-150"
          style={{ background: '#fafbfc', border: `1.5px solid ${borderColor}`, color: 'var(--ew-forest)' }}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {zipField.status === 'loading' && <Loader2 size={14} className="animate-spin" style={{ color: '#9aa5b4' }} />}
          {zipField.status === 'ok' && <CheckCircle size={14} style={{ color: 'var(--ew-sky)' }} />}
          {zipField.status === 'error' && <AlertCircle size={14} style={{ color: '#f87171' }} />}
        </span>
      </div>
      {zipField.status === 'ok' && zipField.info && (
        <p className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--ew-leaf)' }}>
          <MapPin size={11} /> {zipField.info.city}, {zipField.info.state}
        </p>
      )}
      {zipField.status === 'error' && (
        <p className="text-xs" style={{ color: '#f87171' }}>{zipField.error}</p>
      )}
    </div>
  )
}

// ── Room stepper section ──────────────────────────────────────
function RoomStep({
  section, stepNumber, totalSteps, counts, onInc, onDec, isCompleted,
  isOpen, onOpen, onDone,
}: {
  section: { name: string; items: MovingItem[] }
  stepNumber: number
  totalSteps: number
  counts: Counts
  onInc: (id: string) => void
  onDec: (id: string) => void
  isCompleted: boolean
  isOpen: boolean
  onOpen: () => void
  onDone: () => void
}) {
  const sectionCount = section.items.reduce((a, item) => a + (counts[item.id] || 0), 0)
  const sectionCuft = section.items.reduce((a, item) => a + (counts[item.id] || 0) * item.cuft, 0)
  const isLast = stepNumber === totalSteps

  return (
    <div className="relative flex gap-4">
      {/* Vertical spine */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 transition-colors duration-200"
          style={{
            background: isCompleted ? 'var(--ew-leaf)' : isOpen ? 'var(--ew-sky)' : 'rgba(51,63,54,0.1)',
            color: isCompleted || isOpen ? '#fff' : '#9aa5b4',
            border: isOpen && !isCompleted ? '2px solid var(--ew-sky)' : '2px solid transparent',
          }}
        >
          {isCompleted ? <CheckCircle size={14} /> : stepNumber}
        </div>
        {!isLast && (
          <div
            className="w-px flex-1 mt-1"
            style={{ background: isCompleted ? 'var(--ew-leaf)' : 'rgba(51,63,54,0.1)', minHeight: '24px' }}
          />
        )}
      </div>

      {/* Card */}
      <div
        className="flex-1 mb-4 rounded-xl overflow-hidden transition-[border-color] duration-200"
        style={{
          border: isOpen ? '1.5px solid var(--ew-sky)' : isCompleted ? '1.5px solid var(--ew-leaf)' : '1px solid rgba(51,63,54,0.12)',
          background: 'var(--ew-bg)',
        }}
      >
        {/* Header */}
        <button
          onClick={onOpen}
          className="w-full flex items-center justify-between px-5 py-4 bg-transparent border-none cursor-pointer text-left"
          style={{ background: isOpen ? 'rgba(27,110,180,0.04)' : 'transparent' }}
        >
          <div className="flex items-center gap-3">
            <div>
              <p className="m-0 text-[13px] font-bold" style={{ color: 'var(--ew-forest)' }}>{section.name}</p>
              {sectionCount > 0 && (
                <p className="m-0 text-[11px] mt-0.5" style={{ color: 'var(--ew-sky)' }}>
                  {sectionCount} item{sectionCount !== 1 ? 's' : ''} · {sectionCuft} cu.ft
                </p>
              )}
              {sectionCount === 0 && !isOpen && (
                <p className="m-0 text-[11px] mt-0.5" style={{ color: '#9aa5b4' }}>No items added</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {sectionCount > 0 && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(27,110,180,0.1)', color: 'var(--ew-sky)' }}>
                {sectionCount}
              </span>
            )}
            {isOpen ? <ChevronUp size={16} style={{ color: '#9aa5b4' }} /> : <ChevronDown size={16} style={{ color: '#9aa5b4' }} />}
          </div>
        </button>

        {/* Items grid */}
        {isOpen && (
          <div className="px-5 pb-5" style={{ borderTop: '1px solid rgba(51,63,54,0.08)' }}>
            <p className="text-[11px] uppercase tracking-[0.1em] font-semibold mt-4 mb-3" style={{ color: '#9aa5b4' }}>
              Select items from this room
            </p>
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
              {section.items.map(item => (
                <ItemCard key={item.id} item={item} count={counts[item.id] || 0} onInc={() => onInc(item.id)} onDec={() => onDec(item.id)} />
              ))}
            </div>

            <button
              onClick={onDone}
              className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer border-none transition-colors duration-150"
              style={{ background: 'rgba(51,63,54,0.06)', color: 'var(--ew-forest)' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(51,63,54,0.12)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(51,63,54,0.06)')}
            >
              <CheckCircle size={14} />
              Done with {section.name}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────
export default function MovingQuotePage({
  items,
  pricingRanges,
}: {
  items: MovingItem[]
  pricingRanges: PricingRange[]
}) {
  const sections = groupBySections(items)

  const [step, setStep] = useState<1 | 2>(1)
  const [form, setForm] = useState({
    pickupZip: '', dropoffZip: '', email: '',
    firstName: '', lastName: '', phone: '', date: '', needVehicle: '',
  })
  const [vehicleDropdownOpen, setVehicleDropdownOpen] = useState(false)
  const [pickupZip, setPickupZip] = useState<ZipField>({ info: null, status: 'idle', error: '' })
  const [dropoffZip, setDropoffZip] = useState<ZipField>({ info: null, status: 'idle', error: '' })
  const [distanceMiles, setDistanceMiles] = useState<number | null>(null)
  const [distanceLoading, setDistanceLoading] = useState(false)
  const zipTimers = useRef<{ pickup?: ReturnType<typeof setTimeout>; dropoff?: ReturnType<typeof setTimeout> }>({})
  const [counts, setCounts] = useState<Counts>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [referenceId, setReferenceId] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState(0)

  const handleZipChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, which: 'pickup' | 'dropoff') => {
      const val = e.target.value.replace(/\D/g, '').slice(0, 5)
      setForm(f => ({ ...f, [which === 'pickup' ? 'pickupZip' : 'dropoffZip']: val }))
      const setter = which === 'pickup' ? setPickupZip : setDropoffZip
      clearTimeout(zipTimers.current[which])
      if (!isValidZip(val)) {
        setter({ info: null, status: 'idle', error: '' })
        setDistanceMiles(null)
        return
      }
      setter({ info: null, status: 'loading', error: '' })
      zipTimers.current[which] = setTimeout(async () => {
        try {
          const info = await fetchZipInfo(val)
          setter({ info, status: 'ok', error: '' })
          const p = which === 'pickup' ? val : form.pickupZip
          const d = which === 'dropoff' ? val : form.dropoffZip
          if (isValidZip(p) && isValidZip(d)) {
            setDistanceLoading(true)
            try {
              const dist = await fetchDistance(p, d)
              setDistanceMiles(dist)
            } catch {
              setDistanceMiles(null)
            } finally {
              setDistanceLoading(false)
            }
          }
        } catch (err: any) {
          setter({ info: null, status: 'error', error: err.message ?? 'Invalid zip' })
          setDistanceMiles(null)
        }
      }, 500)
    },
    [form.pickupZip, form.dropoffZip]
  )

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
const isZipReady = (field: ZipField, value: string) =>
  field.status === 'ok' || (isValidZip(value) && field.status === 'error')
  const canProceed =
  isZipReady(pickupZip, form.pickupZip) &&
  isZipReady(dropoffZip, form.dropoffZip) &&
  form.firstName.trim() && form.lastName.trim() &&
  form.email.trim() && form.phone.trim() && form.needVehicle

  const inc = (key: string) => setCounts(c => ({ ...c, [key]: (c[key] || 0) + 1 }))
  const dec = (key: string) => setCounts(c => ({ ...c, [key]: Math.max(0, (c[key] || 0) - 1) }))

  const totalCuft = items.reduce((sum, item) => sum + (counts[item.id] || 0) * item.cuft, 0)
  const totalItems = Object.values(counts).reduce((a, b) => a + b, 0)
  const matchedRange = distanceMiles !== null ? getRateForDistance(distanceMiles, pricingRanges) : null
  const estimatedBase = matchedRange && totalCuft > 0
    ? Math.round(totalCuft * Number(matchedRange.price_per_cuft))
    : null
  const estimatedRange = estimatedBase
    ? {
        low: Math.round((estimatedBase * 0.85) / 50) * 50,
        high: Math.round((estimatedBase * 1.15) / 50) * 50,
      }
    : null

  const handleSubmit = async () => {
  setSubmitting(true)
  setSubmitError(null)
  const result = await submitMovingQuote({
    firstName: form.firstName, lastName: form.lastName,
    email: form.email, phone: form.phone,
    pickupZip: form.pickupZip, pickupCity: pickupZip.info?.city ?? '', pickupState: pickupZip.info?.state ?? '',
    dropoffZip: form.dropoffZip, dropoffCity: dropoffZip.info?.city ?? '', dropoffState: dropoffZip.info?.state ?? '',
    distanceMiles: distanceMiles ?? 0, preferredDate: form.date,
    needVehicle: form.needVehicle === 'yes', items: counts, totalCuft,
  })
  setSubmitting(false)
  if (!result.success) { setSubmitError(result.error); return }
  setReferenceId(result.referenceId)
  setSubmitted(true)
}

  const handleReset = () => {
    setSubmitted(false); setStep(1)
    setForm({ pickupZip: '', dropoffZip: '', email: '', firstName: '', lastName: '', phone: '', date: '', needVehicle: '' })
    setCounts({})
    setPickupZip({ info: null, status: 'idle', error: '' })
    setDropoffZip({ info: null, status: 'idle', error: '' })
    setDistanceMiles(null); setReferenceId(null)
  }

  // ── Success screen ────────────────────────────────────────
  if (submitted) {
    return (
      <main
        className="min-h-screen font-['DM_Sans',sans-serif] pt-[72px] flex items-center justify-center"
        style={{ background: 'var(--ew-bg)' }}
      >
        <div
          className="rounded-md p-12 max-w-[480px] w-full mx-4 text-center flex flex-col items-center gap-4"
          style={{ background: 'var(--ew-bg)', border: '1px solid rgba(51,63,54,0.12)' }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(75,118,22,0.1)' }}>
            <CheckCircle size={28} strokeWidth={1.8} style={{ color: 'var(--ew-leaf)' }} />
          </div>
          <h2 className="font-['Playfair_Display',Georgia,serif] text-[1.7rem] font-bold m-0" style={{ color: 'var(--ew-forest)' }}>
            Request received!
          </h2>
          {referenceId && (
            <p className="text-xs font-mono font-semibold px-3 py-1.5 rounded" style={{ color: 'var(--ew-sky)', background: 'rgba(27,110,180,0.08)' }}>
              {referenceId}
            </p>
          )}
          <p className="text-sm max-w-[360px] leading-[1.7]" style={{ color: 'rgba(51,63,54,0.6)' }}>
            We've received your moving request and will be in touch at{' '}
            <strong style={{ color: 'var(--ew-forest)' }}>{form.email}</strong> with a personalised quote.
          </p>
          <p className="text-sm max-w-[360px] leading-[1.7]" style={{ color: 'rgba(51,63,54,0.6)' }}>
            Minimum moving quote is 300 cft or 500 miles. If your request falls below these thresholds, we'll still get back to you with a quote, but please allow extra time.
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded text-[13px] cursor-pointer font-['DM_Sans',sans-serif]"
            style={{ border: '1.5px solid rgba(51,63,54,0.15)', background: 'var(--ew-bg)', color: 'rgba(51,63,54,0.7)' }}
          >
            Submit another
          </button>
        </div>
      </main>
    )
  }

  return (
    <main
      className="min-h-screen font-['DM_Sans',sans-serif] pt-[72px]"
      style={{ background: 'var(--ew-bg)' }}
    >
      {/* Hero */}
      <div
        className="px-4 sm:px-8 lg:px-[52px] pt-14 pb-12"
        style={{ background: 'var(--ew-forest)', borderBottom: '3px solid var(--ew-sky)' }}
      >
        <div className="mb-6">
          <img src="/11.png" alt="Moving services logo" className="h-10 w-auto" />
        </div>
        <p className="text-[11px] tracking-[0.2em] uppercase font-semibold mb-3.5" style={{ color: 'var(--ew-leaf)' }}>
          Moving Services
        </p>
        <h1
          className="font-['Playfair_Display',Georgia,serif] text-[clamp(2rem,4.5vw,3.4rem)] font-extrabold leading-[1.1] tracking-[-0.03em] m-0"
          style={{ color: '#ffffff' }}
        >
          Move Smarter,{' '}
          <em className="italic" style={{ color: 'var(--ew-sky)' }}>Live Better.</em>
        </h1>
        <p className="mt-4 text-[15px] max-w-[480px] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Room-by-room planning and a crew that cares. Fill in your details and we'll get back to you with a custom quote.
        </p>
      </div>

      {/* Trust bar */}
      <div
        className="px-4 sm:px-8 lg:px-[52px] py-[10px] flex gap-5 sm:gap-7 flex-wrap"
        style={{ background: 'rgba(51,63,54,0.92)' }}
      >
        {['Licensed & insured', '4.9 stars · 2,400+ reviews', 'BBB accredited', 'Free on-site estimates'].map(t => (
          <div key={t} className="flex items-center gap-[7px] text-xs font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--ew-leaf)' }} />
            {t}
          </div>
        ))}
      </div>

      {/* Step indicator */}
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 pt-8">
        <div className="flex items-center gap-3 mb-6">
          {[{ n: 1, label: 'Your details' }, { n: 2, label: 'Your items' }].map(({ n, label }) => (
            <div key={n} className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-200"
                style={{
                  background: step === n ? 'var(--ew-sky)' : step > n ? 'var(--ew-forest)' : 'rgba(51,63,54,0.1)',
                  color: step === n || step > n ? '#ffffff' : '#9aa5b4',
                }}
              >
                {step > n ? <CheckCircle size={14} /> : n}
              </div>
              <span className="text-xs font-medium" style={{ color: step === n ? 'var(--ew-forest)' : '#9aa5b4' }}>
                {label}
              </span>
              {n < 2 && <div className="w-8 h-px mx-1" style={{ background: 'rgba(51,63,54,0.15)' }} />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[760px] mx-auto px-4 sm:px-6 pb-20">

        {/* ── Step 1: Details ────────────────────────────────── */}
        {step === 1 && (
          <>
            <div
              className="rounded-md overflow-hidden"
              style={{ background: 'var(--ew-bg)', border: '1px solid rgba(51,63,54,0.12)' }}
            >
              <div className="px-7 py-4 flex items-center justify-between" style={{ background: 'var(--ew-forest)' }}>
                <h2 className="text-base font-bold text-white m-0">Get your free quote</h2>
                <span
                  className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-[3px] tracking-[0.07em]"
                  style={{ background: 'var(--ew-leaf)', color: '#ffffff' }}
                >
                  FREE
                </span>
              </div>

              <div className="p-5 sm:p-7 flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <ZipInputField icon={<MapPin size={15} />} label="Pick up zip code" name="pickupZip"
                    value={form.pickupZip} placeholder="e.g. 60601"
                    onChange={e => handleZipChange(e, 'pickup')} zipField={pickupZip} />
                  <ZipInputField icon={<MapPin size={15} />} label="Drop off zip code" name="dropoffZip"
                    value={form.dropoffZip} placeholder="e.g. 60614"
                    onChange={e => handleZipChange(e, 'dropoff')} zipField={dropoffZip} />
                </div>

                {(distanceLoading || distanceMiles !== null) && (
                  <div
                    className="flex items-center gap-2 text-xs font-medium rounded px-3 py-2"
                    style={{ color: 'var(--ew-sky)', background: 'rgba(27,110,180,0.06)', border: '1px solid rgba(27,110,180,0.18)' }}
                  >
                    {distanceLoading
                      ? <><Loader2 size={12} className="animate-spin" /> Calculating distance…</>
                      : <><MapPin size={12} /> Your move is approximately <strong>{distanceMiles} miles</strong></>}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Field icon={<User size={15} />} label="First name" name="firstName" value={form.firstName} onChange={handleFormChange} placeholder="Jane" />
                  <Field icon={<User size={15} />} label="Last name" name="lastName" value={form.lastName} onChange={handleFormChange} placeholder="Smith" />
                </div>

                <Field icon={<Mail size={15} />} label="Email" name="email" type="email" value={form.email} onChange={handleFormChange} placeholder="you@example.com" />
                <Field icon={<Phone size={15} />} label="Phone number" name="phone" type="tel" value={form.phone} onChange={handleFormChange} placeholder="(773) 000-0000" />
                <Field icon={<Calendar size={15} />} label="Preferred move date" name="date" type="date" value={form.date} onChange={handleFormChange} />

                {/* Vehicle dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] tracking-[0.12em] uppercase font-bold" style={{ color: 'rgba(51,63,54,0.6)' }}>
                    Need to move a vehicle?
                  </label>
                  <div className="relative">
                    <Truck size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" style={{ color: '#9aa5b4' }} />
                    <div
                      onClick={() => setVehicleDropdownOpen(!vehicleDropdownOpen)}
                      className={`pl-9 pr-3 py-[11px] cursor-pointer select-none text-sm flex items-center transition-colors duration-150 ${vehicleDropdownOpen ? 'rounded-t rounded-b-none' : 'rounded'}`}
                      style={{
                        background: '#fafbfc',
                        border: `1.5px solid ${vehicleDropdownOpen ? 'var(--ew-sky)' : 'rgba(51,63,54,0.15)'}`,
                        color: form.needVehicle ? 'var(--ew-forest)' : '#9aa5b4',
                      }}
                    >
                      {form.needVehicle === 'yes' ? 'Yes' : form.needVehicle === 'no' ? 'No' : 'Select an option'}
                    </div>
                    <svg width="12" height="12" viewBox="0 0 12 12"
                      className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 ${vehicleDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                      fill="none" stroke="#9aa5b4" strokeWidth="1.5">
                      <path d="M2 4l4 4 4-4" />
                    </svg>
                    {vehicleDropdownOpen && (
                      <div
                        className="absolute top-full left-0 right-0 rounded-b z-50 overflow-hidden"
                        style={{ background: 'var(--ew-bg)', border: '1.5px solid var(--ew-sky)', borderTop: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      >
                        {['yes', 'no'].map(opt => (
                          <div
                            key={opt}
                            onClick={() => { setForm(f => ({ ...f, needVehicle: opt })); setVehicleDropdownOpen(false) }}
                            className="px-4 py-3 text-sm cursor-pointer transition-colors duration-100"
                            style={{
                              color: form.needVehicle === opt ? 'var(--ew-forest)' : 'rgba(51,63,54,0.8)',
                              fontWeight: form.needVehicle === opt ? 600 : 400,
                              background: form.needVehicle === opt ? 'rgba(75,118,22,0.08)' : 'transparent',
                            }}
                            onMouseEnter={e => { if (form.needVehicle !== opt) (e.currentTarget as HTMLElement).style.background = 'rgba(27,110,180,0.05)' }}
                            onMouseLeave={e => { if (form.needVehicle !== opt) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                          >
                            {opt === 'yes' ? 'Yes' : 'No'}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <hr className="border-none h-px my-1" style={{ background: 'rgba(51,63,54,0.08)' }} />

                <button
                  onClick={() => setStep(2)}
                  disabled={!canProceed}
                  className="flex items-center justify-center gap-2 w-full px-8 py-[15px] rounded text-[15px] font-extrabold tracking-[0.03em] font-['DM_Sans',sans-serif] cursor-pointer border-none transition-[background,opacity] duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: 'var(--ew-forest)', color: '#ffffff' }}
                  onMouseEnter={e => { if (canProceed) (e.currentTarget as HTMLElement).style.background = 'var(--ew-sky)' }}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--ew-forest)'}
                >
                  Next: Add your items <ArrowRight size={15} />
                </button>

                <p className="text-xs text-center leading-relaxed" style={{ color: '#9aa5b4' }}>
                  No commitment required. We'll respond with a personalised quote.
                </p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
              {[
                { icon: <ShieldCheck size={18} strokeWidth={1.8} />, title: 'Licensed & insured', sub: 'Full coverage on every move we handle' },
                { icon: <Clock size={18} strokeWidth={1.8} />, title: 'Same-day availability', sub: 'Book today, move today — we\'re flexible' },
                { icon: <Star size={18} strokeWidth={1.8} />, title: '4.9-star rated', sub: 'Over 2,400 verified customer reviews' },
              ].map(({ icon, title, sub }) => (
                <div key={title} className="rounded-md p-4 text-center" style={{ background: 'var(--ew-bg)', border: '1px solid rgba(51,63,54,0.12)' }}>
                  <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center mx-auto mb-2.5" style={{ background: 'rgba(75,118,22,0.1)', color: 'var(--ew-forest)' }}>
                    {icon}
                  </div>
                  <p className="text-[13px] font-bold mb-1" style={{ color: 'var(--ew-forest)' }}>{title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(51,63,54,0.55)' }}>{sub}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Step 2: Room-by-room stepper ───────────────────── */}
        {step === 2 && (
          <div>
            {/* Header row */}
            <div className="flex items-start justify-between mb-6 gap-4">
              <div>
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-xs border-none bg-transparent cursor-pointer mb-2 p-0 transition-colors duration-150"
                  style={{ color: '#9aa5b4' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--ew-forest)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#9aa5b4'}
                >
                  <ArrowLeft size={13} /> Back to details
                </button>
                <h2
                  className="font-['Playfair_Display',Georgia,serif] text-[clamp(1.4rem,3vw,2rem)] font-bold leading-[1.15] tracking-[-0.02em] m-0"
                  style={{ color: 'var(--ew-forest)' }}
                >
                  Let's move room{' '}
                  <em className="italic" style={{ color: 'var(--ew-sky)' }}>by room.</em>
                </h2>
                {distanceMiles !== null && (
                  <p className="text-xs font-medium mt-1 flex items-center gap-1" style={{ color: 'var(--ew-leaf)' }}>
                    <MapPin size={11} />
                    {pickupZip.info?.city} → {dropoffZip.info?.city} · {distanceMiles} miles
                  </p>
                )}
              </div>

              {/* Cart button */}
              <button
                onClick={() => setCartOpen(true)}
                className="flex items-center gap-2 px-[18px] py-2.5 rounded-lg text-[13px] font-medium font-['DM_Sans',sans-serif] whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0"
                style={{
                  border: totalItems > 0 ? '1px solid var(--ew-sky)' : '1px solid rgba(51,63,54,0.15)',
                  background: totalItems > 0 ? 'var(--ew-sky)' : 'var(--ew-bg)',
                  color: totalItems > 0 ? '#ffffff' : 'rgba(51,63,54,0.6)',
                }}
              >
                <ShoppingCart size={15} />
                {totalItems > 0
                  ? `${totalItems} item${totalItems !== 1 ? 's' : ''} · ${totalCuft} cu.ft`
                  : 'Your move list'}
              </button>
            </div>

            {/* Instruction hint */}
            <p className="text-sm mb-6 leading-relaxed" style={{ color: 'rgba(51,63,54,0.55)' }}>
              Open each room, select what you're taking, then mark it done. Skip any rooms that don't apply.
            </p>

            {/* Room stepper */}
            {items.length === 0 ? (
              <div className="text-center py-16 text-sm" style={{ color: '#9aa5b4' }}>
                No items available yet. Add items from the admin dashboard.
              </div>
            ) : (
              <div>
                {sections.map((section, i) => {
  const sectionCount = section.items.reduce((a, item) => a + (counts[item.id] || 0), 0)
  return (
    <RoomStep
      key={section.name}
      section={section}
      stepNumber={i + 1}
      totalSteps={sections.length}
      counts={counts}
      onInc={inc}
      onDec={dec}
      isCompleted={sectionCount > 0}
      isOpen={activeSection === i}
      onOpen={() => setActiveSection(i)}
      onDone={() => setActiveSection(i + 1)} // advances to next, or past last = none open
    />
  )
})}
              </div>
            )}

            {/* Sticky estimate bar */}
            {estimatedRange && (
              <div
                className="mt-2 mb-5 rounded-xl px-5 py-4 flex items-center justify-between gap-3"
                style={{ background: 'rgba(27,110,180,0.06)', border: '1px solid rgba(27,110,180,0.18)' }}
              >
                <div>
                  <p className="text-[11px] tracking-[0.1em] uppercase font-bold m-0" style={{ color: 'var(--ew-sky)' }}>
                    Estimated Cost
                  </p>
                  <p className="text-[11px] mt-0.5 m-0" style={{ color: '#9aa5b4' }}>
                    {totalCuft} cu.ft × ${Number(matchedRange!.price_per_cuft).toFixed(2)}/cu.ft · {distanceMiles} miles
                  </p>
                </div>
                <span
                  className="text-[1.3rem] font-extrabold font-['Playfair_Display',serif] shrink-0"
                  style={{ color: 'var(--ew-forest)' }}
                >
                  ${estimatedRange.low.toLocaleString()} – ${estimatedRange.high.toLocaleString()}
                </span>
              </div>
            )}

            {submitError && (
              <p className="text-xs rounded px-3 py-2 mb-3" style={{ color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca' }}>
                {submitError}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting || totalItems === 0}
              className="flex items-center justify-center gap-2 w-full px-8 py-[15px] rounded text-[15px] font-extrabold tracking-[0.03em] font-['DM_Sans',sans-serif] cursor-pointer border-none transition-[background,opacity] duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--ew-forest)', color: '#ffffff' }}
              onMouseEnter={e => { if (!submitting && totalItems > 0) (e.currentTarget as HTMLElement).style.background = 'var(--ew-sky)' }}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--ew-forest)'}
            >
              {submitting
                ? <><Loader2 size={15} className="animate-spin" /> Submitting…</>
                : <>Request Quote <ArrowRight size={15} /></>}
            </button>
            {totalItems === 0 && (
              <p className="text-xs text-center mt-2" style={{ color: '#9aa5b4' }}>
                Add at least one item to continue.
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Cart drawer ───────────────────────────────────────── */}
      {cartOpen && (
        <>
          <div onClick={() => setCartOpen(false)} className="fixed inset-0 bg-black/25 z-[100]" />
          <div
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[360px] z-[101] flex flex-col px-6 py-7 overflow-y-auto"
            style={{ background: 'var(--ew-bg)', borderLeft: '1px solid rgba(51,63,54,0.12)' }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-['Playfair_Display',Georgia,serif] text-[1.3rem] font-bold m-0" style={{ color: 'var(--ew-forest)' }}>
                Your move list
              </h2>
              <button onClick={() => setCartOpen(false)} className="bg-transparent border-none cursor-pointer p-1" style={{ color: '#9aa5b4' }}>
                <X size={18} />
              </button>
            </div>

            {totalItems === 0 ? (
              <p className="text-sm leading-relaxed" style={{ color: '#9aa5b4' }}>No items added yet.</p>
            ) : (
              <>
                <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto">
                  {items.filter(item => (counts[item.id] || 0) > 0).map(item => {
                    const count = counts[item.id]
                    return (
                      <div key={item.id} className="flex items-center gap-2.5 p-2.5 rounded-lg" style={{ background: 'rgba(51,63,54,0.04)' }}>
                        {item.image_url && (
                          <img src={item.image_url} alt={item.name} className="w-[42px] h-[42px] rounded-md object-cover shrink-0" loading="lazy" />
                        )}
                        <div className="flex-1">
                          <p className="m-0 text-[13px] font-medium" style={{ color: 'var(--ew-forest)' }}>{item.name}</p>
                          <p className="m-0 mt-0.5 text-[11px]" style={{ color: '#9aa5b4' }}>{item.cuft} × {count} = {item.cuft * count} cu.ft</p>
                        </div>
                        <div className="flex items-center gap-[5px]">
                          <button onClick={() => dec(item.id)} className="w-[22px] h-[22px] rounded cursor-pointer flex items-center justify-center" style={{ border: '1px solid rgba(51,63,54,0.15)', background: 'var(--ew-bg)', color: 'rgba(51,63,54,0.6)' }}>
                            <span style={{ fontSize: 10 }}>−</span>
                          </button>
                          <span className="text-[13px] font-medium min-w-[14px] text-center" style={{ color: 'var(--ew-sky)' }}>{count}</span>
                          <button onClick={() => inc(item.id)} className="w-[22px] h-[22px] rounded cursor-pointer flex items-center justify-center" style={{ border: '1px solid var(--ew-sky)', background: 'rgba(27,110,180,0.08)', color: 'var(--ew-forest)' }}>
                            <span style={{ fontSize: 10 }}>+</span>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(51,63,54,0.04)' }}>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs" style={{ color: '#9aa5b4' }}>Total volume</span>
                    <span className="text-[13px] font-medium" style={{ color: 'var(--ew-forest)' }}>{totalCuft} cu.ft</span>
                  </div>
                  {distanceMiles !== null && (
                    <div className="flex justify-between mb-2">
                      <span className="text-xs" style={{ color: '#9aa5b4' }}>Distance</span>
                      <span className="text-[13px] font-medium" style={{ color: 'var(--ew-forest)' }}>{distanceMiles} miles</span>
                    </div>
                  )}
                  {matchedRange && (
                    <div className="flex justify-between mb-2">
                      <span className="text-xs" style={{ color: '#9aa5b4' }}>Rate</span>
                      <span className="text-[13px] font-medium" style={{ color: 'var(--ew-forest)' }}>
                        ${Number(matchedRange.price_per_cuft).toFixed(2)} / cu.ft
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-xs" style={{ color: '#9aa5b4' }}>Total items</span>
                    <span className="text-[13px] font-bold" style={{ color: 'var(--ew-sky)' }}>{totalItems} items</span>
                  </div>
                  {estimatedRange && (
                    <div className="mt-4 rounded-lg px-4 py-3 flex items-center justify-between gap-3" style={{ background: 'rgba(27,110,180,0.06)', border: '1px solid rgba(27,110,180,0.18)' }}>
                      <div>
                        <p className="text-[11px] tracking-[0.1em] uppercase font-bold m-0" style={{ color: 'var(--ew-sky)' }}>Estimated Cost</p>
                        <p className="text-[11px] mt-0.5 m-0" style={{ color: '#9aa5b4' }}>
                          {totalCuft} cu.ft × ${Number(matchedRange!.price_per_cuft).toFixed(2)}/cu.ft
                        </p>
                      </div>
                      <span className="text-[1.2rem] font-extrabold font-['Playfair_Display',serif] shrink-0" style={{ color: 'var(--ew-forest)' }}>
                        ${estimatedRange.low.toLocaleString()} – ${estimatedRange.high.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
                <p className="mt-3 text-[11px] text-center leading-relaxed" style={{ color: '#9aa5b4' }}>
                  Our team will review your list and send a custom quote.
                </p>
              </>
            )}
          </div>
        </>
      )}
    </main>
  )
}