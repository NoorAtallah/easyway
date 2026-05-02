'use client'

import { useState } from 'react'
import {
  ArrowRight, MapPin, Building2, Home, Waves,
  User, Mail, Phone, FileText, ChevronLeft,
  CheckCircle, Droplets, Clock, ShieldCheck, Hash,
} from 'lucide-react'
import { submitPoolCareQuote, submitPoolFillingQuote } from './actions'

type View = 'choose' | 'care' | 'water'

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
]

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
          className="w-full py-[11px] pr-3 pl-9 bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-[#1a202c] text-sm font-['DM_Sans',sans-serif] outline-none box-border transition-colors duration-150 focus:border-[#3b82c4]"
        />
      </div>
    </div>
  )
}

function SelectField({ icon, label, name, value, onChange, options }: {
  icon: React.ReactNode; label: string; name: string; value: string
  onChange: (val: string) => void; options: string[]
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col gap-1.5" style={{ position: 'relative' }}>
      <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">{label}</label>
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            padding: '11px 12px 11px 36px',
            background: '#fafbfc', border: `1.5px solid ${open ? '#3b82c4' : '#dde3ea'}`,
            borderRadius: 4, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
            color: value ? '#1a202c' : '#9aa5b4', cursor: 'pointer',
            textAlign: 'left', outline: 'none', boxSizing: 'border-box',
            transition: 'border-color 0.15s',
          }}
        >
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9aa5b4', display: 'flex', pointerEvents: 'none' }}>{icon}</span>
          {value || 'Select state…'}
          <span style={{ marginLeft: 'auto', fontSize: 11, color: '#9aa5b4', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▾</span>
        </button>
        {open && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setOpen(false)} />
            <div style={{
              position: 'absolute', bottom: 'calc(100% + 4px)', left: 0, right: 0,
              background: '#fff', border: '1.5px solid #3b82c4', borderRadius: 6,
              boxShadow: '0 -8px 24px rgba(59,130,196,0.12), 0 -2px 8px rgba(0,0,0,0.08)',
              zIndex: 50, maxHeight: 220, overflowY: 'auto', scrollbarWidth: 'thin',
            }}>
              {options.map(s => (
                <div
                  key={s}
                  onClick={() => { onChange(s); setOpen(false) }}
                  style={{
                    padding: '9px 14px', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                    color: s === value ? '#fff' : '#1a202c',
                    background: s === value ? '#3b82c4' : 'transparent',
                    cursor: 'pointer', transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => { if (s !== value) (e.currentTarget as HTMLElement).style.background = '#EBF4FF' }}
                  onMouseLeave={e => { if (s !== value) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  {s}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function PoolPage() {
  const [view, setView] = useState<View>('choose')
  return (
    <main className="min-h-screen bg-[#f4f6f8] font-['DM_Sans',sans-serif] pt-[72px]">
      {view === 'choose' && <ChooseService onSelect={setView} />}
      {view === 'care'   && <CareForm     onBack={() => setView('choose')} />}
      {view === 'water'  && <WaterFillForm onBack={() => setView('choose')} />}
    </main>
  )
}

function ChooseService({ onSelect }: { onSelect: (v: View) => void }) {
  return (
    <>
      <div className="bg-[#1a2e35] px-[52px] py-14 border-b-[3px] border-[#8cc7c4] relative overflow-hidden">
        <div className="absolute right-20 top-10 w-[220px] h-[220px] rounded-full border border-[#8cc7c4]/10 pointer-events-none" />
        <div className="absolute right-10 top-0 w-[320px] h-[320px] rounded-full border border-[#8cc7c4]/[0.06] pointer-events-none" />
        <p className="text-[11px] tracking-[0.2em] uppercase text-[#8cc7c4] font-semibold mb-3.5">Pool Services</p>
        <h1 className="font-['Playfair_Display',Georgia,serif] text-[clamp(2rem,4.5vw,3.4rem)] font-extrabold text-[#FFF6F6] leading-[1.1] tracking-[-0.03em] m-0">
          Crystal Clear,{' '}<em className="italic text-[#8cc7c4]">All Season.</em>
        </h1>
        <p className="mt-4 text-[15px] text-[#FFF6F6]/60 max-w-[460px] leading-[1.7]">
          Weekly care and balancing that keeps your pool flawless year-round. Choose the service you need below.
        </p>
      </div>
      <TrustBar />
      <div className="max-w-[820px] mx-auto px-6 pt-12 pb-20">
        <p className="text-[11px] tracking-[0.18em] uppercase text-[#9aa5b4] font-semibold mb-6">Choose your service</p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
          {[
            {
              id: 'care' as View,
              title: 'Pool Service & Care',
              desc: 'Regular maintenance, chemical balancing, cleaning, and equipment checks to keep your pool in perfect condition.',
              img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&q=80',
              accent: '#8cc7c4', gradientColor: '#8cc7c422',
            },
            {
              id: 'water' as View,
              title: 'Water Pool Filling',
              desc: "Fast, professional pool filling service. Tell us your pool size and location — we'll get back to you with pricing in minutes.",
              img: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=600&q=80',
              accent: '#3b82c4', gradientColor: '#3b82c422',
            },
          ].map(card => (
            <div
              key={card.id}
              onClick={() => onSelect(card.id)}
              className="rounded-[10px] overflow-hidden border border-[#dde3ea] bg-white cursor-pointer transition-all duration-200 hover:-translate-y-[3px]"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = card.accent }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#dde3ea' }}
            >
              <div className="h-[190px] bg-cover bg-center relative" style={{ backgroundImage: `url('${card.img}')` }}>
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${card.gradientColor} 0%, transparent 60%)` }} />
              </div>
              <div className="p-[20px_22px_24px]">
                <h3 className="font-['Playfair_Display',Georgia,serif] text-[1.15rem] font-bold text-[#1a2e35] m-0 mb-2">{card.title}</h3>
                <p className="text-[13px] text-[#718096] leading-[1.6] m-0 mb-4">{card.desc}</p>
                <div className="inline-flex items-center gap-1.5 text-[12px] font-bold tracking-[0.1em] uppercase" style={{ color: card.accent }}>
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

function TrustBar() {
  return (
    <div className="bg-[#152830] px-[52px] py-2.5 flex gap-7 flex-wrap">
      {['Licensed & insured', '4.9 stars · 900+ reviews', 'Certified pool technicians', 'Same-week availability'].map(t => (
        <div key={t} className="flex items-center gap-1.5 text-xs text-[#FFF6F6]/70 font-medium">
          <div className="w-1.5 h-1.5 bg-[#8cc7c4] rounded-full shrink-0" />{t}
        </div>
      ))}
    </div>
  )
}

function SubHeader({ onBack, title, accentColor = '#8cc7c4' }: { onBack: () => void; title: string; accentColor?: string }) {
  return (
    <div className="bg-[#1a2e35] px-[52px] py-5 flex items-center gap-4 border-b-[3px]" style={{ borderColor: accentColor }}>
      <button onClick={onBack} className="flex items-center gap-1.5 bg-transparent border-none text-[#FFF6F6]/50 cursor-pointer text-[12px] tracking-[0.1em] uppercase font-['DM_Sans',sans-serif] p-0">
        <ChevronLeft size={14} /> Back
      </button>
      <div className="w-px h-[18px] bg-[#FFF6F6]/15" />
      <div>
        <p className="text-[10px] tracking-[0.18em] uppercase text-[#8cc7c4]/70 font-medium m-0">Pool Services</p>
        <h1 className="font-['Playfair_Display',Georgia,serif] text-[1.4rem] font-extrabold text-[#FFF6F6] mt-0.5 mb-0 tracking-[-0.02em]">{title}</h1>
      </div>
    </div>
  )
}

function CareForm({ onBack }: { onBack: () => void }) {
  const [form, setForm] = useState({
    zipCode: '', city: '', address: '', poolSize: '',
    firstName: '', lastName: '', email: '', phone: '', notes: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    if (!form.zipCode || !form.city || !form.address || !form.firstName || !form.lastName || !form.email || !form.phone) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)
    setError(null)
    const result = await submitPoolCareQuote(form)
    setLoading(false)
    if (result.success) setSubmitted(true)
    else setError(result.error ?? 'Something went wrong.')
  }

  return (
    <div>
      <SubHeader onBack={onBack} title="Pool Service & Care" />
      <TrustBar />
      <div className="max-w-[760px] mx-auto px-6 pt-10 pb-20">
        <div className="bg-white rounded-[6px] border border-[#dde3ea] overflow-hidden">
          <div className="bg-[#1a2e35] px-7 py-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-[#FFF6F6] m-0">Get your free quote</h2>
            <span className="bg-[#8cc7c4] text-[#1a2e35] text-[11px] font-extrabold px-2.5 py-[3px] rounded-[3px] tracking-[0.07em]">FREE</span>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center gap-4 px-7 py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-[#8cc7c4]/[0.12] flex items-center justify-center">
                <CheckCircle size={28} color="#8cc7c4" strokeWidth={1.8} />
              </div>
              <h2 className="font-['Playfair_Display',Georgia,serif] text-[1.7rem] font-bold text-[#1a2e35] m-0">You're all set!</h2>
              <p className="text-[#718096] text-sm max-w-[400px] leading-[1.7]">
                You'll receive pricing at <strong className="text-[#1a2e35]">{form.email}</strong> within <strong>5–10 minutes</strong>.
              </p>
              <button onClick={() => { setSubmitted(false); setForm({ zipCode: '', city: '', address: '', poolSize: '', firstName: '', lastName: '', email: '', phone: '', notes: '' }) }}
                className="px-6 py-2.5 border-[1.5px] border-[#dde3ea] rounded bg-white text-[#4a5568] text-[13px] cursor-pointer font-['DM_Sans',sans-serif]">
                Submit another
              </button>
            </div>
          ) : (
            <div className="p-7">
              <div className="flex flex-col gap-4">
                <Field icon={<MapPin size={15} />} label="Job zip code" name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="e.g. 60601" />
                <div className="grid grid-cols-2 gap-3.5">
                  <Field icon={<Building2 size={15} />} label="City" name="city" value={form.city} onChange={handleChange} placeholder="Chicago" />
                  <Field icon={<Home size={15} />} label="Address" name="address" value={form.address} onChange={handleChange} placeholder="123 Main St" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Field icon={<Waves size={15} />} label="Pool size (gallons)" name="poolSize" type="number" value={form.poolSize} onChange={handleChange} placeholder="e.g. 15,000" />
                  <p className="text-xs text-[#9aa5b4] m-0 leading-[1.5]">Not sure? A typical backyard pool is 10,000–20,000 gallons. We'll confirm on-site.</p>
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  <Field icon={<User size={15} />} label="First name" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Jane" />
                  <Field icon={<User size={15} />} label="Last name" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Smith" />
                </div>
                <Field icon={<Mail size={15} />} label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
                <Field icon={<Phone size={15} />} label="Phone number" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="(773) 000-0000" />
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Tell us what you need done</label>
                  <div className="relative">
                    <FileText size={15} className="absolute left-3 top-[13px] text-[#9aa5b4] pointer-events-none" />
                    <textarea
                      name="notes" value={form.notes} onChange={handleChange}
                      placeholder="e.g. weekly chemical balance, green algae issue, filter cleaning..."
                      rows={4}
                      className="w-full py-[11px] pr-3 pl-9 bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-[#1a202c] text-sm font-['DM_Sans',sans-serif] outline-none box-border resize-y leading-[1.6] transition-colors duration-150 focus:border-[#8cc7c4]"
                    />
                  </div>
                </div>
                <hr className="border-none border-t border-[#edf0f4] my-1" />
                {error && <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-[15px] px-8 bg-[#8cc7c4] border-none rounded text-[#1a2e35] text-[15px] font-extrabold tracking-[0.03em] font-['DM_Sans',sans-serif] cursor-pointer transition-colors duration-200 w-full hover:bg-[#6fb8b4] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : <> Get My Free Quote <ArrowRight size={15} /> </>}
                </button>
                <p className="text-xs text-[#9aa5b4] text-center leading-[1.5]">You'll receive pricing by email within 5–10 minutes.</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { icon: <ShieldCheck size={18} color="#1a2e35" strokeWidth={1.8} />, title: 'Certified technicians', sub: 'All staff are pool-certified & background checked' },
            { icon: <Clock size={18} color="#1a2e35" strokeWidth={1.8} />, title: 'Weekly scheduling', sub: 'Consistent visits, same day every week' },
            { icon: <Droplets size={18} color="#1a2e35" strokeWidth={1.8} />, title: 'Chemical guarantee', sub: 'Perfect balance or we come back — free' },
          ].map(({ icon, title, sub }) => (
            <div key={title} className="bg-white border border-[#dde3ea] rounded-[6px] p-4 text-center">
              <div className="w-[38px] h-[38px] rounded-full bg-[#8cc7c4]/[0.14] flex items-center justify-center mx-auto mb-2.5">{icon}</div>
              <p className="text-[13px] font-bold text-[#1a2e35] mb-1">{title}</p>
              <p className="text-xs text-[#718096] leading-[1.5]">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WaterFillForm({ onBack }: { onBack: () => void }) {
  const [form, setForm] = useState({
    zipCode: '', street: '', city: '', state: '', gallons: '',
    firstName: '', lastName: '', email: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleState = (val: string) => setForm(f => ({ ...f, state: val }))

  const canSubmit = form.zipCode && form.street && form.city && form.state && form.gallons && form.firstName && form.lastName && form.email

  const handleSubmit = async () => {
    if (!canSubmit) return
    setLoading(true)
    setError(null)
    const result = await submitPoolFillingQuote(form)
    setLoading(false)
    if (result.success) setSubmitted(true)
    else setError(result.error ?? 'Something went wrong.')
  }

  if (submitted) {
    return (
      <div>
        <SubHeader onBack={onBack} title="Water Pool Filling" accentColor="#3b82c4" />
        <div className="max-w-[520px] mx-auto mt-[72px] px-6 pb-20">
          <div className="bg-white border border-[#dde3ea] rounded-[10px] overflow-hidden text-center">
            <div className="bg-[#3b82c4] h-1.5" />
            <div className="px-9 py-14 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#EBF4FF] flex items-center justify-center">
                <CheckCircle size={30} color="#3b82c4" strokeWidth={1.7} />
              </div>
              <h2 className="font-['Playfair_Display',Georgia,serif] text-[1.8rem] font-bold text-[#1a2e35] m-0">We'll be right back to you!</h2>
              <p className="text-[14px] text-[#718096] leading-[1.75] m-0 max-w-[360px]">
                Your water filling request has been received. Expect a call or text from our team within <strong className="text-[#1a2e35]">5 minutes</strong>.
              </p>
              <div className="mt-3 w-full bg-[#f4f8ff] border border-[#c5d9f5] rounded-[6px] px-5 py-4 text-left flex flex-col gap-2">
                <p className="text-[11px] tracking-[0.12em] uppercase text-[#3b82c4] font-bold m-0">Request summary</p>
                <p className="text-[13px] text-[#4a5568] m-0">
                  <span className="font-semibold text-[#1a2e35]">{form.firstName} {form.lastName}</span>
                  {' · '}{form.street}, {form.city}, {form.state} {form.zipCode}
                </p>
                <p className="text-[13px] text-[#4a5568] m-0">
                  Pool volume: <span className="font-semibold text-[#1a2e35]">{Number(form.gallons).toLocaleString()} gallons</span>
                </p>
              </div>
              <button
                onClick={() => { setSubmitted(false); setForm({ zipCode: '', street: '', city: '', state: '', gallons: '', firstName: '', lastName: '', email: '' }) }}
                className="mt-2 px-6 py-2.5 border-[1.5px] border-[#dde3ea] rounded bg-white text-[#4a5568] text-[13px] cursor-pointer font-['DM_Sans',sans-serif]"
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
      <SubHeader onBack={onBack} title="Water Pool Filling" accentColor="#3b82c4" />
      <div className="max-w-[680px] mx-auto px-6 pt-10 pb-20">
        <div className="bg-white rounded-[6px] border border-[#dde3ea] overflow-hidden">
          <div className="bg-[#1a2e35] px-7 py-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-[#FFF6F6] m-0">Request water filling</h2>
            <span className="bg-[#3b82c4] text-white text-[11px] font-extrabold px-2.5 py-[3px] rounded-[3px] tracking-[0.07em]">FREE QUOTE</span>
          </div>
          <div className="p-7 flex flex-col gap-4">
            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase text-[#9aa5b4] font-semibold mb-3">Service location</p>
              <div className="flex flex-col gap-3.5">
                <Field icon={<Home size={15} />} label="Street address" name="street" value={form.street} onChange={handleChange} placeholder="123 Main St" />
                <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
                  <Field icon={<Building2 size={15} />} label="City" name="city" value={form.city} onChange={handleChange} placeholder="Chicago" />
                  <SelectField icon={<MapPin size={15} />} label="State" name="state" value={form.state} onChange={handleState} options={US_STATES} />
                  <Field icon={<Hash size={15} />} label="Zip code" name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="60601" />
                </div>
              </div>
            </div>
            <hr className="border-none border-t border-[#edf0f4]" />
            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase text-[#9aa5b4] font-semibold mb-3">Pool details</p>
              <div className="flex flex-col gap-1.5">
                <Field icon={<Waves size={15} />} label="Amount of water needed (gallons)" name="gallons" type="number" value={form.gallons} onChange={handleChange} placeholder="e.g. 15,000" />
                <p className="text-xs text-[#9aa5b4] m-0 leading-[1.5]">Not sure? A typical backyard pool holds 10,000–20,000 gallons.</p>
              </div>
            </div>
            <hr className="border-none border-t border-[#edf0f4]" />
            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase text-[#9aa5b4] font-semibold mb-3">Your info</p>
              <div className="grid grid-cols-2 gap-3.5 mb-3.5">
                <Field icon={<User size={15} />} label="First name" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Jane" />
                <Field icon={<User size={15} />} label="Last name" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Smith" />
              </div>
              <Field icon={<Mail size={15} />} label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </div>
            <hr className="border-none border-t border-[#edf0f4] my-1" />
            {error && <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || loading}
              className="flex items-center justify-center gap-2 py-[15px] px-8 rounded text-[15px] font-extrabold tracking-[0.03em] font-['DM_Sans',sans-serif] w-full border-none transition-all duration-200"
              style={{
                background: canSubmit && !loading ? '#3b82c4' : '#c5d4e0',
                color: canSubmit && !loading ? '#fff' : '#8fa3b0',
                cursor: canSubmit && !loading ? 'pointer' : 'not-allowed',
              }}
            >
              {loading ? 'Submitting...' : <> Get My Free Quote <ArrowRight size={15} /> </>}
            </button>
            <p className="text-xs text-[#9aa5b4] text-center leading-[1.5]">We'll reach out within <strong>5 minutes</strong> with pricing and availability.</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { icon: <Clock size={18} color="#1a2e35" strokeWidth={1.8} />, title: '5-min response', sub: "We'll call or text you with a quote right away" },
            { icon: <Droplets size={18} color="#1a2e35" strokeWidth={1.8} />, title: 'Clean, treated water', sub: 'Properly balanced for your pool chemistry' },
            { icon: <ShieldCheck size={18} color="#1a2e35" strokeWidth={1.8} />, title: 'Licensed & insured', sub: 'Professional filling with zero mess' },
          ].map(({ icon, title, sub }) => (
            <div key={title} className="bg-white border border-[#dde3ea] rounded-[6px] p-4 text-center">
              <div className="w-[38px] h-[38px] rounded-full bg-[#EBF4FF] flex items-center justify-center mx-auto mb-2.5">{icon}</div>
              <p className="text-[13px] font-bold text-[#1a2e35] mb-1">{title}</p>
              <p className="text-xs text-[#718096] leading-[1.5]">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}