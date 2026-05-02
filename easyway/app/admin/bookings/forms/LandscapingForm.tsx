'use client'
import { useState, useTransition } from 'react'
import { ChevronLeft } from 'lucide-react'
import { createAdminBooking } from '../actions'
import { FormInput, FormSelect, FormActions, FormError, } from './shared'

const JOB_SIZES = ['Small', 'Medium', 'Large', 'Extra Large']

export function LandscapingForm({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [email, setEmail]         = useState('')
  const [phone, setPhone]         = useState('')
  const [address, setAddress]     = useState('')
  const [city, setCity]           = useState('')
  const [zip, setZip]             = useState('')
  const [jobSize, setJobSize]     = useState(JOB_SIZES[0])
  const [notes, setNotes]         = useState('')
  const [error, setError]         = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = () => {
    if (!firstName || !lastName || !email || !phone || !address || !city || !zip) {
      setError('Please fill in all required fields.')
      return
    }
    setError(null)
    startTransition(async () => {
      const result = await createAdminBooking('landscaping', {
        first_name: firstName, last_name: lastName,
        email, phone, address, city, zip_code: zip,
        job_size_label: jobSize,
        ...(notes.trim() ? { notes } : {}),
      })
      if (result.success) onSuccess()
      else setError(result.error ?? 'Something went wrong.')
    })
  }

  return (
    <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[70vh]">
      <div>
        <p className="text-[11px] tracking-[0.1em] uppercase text-[#718096] font-bold mb-3">Customer info</p>
        <div className="grid grid-cols-2 gap-3">
          <FormInput label="First name *" placeholder="Jane"           value={firstName} onChange={setFirstName} />
          <FormInput label="Last name *"  placeholder="Smith"          value={lastName}  onChange={setLastName} />
          <FormInput label="Email *"      placeholder="jane@email.com" value={email}     onChange={setEmail} type="email" />
          <FormInput label="Phone *"      placeholder="(555) 000-0000" value={phone}     onChange={setPhone} />
        </div>
      </div>

      <div>
        <p className="text-[11px] tracking-[0.1em] uppercase text-[#718096] font-bold mb-3">Service location</p>
        <div className="flex flex-col gap-3">
          <FormInput label="Address *" placeholder="123 Main St" value={address} onChange={setAddress} />
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="City *"     placeholder="Chicago" value={city} onChange={setCity} />
            <FormInput label="ZIP code *" placeholder="60601"   value={zip}  onChange={setZip} />
          </div>
        </div>
      </div>

      <div>
        <p className="text-[11px] tracking-[0.1em] uppercase text-[#718096] font-bold mb-3">Job details</p>
        <FormSelect label="Job size" value={jobSize} onChange={setJobSize} options={JOB_SIZES} />
      </div>

      <div>
        <p className="text-[11px] tracking-[0.1em] uppercase text-[#718096] font-bold mb-1.5">
          Notes <span className="normal-case font-normal text-[#c4cdd6]">(optional)</span>
        </p>
        <textarea
          value={notes} onChange={e => setNotes(e.target.value)} rows={3}
          placeholder="Any additional info noted from the call…"
          className="w-full border border-[#dde3ea] rounded-lg px-3 py-2 text-sm text-[#1a2e35] placeholder:text-[#c4cdd6] focus:outline-none focus:border-[#8cc7c4] focus:ring-2 focus:ring-[#8cc7c4]/20 transition resize-none"
        />
      </div>

      <FormError message={error} />
      <FormActions onBack={onBack} onSubmit={handleSubmit} isPending={isPending} />
    </div>
  )
}