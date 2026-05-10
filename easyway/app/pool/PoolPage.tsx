'use client'

import { useState } from 'react'
import {
  ArrowRight, MapPin, Building2, Home, Waves,
  User, Mail, Phone, FileText, ChevronLeft,
  CheckCircle, Droplets, Clock, ShieldCheck, Hash,
  Calendar, DollarSign, Info, MessageSquare, AlertCircle,
  Settings, Star,
} from 'lucide-react'
import { submitPoolCareQuote, submitPoolFillingQuote } from './actions'

// ── Types ────────────────────────────────────────────────────
type FieldOption = { id: string; label: string; value: string; sort_order: number }

type PoolField = {
  id: string
  key: string
  label: string
  placeholder: string
  help_text: string
  type: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select'
  icon: string
  required: boolean
  sort_order: number
  is_active: boolean
  pool_care_field_options?: FieldOption[]
  pool_filling_field_options?: FieldOption[]
}

type View = 'choose' | 'care' | 'water'

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
]

// ── Icon map ─────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ReactNode> = {
  MapPin:       <MapPin size={15} />,
  Building2:    <Building2 size={15} />,
  Home:         <Home size={15} />,
  Waves:        <Waves size={15} />,
  User:         <User size={15} />,
  Mail:         <Mail size={15} />,
  Phone:        <Phone size={15} />,
  FileText:     <FileText size={15} />,
  Hash:         <Hash size={15} />,
  Calendar:     <Calendar size={15} />,
  DollarSign:   <DollarSign size={15} />,
  Info:         <Info size={15} />,
  MessageSquare:<MessageSquare size={15} />,
  Droplets:     <Droplets size={15} />,
  ShieldCheck:  <ShieldCheck size={15} />,
  CheckCircle:  <CheckCircle size={15} />,
  AlertCircle:  <AlertCircle size={15} />,
  Settings:     <Settings size={15} />,
  Star:         <Star size={15} />,
  Clock:        <Clock size={15} />,
}

const getIcon = (name: string) => ICON_MAP[name] ?? <FileText size={15} />

// ── Field components ─────────────────────────────────────────
function InputField({ field, value, onChange }: {
  field: PoolField
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] tracking-[0.12em] uppercase font-bold" style={{ color: 'rgba(51,63,54,0.6)' }}>
        {field.label}{field.required && ' *'}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex" style={{ color: '#9aa5b4' }}>
          {getIcon(field.icon)}
        </span>
        <input
          type={field.type}
          name={field.key}
          value={value}
          onChange={onChange}
          placeholder={field.placeholder}
          className="w-full py-[11px] pr-3 pl-9 rounded text-sm font-['DM_Sans',sans-serif] outline-none box-border transition-colors duration-150"
          style={{ background: '#fafbfc', border: '1.5px solid rgba(51,63,54,0.15)', color: 'var(--ew-forest)' }}
          onFocus={e => (e.currentTarget.style.borderColor = 'var(--ew-sky)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(51,63,54,0.15)')}
        />
      </div>
      {field.help_text && (
        <p className="text-xs m-0 leading-[1.5]" style={{ color: '#9aa5b4' }}>{field.help_text}</p>
      )}
    </div>
  )
}

function TextareaField({ field, value, onChange }: {
  field: PoolField
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] tracking-[0.12em] uppercase font-bold" style={{ color: 'rgba(51,63,54,0.6)' }}>
        {field.label}{field.required && ' *'}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-[13px] pointer-events-none flex" style={{ color: '#9aa5b4' }}>
          {getIcon(field.icon)}
        </span>
        <textarea
          name={field.key}
          value={value}
          onChange={onChange}
          placeholder={field.placeholder}
          rows={4}
          className="w-full py-[11px] pr-3 pl-9 rounded text-sm font-['DM_Sans',sans-serif] outline-none box-border resize-y leading-[1.6] transition-colors duration-150"
          style={{ background: '#fafbfc', border: '1.5px solid rgba(51,63,54,0.15)', color: 'var(--ew-forest)' }}
          onFocus={e => (e.currentTarget.style.borderColor = 'var(--ew-sky)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(51,63,54,0.15)')}
        />
      </div>
      {field.help_text && (
        <p className="text-xs m-0 leading-[1.5]" style={{ color: '#9aa5b4' }}>{field.help_text}</p>
      )}
    </div>
  )
}

