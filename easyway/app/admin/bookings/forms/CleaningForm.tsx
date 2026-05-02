'use client'
import { useState, useTransition } from 'react'
import { createAdminBooking } from '../actions'
import { FormInput, FormActions, FormError } from './shared'

export function CleaningForm({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [phone, setPhone]     = useState('')
  const [address, setAddress] = useState('')
  const [serviceName, setServiceName] = useState('')
  const [date, setDate]       = useState('')
  const [time, setTime]       = useState('')
  const [accessNotes, setAccessNotes]   = useState('')
  const [focusAreas, setFocusAreas]     = useState('')
  const [notes, setNotes]               = useState('')
  const [error, setError]               = useState<string | null>(null)
  const [isPending, startTransition]    = useTransition()

  const handleSubmit = () => {
    if (!name || !email || !phone || !serviceName) {
      setError('Please fill in all required fields.')
      return
    }
    setError(null)
    startTransition(async () => {
      const result = await createAdminBooking('cleaning', {
        name, email, phone,
        service_key: 'admin_manual',
        service_name: serviceName,
        line_items: JSON.stringify([]),
        total: '0',
        ...(address.trim()     ? { address }      : {}),
        ...(date.trim()        ? { date }          : {}),
        ...(time.trim()        ? { time }          : {}),
        ...(accessNotes.trim() ? { access_notes: accessNotes } : {}),
        ...(focusAreas.trim()  ? { focus_areas: focusAreas }   : {}),
        ...(notes.trim()       ? { notes }         : {}),
      })
      if (result.success) onSuccess()
      else setError(result.error ?? 'Something went wrong.')
    })
  }

  return (
    <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[70vh]">
      <div>
        <p className="text-[11px] tracking-[0.1em] uppercase text-[#718096] font-bold mb-3">Customer info</p>
        <div className="flex flex-col gap-3">
          <FormInput label="Full name *"  placeholder="Jane Smith"      value={name}  onChange={setName} />
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="Email *"   placeholder="jane@email.com"  value={email} onChange={setEmail} type="email" />
            <FormInput label="Phone *"   placeholder="(555) 000-0000"  value={phone} onChange={setPhone} />
          </div>
        </div>
      </div>

      <div>
        <p className="text-[11px] tracking-[0.1em] uppercase text-[#718096] font-bold mb-3">Service details</p>
        <div className="flex flex-col gap-3">
          <FormInput label="Service name *" placeholder="e.g. Deep Clean, Standard Clean" value={serviceName} onChange={setServiceName} />
          <FormInput label="Address"        placeholder="123 Main St, Chicago IL"          value={address}     onChange={setAddress} />
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="Preferred date" type="date" value={date} onChange={setDate} placeholder="" />
            <FormInput label="Preferred time" type="time" value={time} onChange={setTime} placeholder="" />
          </div>
        </div>
      </div>

      <div>
        <p className="text-[11px] tracking-[0.1em] uppercase text-[#718096] font-bold mb-1.5">
          Access notes <span className="normal-case font-normal text-[#c4cdd6]">(optional)</span>
        </p>
        <textarea
          value={accessNotes} onChange={e => setAccessNotes(e.target.value)} rows={2}
          placeholder="Gate code, key location, parking instructions…"
          className="w-full border border-[#dde3ea] rounded-lg px-3 py-2 text-sm text-[#1a2e35] placeholder:text-[#c4cdd6] focus:outline-none focus:border-[#8cc7c4] focus:ring-2 focus:ring-[#8cc7c4]/20 transition resize-none"
        />
      </div>

      <div>
        <p className="text-[11px] tracking-[0.1em] uppercase text-[#718096] font-bold mb-1.5">
          Focus areas <span className="normal-case font-normal text-[#c4cdd6]">(optional)</span>
        </p>
        <textarea
          value={focusAreas} onChange={e => setFocusAreas(e.target.value)} rows={2}
          placeholder="Kitchen, bathrooms, carpet stains…"
          className="w-full border border-[#dde3ea] rounded-lg px-3 py-2 text-sm text-[#1a2e35] placeholder:text-[#c4cdd6] focus:outline-none focus:border-[#8cc7c4] focus:ring-2 focus:ring-[#8cc7c4]/20 transition resize-none"
        />
      </div>

      <div>
        <p className="text-[11px] tracking-[0.1em] uppercase text-[#718096] font-bold mb-1.5">
          Internal notes <span className="normal-case font-normal text-[#c4cdd6]">(optional)</span>
        </p>
        <textarea
          value={notes} onChange={e => setNotes(e.target.value)} rows={2}
          placeholder="Any additional info noted from the call…"
          className="w-full border border-[#dde3ea] rounded-lg px-3 py-2 text-sm text-[#1a2e35] placeholder:text-[#c4cdd6] focus:outline-none focus:border-[#8cc7c4] focus:ring-2 focus:ring-[#8cc7c4]/20 transition resize-none"
        />
      </div>

      <FormError message={error} />
      <FormActions onBack={onBack} onSubmit={handleSubmit} isPending={isPending} />
    </div>
  )
}