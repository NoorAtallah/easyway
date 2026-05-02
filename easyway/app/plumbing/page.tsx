'use client'

import { useState } from 'react'
import {
  ArrowRight, MapPin, Building2, Home, Wrench,
  User, Mail, Phone, CheckCircle, ShieldCheck, Star, Clock,
} from 'lucide-react'
import { submitPlumbingQuote } from './actions'
import type { PlumbingQuoteFormData } from '@/types/plumbing'

function Field({
  icon, label, name, value, onChange, placeholder = '', type = 'text',
}: {
  icon: React.ReactNode
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa5b4] pointer-events-none flex">
          {icon}
        </span>
        <input
          type={type} name={name} value={value}
          onChange={onChange} placeholder={placeholder}
          className="w-full py-[11px] pr-3 pl-9 bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-[#1a202c] text-sm font-['DM_Sans',sans-serif] outline-none box-border transition-colors duration-150 focus:border-[#8cc7c4]"
        />
      </div>
    </div>
  )
}

const EMPTY_FORM: PlumbingQuoteFormData = {
  zipCode: '', city: '', address: '', jobDescription: '',
  firstName: '', lastName: '', email: '', phone: '',
}

export default function PlumbingPage() {
  const [form, setForm] = useState<PlumbingQuoteFormData>(EMPTY_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    const result = await submitPlumbingQuote(form)
    setLoading(false)
    if (result.success) {
      setSubmitted(true)
    } else {
      setError(result.error)
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f6f8] font-['DM_Sans',sans-serif] pt-[72px]">

      {/* Hero */}
      <div className="bg-[#1a2e35] px-6 md:px-[52px] pt-14 pb-12 border-b-[3px] border-[#8cc7c4]">
        <p className="text-[11px] tracking-[0.2em] uppercase text-[#8cc7c4] font-semibold mb-3.5">
          Plumbing Services
        </p>
        <h1 className="font-['Playfair_Display',Georgia,serif] text-[clamp(2rem,4.5vw,3.4rem)] font-extrabold text-[#FFF6F6] leading-[1.1] tracking-[-0.03em] m-0">
          Fixed Fast,{' '}
          <em className="italic text-[#8cc7c4]">Done Right.</em>
        </h1>
        <p className="mt-4 text-[15px] text-[#FFF6F6]/60 max-w-[480px] leading-[1.7]">
          From leaky faucets to full pipe replacements — reliable plumbing you can count on.
          Fill in your details and we'll respond with pricing within the hour.
        </p>
      </div>

      {/* Trust bar */}
      <div className="bg-[#152830] px-6 md:px-[52px] py-2.5 flex gap-4 md:gap-7 flex-wrap">
        {['Licensed & insured', '4.9 stars · 2,100+ reviews', 'BBB accredited', 'Same-day availability'].map(t => (
          <div key={t} className="flex items-center gap-1.5 text-xs text-[#FFF6F6]/70 font-medium">
            <div className="w-1.5 h-1.5 bg-[#8cc7c4] rounded-full shrink-0" />
            {t}
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="max-w-[760px] mx-auto px-4 md:px-6 pt-10 pb-20">

        {/* Form card */}
        <div className="bg-white rounded-[6px] border border-[#dde3ea] overflow-hidden">
          <div className="bg-[#1a2e35] px-7 py-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-[#FFF6F6] m-0">Get your free quote</h2>
            <span className="bg-[#8cc7c4] text-[#1a2e35] text-[11px] font-extrabold px-2.5 py-[3px] rounded-[3px] tracking-[0.07em]">
              FREE
            </span>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center gap-4 px-7 py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-[#8cc7c4]/[0.12] flex items-center justify-center">
                <CheckCircle size={28} color="#8cc7c4" strokeWidth={1.8} />
              </div>
              <h2 className="font-['Playfair_Display',Georgia,serif] text-[1.7rem] font-bold text-[#1a2e35] m-0">
                Request received!
              </h2>
              <p className="text-[#718096] text-sm max-w-[380px] leading-[1.7]">
                We'll review your job details and send a quote to{' '}
                <strong className="text-[#1a2e35]">{form.email}</strong>{' '}
                within 60 minutes during business hours.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm(EMPTY_FORM) }}
                className="px-6 py-2.5 border-[1.5px] border-[#dde3ea] rounded bg-white text-[#4a5568] text-[13px] cursor-pointer font-['DM_Sans',sans-serif]"
              >
                Submit another
              </button>
            </div>
          ) : (
            <div className="p-5 md:p-7">
              <div className="flex flex-col gap-4">

                <Field icon={<MapPin size={15} />} label="Job zip code"
                  name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="e.g. 60601" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Field icon={<Building2 size={15} />} label="City"
                    name="city" value={form.city} onChange={handleChange} placeholder="Chicago" />
                  <Field icon={<Home size={15} />} label="Address"
                    name="address" value={form.address} onChange={handleChange} placeholder="123 Main St" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">
                    Job description
                  </label>
                  <div className="relative">
                    <Wrench size={15} className="absolute left-3 top-[13px] text-[#9aa5b4] pointer-events-none" />
                    <textarea
                      name="jobDescription"
                      value={form.jobDescription}
                      onChange={handleChange}
                      placeholder="Describe what you need done — e.g. leaking pipe under kitchen sink, no hot water in shower, toilet keeps running..."
                      rows={4}
                      className="w-full py-[11px] pr-3 pl-9 bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-[#1a202c] text-sm font-['DM_Sans',sans-serif] outline-none box-border resize-y leading-[1.6] transition-colors duration-150 focus:border-[#8cc7c4]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Field icon={<User size={15} />} label="First name"
                    name="firstName" value={form.firstName} onChange={handleChange} placeholder="Jane" />
                  <Field icon={<User size={15} />} label="Last name"
                    name="lastName" value={form.lastName} onChange={handleChange} placeholder="Smith" />
                </div>

                <Field icon={<Mail size={15} />} label="Email" name="email" type="email"
                  value={form.email} onChange={handleChange} placeholder="you@example.com" />

                <Field icon={<Phone size={15} />} label="Phone number" name="phone" type="tel"
                  value={form.phone} onChange={handleChange} placeholder="(773) 000-0000" />

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2">
                    {error}
                  </p>
                )}

                <hr className="border-none border-t border-[#edf0f4] my-1" />

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-[15px] px-8 bg-[#8cc7c4] border-none rounded text-[#1a2e35] text-[15px] font-extrabold tracking-[0.03em] font-['DM_Sans',sans-serif] cursor-pointer transition-colors duration-200 w-full hover:bg-[#6fb8b4] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : <> Get My Free Quote <ArrowRight size={15} /> </>}
                </button>

                <p className="text-xs text-[#9aa5b4] text-center leading-[1.5]">
                  No commitment required. We'll respond within 60 minutes during business hours.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Why us */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          {[
            { icon: <ShieldCheck size={18} color="#1a2e35" strokeWidth={1.8} />, title: 'Licensed & insured', sub: 'Full coverage on every job we take' },
            { icon: <Clock size={18} color="#1a2e35" strokeWidth={1.8} />, title: 'Same-day availability', sub: 'Fast scheduling, flexible timing' },
            { icon: <Star size={18} color="#1a2e35" strokeWidth={1.8} />, title: '4.9-star rated', sub: 'Over 2,100 verified customer reviews' },
          ].map(({ icon, title, sub }) => (
            <div key={title} className="bg-white border border-[#dde3ea] rounded-[6px] p-4 text-center">
              <div className="w-[38px] h-[38px] rounded-full bg-[#8cc7c4]/[0.14] flex items-center justify-center mx-auto mb-2.5">
                {icon}
              </div>
              <p className="text-[13px] font-bold text-[#1a2e35] mb-1">{title}</p>
              <p className="text-xs text-[#718096] leading-[1.5]">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}