function SelectField({ field, value, onChange, overrideOptions }: {
  field: PoolField
  value: string
  onChange: (val: string) => void
  overrideOptions?: string[]
}) {
  const [open, setOpen] = useState(false)

  // If overrideOptions provided (e.g. US_STATES for state field), use those
  // Otherwise use the field's own options from DB
  const isStringOptions = !!overrideOptions
  const stringOptions = overrideOptions ?? []
  const dbOptions = (field.pool_care_field_options ?? field.pool_filling_field_options ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)

  return (
    <div className="flex flex-col gap-1.5" style={{ position: 'relative' }}>
      <label className="text-[11px] tracking-[0.12em] uppercase font-bold" style={{ color: 'rgba(51,63,54,0.6)' }}>
        {field.label}{field.required && ' *'}
      </label>
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            padding: '11px 12px 11px 36px',
            background: '#fafbfc',
            border: `1.5px solid ${open ? 'var(--ew-sky)' : 'rgba(51,63,54,0.15)'}`,
            borderRadius: 4, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
            color: value ? 'var(--ew-forest)' : '#9aa5b4',
            cursor: 'pointer', textAlign: 'left', outline: 'none',
            boxSizing: 'border-box', transition: 'border-color 0.15s',
          }}
        >
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9aa5b4', display: 'flex', pointerEvents: 'none' }}>
            {getIcon(field.icon)}
          </span>
          {value || field.placeholder || `Select ${field.label.toLowerCase()}…`}
          <span style={{ marginLeft: 'auto', fontSize: 11, color: '#9aa5b4', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▾</span>
        </button>

        {open && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setOpen(false)} />
            <div style={{
              position: 'absolute', bottom: 'calc(100% + 4px)', left: 0, right: 0,
              background: 'var(--ew-bg)', border: '1.5px solid var(--ew-sky)', borderRadius: 6,
              boxShadow: '0 -8px 24px rgba(27,110,180,0.12), 0 -2px 8px rgba(0,0,0,0.08)',
              zIndex: 50, maxHeight: 220, overflowY: 'auto', scrollbarWidth: 'thin',
            }}>
              {isStringOptions
                ? stringOptions.map(s => (
                  <div
                    key={s}
                    onClick={() => { onChange(s); setOpen(false) }}
                    style={{
                      padding: '9px 14px', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                      color: s === value ? '#fff' : 'var(--ew-forest)',
                      background: s === value ? 'var(--ew-sky)' : 'transparent',
                      cursor: 'pointer', transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => { if (s !== value) (e.currentTarget as HTMLElement).style.background = 'rgba(27,110,180,0.08)' }}
                    onMouseLeave={e => { if (s !== value) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                  >
                    {s}
                  </div>
                ))
                : dbOptions.map(opt => (
                  <div
                    key={opt.id}
                    onClick={() => { onChange(opt.value); setOpen(false) }}
                    style={{
                      padding: '9px 14px', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                      color: opt.value === value ? '#fff' : 'var(--ew-forest)',
                      background: opt.value === value ? 'var(--ew-sky)' : 'transparent',
                      cursor: 'pointer', transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => { if (opt.value !== value) (e.currentTarget as HTMLElement).style.background = 'rgba(27,110,180,0.08)' }}
                    onMouseLeave={e => { if (opt.value !== value) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                  >
                    {opt.label}
                  </div>
                ))
              }
            </div>
          </>
        )}
      </div>
      {field.help_text && (
        <p className="text-xs m-0 leading-[1.5]" style={{ color: '#9aa5b4' }}>{field.help_text}</p>
      )}
    </div>
  )
}

// ── Dynamic field renderer ───────────────────────────────────
function DynamicField({ field, value, onChange, onSelectChange }: {
  field: PoolField
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSelectChange: (key: string, val: string) => void
}) {
  if (field.type === 'textarea') {
    return (
      <TextareaField
        field={field}
        value={value}
        onChange={onChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void}
      />
    )
  }

  if (field.type === 'select') {
    // Detect state field by key — inject US_STATES
    const isStateField = field.key === 'state'
    return (
      <SelectField
        field={field}
        value={value}
        onChange={val => onSelectChange(field.key, val)}
        overrideOptions={isStateField ? US_STATES : undefined}
      />
    )
  }

  return (
    <InputField
      field={field}
      value={value}
      onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
    />
  )
}

// ── Static components ────────────────────────────────────────
function TrustBar() {
  return (
    <div className="px-[52px] py-2.5 flex gap-7 flex-wrap" style={{ background: 'rgba(51,63,54,0.92)' }}>
      {['Licensed & insured', '4.9 stars · 900+ reviews', 'Certified pool technicians', 'Same-week availability'].map(t => (
        <div key={t} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--ew-leaf)' }} />{t}
        </div>
      ))}
    </div>
  )
}

function SubHeader({ onBack, title, accentColor }: { onBack: () => void; title: string; accentColor?: string }) {
  return (
    <div
      className="px-[52px] py-5 flex items-center gap-4"
      style={{ background: 'var(--ew-forest)', borderBottom: `3px solid ${accentColor ?? 'var(--ew-sky)'}` }}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-[12px] tracking-[0.1em] uppercase font-['DM_Sans',sans-serif] p-0"
        style={{ color: 'rgba(255,255,255,0.5)' }}
      >
        <ChevronLeft size={14} /> Back
      </button>
      <div className="w-px h-[18px]" style={{ background: 'rgba(255,255,255,0.15)' }} />
      <img src="/10.png" alt="Pool services logo" className="h-8 w-auto shrink-0" />
      <div>
        <p className="text-[10px] tracking-[0.18em] uppercase font-medium m-0" style={{ color: 'rgba(140,199,196,0.7)' }}>
          Pool Services
        </p>
        <h1 className="font-['Playfair_Display',Georgia,serif] text-[1.4rem] font-extrabold mt-0.5 mb-0 tracking-[-0.02em]" style={{ color: '#ffffff' }}>
          {title}
        </h1>
      </div>
    </div>
  )
}

// ── Root page ────────────────────────────────────────────────
export default function PoolPage({
  careFields,
  fillingFields,
  pricingMap,
}: {
  careFields: PoolField[]
  fillingFields: PoolField[]
  pricingMap: Record<string, number>
}) {
  const [view, setView] = useState<View>('choose')
  return (
    <main className="min-h-screen font-['DM_Sans',sans-serif] pt-[72px]" style={{ background: 'var(--ew-bg)' }}>
      {view === 'choose' && <ChooseService onSelect={setView} />}
      {view === 'care'   && <CareForm fields={careFields} onBack={() => setView('choose')} />}
      {view === 'water'  && <WaterFillForm fields={fillingFields} pricingMap={pricingMap} onBack={() => setView('choose')} />}
    </main>
  )
}

// ── Choose service ───────────────────────────────────────────
function ChooseService({ onSelect }: { onSelect: (v: View) => void }) {
  return (
    <>
      <div
        className="px-[52px] py-14 relative overflow-hidden"
        style={{ background: 'var(--ew-forest)', borderBottom: '3px solid var(--ew-sky)' }}
      >
        <div className="absolute right-20 top-10 w-[220px] h-[220px] rounded-full pointer-events-none" style={{ border: '1px solid rgba(75,118,22,0.15)' }} />
        <div className="absolute right-10 top-0 w-[320px] h-[320px] rounded-full pointer-events-none" style={{ border: '1px solid rgba(75,118,22,0.08)' }} />
        <div className="mb-6 relative z-10">
          <img src="/10.png" alt="Pool services logo" className="h-10 w-auto" />
        </div>
        <p className="text-[11px] tracking-[0.2em] uppercase font-semibold mb-3.5" style={{ color: 'var(--ew-leaf)' }}>
          Pool Services
        </p>
        <h1
          className="font-['Playfair_Display',Georgia,serif] text-[clamp(2rem,4.5vw,3.4rem)] font-extrabold leading-[1.1] tracking-[-0.03em] m-0"
          style={{ color: '#ffffff' }}
        >
          Crystal Clear,{' '}<em className="italic" style={{ color: 'var(--ew-sky)' }}>All Season.</em>
        </h1>
        <p className="mt-4 text-[15px] max-w-[460px] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Weekly care and balancing that keeps your pool flawless year-round. Choose the service you need below.
        </p>
      </div>
      <TrustBar />
      <div className="max-w-[820px] mx-auto px-6 pt-12 pb-20">
        <p className="text-[11px] tracking-[0.18em] uppercase font-semibold mb-6" style={{ color: '#9aa5b4' }}>
          Choose your service
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
          {[
            {
              id: 'care' as View,
              title: 'Pool Service & Care',
              desc: 'Regular maintenance, chemical balancing, cleaning, and equipment checks to keep your pool in perfect condition.',
              img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&q=80',
              accent: 'var(--ew-leaf)',
              gradientColor: 'rgba(75,118,22,0.13)',
            },
            {
              id: 'water' as View,
              title: 'Water Pool Filling',
              desc: "Fast, professional pool filling service. Tell us your pool size and location — we'll get back to you with pricing in minutes.",
              img: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=600&q=80',
              accent: 'var(--ew-sky)',
              gradientColor: 'rgba(27,110,180,0.13)',
            },
          ].map(card => (
            <div
              key={card.id}
              onClick={() => onSelect(card.id)}
              className="rounded-[10px] overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-[3px]"
              style={{ border: '1px solid rgba(51,63,54,0.12)', background: 'var(--ew-bg)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = card.accent as string }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(51,63,54,0.12)' }}
            >
              <div className="h-[190px] bg-cover bg-center relative" style={{ backgroundImage: `url('${card.img}')` }}>
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${card.gradientColor} 0%, transparent 60%)` }} />
              </div>
              <div className="p-[20px_22px_24px]">
                <h3 className="font-['Playfair_Display',Georgia,serif] text-[1.15rem] font-bold m-0 mb-2" style={{ color: 'var(--ew-forest)' }}>
                  {card.title}
                </h3>
                <p className="text-[13px] leading-[1.6] m-0 mb-4" style={{ color: 'rgba(51,63,54,0.6)' }}>
                  {card.desc}
                </p>
                <div className="inline-flex items-center gap-1.5 text-[12px] font-bold tracking-[0.1em] uppercase" style={{ color: card.accent as string }}>
                  Select <ArrowRight size={12} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// ── Care form ────────────────────────────────────────────────
function CareForm({ fields, onBack }: { fields: PoolField[]; onBack: () => void }) {
  const [formValues, setFormValues] = useState<Record<string, string>>(
    () => Object.fromEntries(fields.map(f => [f.key, '']))
  )
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormValues(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSelectChange = (key: string, val: string) =>
    setFormValues(prev => ({ ...prev, [key]: val }))

  const handleSubmit = async () => {
    const missingRequired = fields.filter(f => f.required && !formValues[f.key]?.trim())
    if (missingRequired.length > 0) {
      setError(`Please fill in: ${missingRequired.map(f => f.label).join(', ')}`)
      return
    }
    setLoading(true)
    setError(null)
    const result = await submitPoolCareQuote(formValues)
    setLoading(false)
    if (result.success) setSubmitted(true)
    else setError(result.error ?? 'Something went wrong.')
  }

  const resetForm = () => {
    setSubmitted(false)
    setFormValues(Object.fromEntries(fields.map(f => [f.key, ''])))
  }

  return (
    <div>
      <SubHeader onBack={onBack} title="Pool Service & Care" />
      <TrustBar />
      <div className="max-w-[760px] mx-auto px-6 pt-10 pb-20">
        <div className="rounded-[6px] overflow-hidden" style={{ background: 'var(--ew-bg)', border: '1px solid rgba(51,63,54,0.12)' }}>
          <div className="px-7 py-4 flex items-center justify-between" style={{ background: 'var(--ew-forest)' }}>
            <h2 className="text-base font-bold m-0" style={{ color: '#ffffff' }}>Get your free quote</h2>
            <span className="text-[11px] font-extrabold px-2.5 py-[3px] rounded-[3px] tracking-[0.07em]" style={{ background: 'var(--ew-leaf)', color: '#ffffff' }}>
              FREE
            </span>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center gap-4 px-7 py-16 text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(75,118,22,0.1)' }}>
                <CheckCircle size={28} strokeWidth={1.8} style={{ color: 'var(--ew-leaf)' }} />
              </div>
              <h2 className="font-['Playfair_Display',Georgia,serif] text-[1.7rem] font-bold m-0" style={{ color: 'var(--ew-forest)' }}>
                You're all set!
              </h2>
              <p className="text-sm max-w-[400px] leading-[1.7]" style={{ color: 'rgba(51,63,54,0.6)' }}>
                You'll receive pricing at <strong style={{ color: 'var(--ew-forest)' }}>{formValues['email']}</strong> within <strong>5–10 minutes</strong>.
              </p>
              <button
                onClick={resetForm}
                className="px-6 py-2.5 rounded text-[13px] cursor-pointer font-['DM_Sans',sans-serif]"
                style={{ border: '1.5px solid rgba(51,63,54,0.15)', background: 'var(--ew-bg)', color: 'rgba(51,63,54,0.7)' }}
              >
                Submit another
              </button>
            </div>
          ) : (
            <div className="p-7 flex flex-col gap-4">
              {fields.map(field => (
                <DynamicField
                  key={field.id}
                  field={field}
                  value={formValues[field.key] ?? ''}
                  onChange={handleChange}
                  onSelectChange={handleSelectChange}
                />
              ))}
              <hr className="border-none h-px my-1" style={{ background: 'rgba(51,63,54,0.08)' }} />
              {error && (
                <div className="rounded px-4 py-3 text-sm" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c' }}>
                  {error}
                </div>
              )}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-[15px] px-8 border-none rounded text-[15px] font-extrabold tracking-[0.03em] font-['DM_Sans',sans-serif] cursor-pointer transition-opacity duration-200 w-full disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: 'var(--ew-forest)', color: '#ffffff' }}
                onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = 'var(--ew-sky)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--ew-forest)' }}
              >
                {loading ? 'Submitting...' : <> Get My Free Quote <ArrowRight size={15} /> </>}
              </button>
              <p className="text-xs text-center leading-[1.5]" style={{ color: '#9aa5b4' }}>
                You'll receive pricing by email within 5–10 minutes.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { icon: <ShieldCheck size={18} strokeWidth={1.8} />, title: 'Certified technicians', sub: 'All staff are pool-certified & background checked' },
            { icon: <Clock size={18} strokeWidth={1.8} />, title: 'Weekly scheduling', sub: 'Consistent visits, same day every week' },
            { icon: <Droplets size={18} strokeWidth={1.8} />, title: 'Chemical guarantee', sub: 'Perfect balance or we come back — free' },
          ].map(({ icon, title, sub }) => (
            <div key={title} className="rounded-[6px] p-4 text-center" style={{ background: 'var(--ew-bg)', border: '1px solid rgba(51,63,54,0.12)' }}>
              <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center mx-auto mb-2.5" style={{ background: 'rgba(75,118,22,0.1)', color: 'var(--ew-forest)' }}>
                {icon}
              </div>
              <p className="text-[13px] font-bold mb-1" style={{ color: 'var(--ew-forest)' }}>{title}</p>
              <p className="text-xs leading-[1.5]" style={{ color: 'rgba(51,63,54,0.55)' }}>{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Water fill form ──────────────────────────────────────────
function WaterFillForm({ fields, pricingMap, onBack }: {
  fields: PoolField[]
  pricingMap: Record<string, number>
  onBack: () => void
}) {
  const [formValues, setFormValues] = useState<Record<string, string>>(
    () => Object.fromEntries(fields.map(f => [f.key, '']))
  )
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormValues(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSelectChange = (key: string, val: string) =>
    setFormValues(prev => ({ ...prev, [key]: val }))

  // Live price calculation — detect by key
  const selectedState  = formValues['state'] ?? ''
  const gallonsNum     = parseFloat(formValues['gallons'] ?? '') || 0
  const pricePerGallon = selectedState ? (pricingMap[selectedState] ?? null) : null
  const estimatedTotal = pricePerGallon && gallonsNum > 0 ? pricePerGallon * gallonsNum : null

  const handleSubmit = async () => {
    const missingRequired = fields.filter(f => f.required && !formValues[f.key]?.trim())
    if (missingRequired.length > 0) {
      setError(`Please fill in: ${missingRequired.map(f => f.label).join(', ')}`)
      return
    }
    setLoading(true)
    setError(null)
    const result = await submitPoolFillingQuote(formValues, estimatedTotal ?? null)
    setLoading(false)
    if (result.success) setSubmitted(true)
    else setError(result.error ?? 'Something went wrong.')
  }

  const resetForm = () => {
    setSubmitted(false)
    setFormValues(Object.fromEntries(fields.map(f => [f.key, ''])))
  }

  if (submitted) {
    return (
      <div>
        <SubHeader onBack={onBack} title="Water Pool Filling" accentColor="var(--ew-sky)" />
        <div className="max-w-[520px] mx-auto mt-[72px] px-6 pb-20">
          <div className="rounded-[10px] overflow-hidden text-center" style={{ background: 'var(--ew-bg)', border: '1px solid rgba(51,63,54,0.12)' }}>
            <div className="h-1.5" style={{ background: 'var(--ew-sky)' }} />
            <div className="px-9 py-14 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(27,110,180,0.1)' }}>
                <CheckCircle size={30} strokeWidth={1.7} style={{ color: 'var(--ew-sky)' }} />
              </div>
              <h2 className="font-['Playfair_Display',Georgia,serif] text-[1.8rem] font-bold m-0" style={{ color: 'var(--ew-forest)' }}>
                We'll be right back to you!
              </h2>
              <p className="text-[14px] leading-[1.75] m-0 max-w-[360px]" style={{ color: 'rgba(51,63,54,0.6)' }}>
                Your water filling request has been received. Expect a call or text within{' '}
                <strong style={{ color: 'var(--ew-forest)' }}>5 minutes</strong>.
              </p>
              <div
                className="mt-3 w-full rounded-[6px] px-5 py-4 text-left flex flex-col gap-2"
                style={{ background: 'rgba(27,110,180,0.06)', border: '1px solid rgba(27,110,180,0.2)' }}
              >
                <p className="text-[11px] tracking-[0.12em] uppercase font-bold m-0" style={{ color: 'var(--ew-sky)' }}>
                  Request summary
                </p>
                <p className="text-[13px] m-0" style={{ color: 'rgba(51,63,54,0.7)' }}>
                  <span className="font-semibold" style={{ color: 'var(--ew-forest)' }}>
                    {formValues['first_name']} {formValues['last_name']}
                  </span>
                  {formValues['street'] && ` · ${formValues['street']}`}
                  {formValues['city'] && `, ${formValues['city']}`}
                  {formValues['state'] && `, ${formValues['state']}`}
                  {formValues['zip_code'] && ` ${formValues['zip_code']}`}
                </p>
                {formValues['gallons'] && (
                  <p className="text-[13px] m-0" style={{ color: 'rgba(51,63,54,0.7)' }}>
                    Pool volume:{' '}
                    <span className="font-semibold" style={{ color: 'var(--ew-forest)' }}>
                      {Number(formValues['gallons']).toLocaleString()} gallons
                    </span>
                  </p>
                )}
                {estimatedTotal && (
                  <p className="text-[13px] m-0" style={{ color: 'rgba(51,63,54,0.7)' }}>
                    Estimated total:{' '}
                    <span className="font-semibold" style={{ color: 'var(--ew-forest)' }}>
                      ${estimatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </p>
                )}
              </div>
              <button
                onClick={resetForm}
                className="mt-2 px-6 py-2.5 rounded text-[13px] cursor-pointer font-['DM_Sans',sans-serif]"
                style={{ border: '1.5px solid rgba(51,63,54,0.15)', background: 'var(--ew-bg)', color: 'rgba(51,63,54,0.7)' }}
              >
                Submit another request
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <SubHeader onBack={onBack} title="Water Pool Filling" accentColor="var(--ew-sky)" />
      <div className="max-w-[680px] mx-auto px-6 pt-10 pb-20">
        <div className="rounded-[6px] overflow-hidden" style={{ background: 'var(--ew-bg)', border: '1px solid rgba(51,63,54,0.12)' }}>
          <div className="px-7 py-4 flex items-center justify-between" style={{ background: 'var(--ew-forest)' }}>
            <h2 className="text-base font-bold m-0" style={{ color: '#ffffff' }}>Request water filling</h2>
            <span className="text-[11px] font-extrabold px-2.5 py-[3px] rounded-[3px] tracking-[0.07em]" style={{ background: 'var(--ew-sky)', color: '#ffffff' }}>
              FREE QUOTE
            </span>
          </div>

          <div className="p-7 flex flex-col gap-4">
            {fields.map(field => (
              <div key={field.id}>
                <DynamicField
                  field={field}
                  value={formValues[field.key] ?? ''}
                  onChange={handleChange}
                  onSelectChange={handleSelectChange}
                />

                {/* Live price — inject right after gallons field */}
                {field.key === 'gallons' && selectedState && gallonsNum > 0 && (
                  <div
                    className="rounded-[6px] px-5 py-4 flex items-center justify-between gap-4 mt-3"
                    style={{
                      background: estimatedTotal ? 'rgba(27,110,180,0.06)' : 'rgba(51,63,54,0.04)',
                      border: `1px solid ${estimatedTotal ? 'rgba(27,110,180,0.2)' : 'rgba(51,63,54,0.1)'}`,
                    }}
                  >
                    <div>
                      <p className="text-[10px] tracking-[0.12em] uppercase font-bold m-0 mb-0.5" style={{ color: estimatedTotal ? 'var(--ew-sky)' : '#9aa5b4' }}>
                        Estimated total
                      </p>
                      <p className="text-xs m-0" style={{ color: 'rgba(51,63,54,0.5)' }}>
                        {estimatedTotal
                          ? `${gallonsNum.toLocaleString()} gal × $${pricePerGallon?.toFixed(4)}/gal`
                          : `Service not yet priced for ${selectedState}`
                        }
                      </p>
                    </div>
                    <p
                      className="font-['Playfair_Display',serif] text-[1.6rem] font-bold m-0 shrink-0"
                      style={{ color: estimatedTotal ? 'var(--ew-forest)' : '#9aa5b4' }}
                    >
                      {estimatedTotal
                        ? `$${estimatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : '—'
                      }
                    </p>
                  </div>
                )}
              </div>
            ))}

            <hr className="border-none h-px my-1" style={{ background: 'rgba(51,63,54,0.08)' }} />

            {error && (
              <div className="rounded px-4 py-3 text-sm" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c' }}>
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-[15px] px-8 rounded text-[15px] font-extrabold tracking-[0.03em] font-['DM_Sans',sans-serif] w-full border-none transition-all duration-200"
              style={{
                background: !loading ? 'var(--ew-sky)' : 'rgba(51,63,54,0.15)',
                color: !loading ? '#fff' : 'rgba(51,63,54,0.4)',
                cursor: !loading ? 'pointer' : 'not-allowed',
              }}
            >
              {loading ? 'Submitting...' : <> Get My Free Quote <ArrowRight size={15} /> </>}
            </button>
            <p className="text-xs text-center leading-[1.5]" style={{ color: '#9aa5b4' }}>
              We'll reach out within <strong>5 minutes</strong> with pricing and availability.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { icon: <Clock size={18} strokeWidth={1.8} />, title: '5-min response', sub: "We'll call or text you with a quote right away" },
            { icon: <Droplets size={18} strokeWidth={1.8} />, title: 'Clean, treated water', sub: 'Properly balanced for your pool chemistry' },
            { icon: <ShieldCheck size={18} strokeWidth={1.8} />, title: 'Licensed & insured', sub: 'Professional filling with zero mess' },
          ].map(({ icon, title, sub }) => (
            <div key={title} className="rounded-[6px] p-4 text-center" style={{ background: 'var(--ew-bg)', border: '1px solid rgba(51,63,54,0.12)' }}>
              <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center mx-auto mb-2.5" style={{ background: 'rgba(27,110,180,0.1)', color: 'var(--ew-forest)' }}>
                {icon}
              </div>
              <p className="text-[13px] font-bold mb-1" style={{ color: 'var(--ew-forest)' }}>{title}</p>
              <p className="text-xs leading-[1.5]" style={{ color: 'rgba(51,63,54,0.55)' }}>{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}