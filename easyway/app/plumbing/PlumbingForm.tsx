'use client'

import { useState } from 'react'
import * as Icons from 'lucide-react'
import { ArrowRight, CheckCircle, ShieldCheck, Star, Clock } from 'lucide-react'
import { submitPlumbingQuote } from './actions'
import type { PlumbingField } from '@/types/plumbing'

function getIcon(name: string, size = 15) {
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[name]
  return Icon ? <Icon size={size} /> : <Icons.FileText size={size} />
}

export default function PlumbingForm({ fields }: { fields: PlumbingField[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>(
    Object.fromEntries(fields.map(f => [f.key, '']))
  )
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (key: string, value: string) =>
    setAnswers(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async () => {
    const missing = fields.find(f => f.required && !answers[f.key]?.trim())
    if (missing) {
      setError(`Please fill in "${missing.label}"`)
      return
    }
    setLoading(true)
    setError(null)
    const result = await submitPlumbingQuote({ answers })
    setLoading(false)
    if (result.success) setSubmitted(true)
    else setError(result.error)
  }

  return (
    <main className="min-h-screen font-['DM_Sans',sans-serif] pt-[72px]" style={{ background: 'var(--ew-bg)' }}>
      {/* Hero */}
      <div
        className="px-4 sm:px-8 lg:px-[52px] pt-14 pb-12"
        style={{ background: 'var(--ew-forest)', borderBottom: '3px solid var(--ew-sky)' }}
      >
        <div className="mb-6">
          <img src="/14.png" alt="Plumbing services logo" className="h-10 w-auto" />
        </div>
        <p className="text-[11px] tracking-[0.2em] uppercase font-semibold mb-3.5" style={{ color: 'var(--ew-leaf)' }}>
          Plumbing Services
        </p>
        <h1
          className="font-['Playfair_Display',Georgia,serif] text-[clamp(2rem,4.5vw,3.4rem)] font-extrabold leading-[1.1] tracking-[-0.03em] m-0"
          style={{ color: '#ffffff' }}
        >
          Fixed Fast,{' '}
          <em className="italic" style={{ color: 'var(--ew-sky)' }}>Done Right.</em>
        </h1>
        <p className="mt-4 text-[15px] max-w-[480px] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.6)' }}>
          From leaky faucets to full pipe replacements — reliable plumbing you can count on.
        </p>
      </div>

      {/* Trust bar */}
      <div className="px-4 sm:px-8 lg:px-[52px] py-2.5 flex gap-5 sm:gap-7 flex-wrap" style={{ background: 'rgba(51,63,54,0.92)' }}>
        {['Licensed & insured', '4.9 stars · 2,100+ reviews', 'BBB accredited', 'Same-day availability'].map(t => (
          <div key={t} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--ew-leaf)' }} />
            {t}
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 pt-10 pb-20">
        <div className="rounded-[6px] overflow-hidden" style={{ background: 'var(--ew-bg)', border: '1px solid rgba(51,63,54,0.12)' }}>
          <div className="px-7 py-4 flex items-center justify-between" style={{ background: 'var(--ew-forest)' }}>
            <h2 className="text-base font-bold text-white m-0">Get your free quote</h2>
            <span
              className="text-[11px] font-extrabold px-2.5 py-[3px] rounded-[3px] tracking-[0.07em]"
              style={{ background: 'var(--ew-leaf)', color: '#ffffff' }}
            >
              FREE
            </span>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center gap-4 px-7 py-16 text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(75,118,22,0.1)' }}>
                <CheckCircle size={28} strokeWidth={1.8} style={{ color: 'var(--ew-leaf)' }} />
              </div>
              <h2 className="font-['Playfair_Display',Georgia,serif] text-[1.7rem] font-bold m-0" style={{ color: 'var(--ew-forest)' }}>
                Request received!
              </h2>
              <p className="text-sm max-w-[380px] leading-[1.7]" style={{ color: 'rgba(51,63,54,0.6)' }}>
                We'll review your request and get back to you within 60 minutes during business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false)
                  setAnswers(Object.fromEntries(fields.map(f => [f.key, ''])))
                }}
                className="px-6 py-2.5 rounded text-[13px] cursor-pointer font-['DM_Sans',sans-serif]"
                style={{
                  border: '1.5px solid rgba(51,63,54,0.15)',
                  background: 'var(--ew-bg)',
                  color: 'rgba(51,63,54,0.7)',
                }}
              >
                Submit another
              </button>
            </div>
          ) : (
            <div className="p-5 sm:p-7">
              <div className="flex flex-col gap-4">
                {fields.map(field => (
                  <div key={field.id} className="flex flex-col gap-1.5">
                    <label className="text-[11px] tracking-[0.12em] uppercase font-bold" style={{ color: 'rgba(51,63,54,0.6)' }}>
                      {field.label}{field.required && ' *'}
                    </label>
                    <div className="relative">
                      <span
                        className={`absolute left-3 ${field.type === 'textarea' ? 'top-[13px]' : 'top-1/2 -translate-y-1/2'} pointer-events-none flex`}
                        style={{ color: '#9aa5b4' }}
                      >
                        {getIcon(field.icon)}
                      </span>
                      {field.type === 'textarea' ? (
                        <textarea
                          value={answers[field.key] ?? ''}
                          onChange={e => handleChange(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          rows={4}
                          className="w-full py-[11px] pr-3 pl-9 rounded text-sm font-['DM_Sans',sans-serif] outline-none box-border resize-y leading-[1.6] transition-colors duration-150"
                          style={{ background: '#fafbfc', border: '1.5px solid rgba(51,63,54,0.15)', color: 'var(--ew-forest)' }}
                          onFocus={e => (e.currentTarget.style.borderColor = 'var(--ew-sky)')}
                          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(51,63,54,0.15)')}
                        />
                      ) : field.type === 'select' ? (
                        <select
                          value={answers[field.key] ?? ''}
                          onChange={e => handleChange(field.key, e.target.value)}
                          className="w-full py-[11px] pr-3 pl-9 rounded text-sm font-['DM_Sans',sans-serif] outline-none box-border transition-colors duration-150 cursor-pointer"
                          style={{ background: '#fafbfc', border: '1.5px solid rgba(51,63,54,0.15)', color: 'var(--ew-forest)' }}
                        >
                          <option value="">{field.placeholder || 'Select...'}</option>
                          {field.plumbing_field_options
                            ?.sort((a, b) => a.sort_order - b.sort_order)
                            .map(opt => (
                              <option key={opt.id} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          value={answers[field.key] ?? ''}
                          onChange={e => handleChange(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full py-[11px] pr-3 pl-9 rounded text-sm font-['DM_Sans',sans-serif] outline-none box-border transition-colors duration-150"
                          style={{ background: '#fafbfc', border: '1.5px solid rgba(51,63,54,0.15)', color: 'var(--ew-forest)' }}
                          onFocus={e => (e.currentTarget.style.borderColor = 'var(--ew-sky)')}
                          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(51,63,54,0.15)')}
                        />
                      )}
                    </div>
                    {field.help_text && (
                      <p className="text-xs m-0 leading-[1.5]" style={{ color: '#9aa5b4' }}>{field.help_text}</p>
                    )}
                  </div>
                ))}

                {error && (
                  <div className="rounded px-4 py-3 text-sm" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c' }}>
                    {error}
                  </div>
                )}

                <hr className="border-none h-px my-1" style={{ background: 'rgba(51,63,54,0.08)' }} />

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-[15px] px-8 rounded text-[15px] font-extrabold tracking-[0.03em] font-['DM_Sans',sans-serif] cursor-pointer w-full border-none transition-opacity duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'var(--ew-forest)', color: '#ffffff' }}
                  onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = 'var(--ew-sky)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--ew-forest)' }}
                >
                  {loading ? 'Submitting...' : <> Get My Free Quote <ArrowRight size={15} /> </>}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          {[
            { icon: <ShieldCheck size={18} strokeWidth={1.8} />, title: 'Licensed & insured', sub: 'Full coverage on every job we take' },
            { icon: <Clock size={18} strokeWidth={1.8} />, title: 'Same-day availability', sub: 'Fast scheduling, flexible timing' },
            { icon: <Star size={18} strokeWidth={1.8} />, title: '4.9-star rated', sub: 'Over 2,100 verified customer reviews' },
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
    </main>
  )
}