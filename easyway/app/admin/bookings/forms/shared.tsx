import { ChevronLeft } from 'lucide-react'

export function FormInput({
  label, value, onChange, placeholder = '', type = 'text',
}: {
  label: string; value: string
  onChange: (v: string) => void
  placeholder?: string; type?: string
}) {
  return (
    <div>
      <p className="text-xs text-[#9aa5b4] mb-1">{label}</p>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-[#dde3ea] rounded-lg px-3 py-2 text-sm text-[#1a2e35] placeholder:text-[#c4cdd6] focus:outline-none focus:border-[#8cc7c4] focus:ring-2 focus:ring-[#8cc7c4]/20 transition"
      />
    </div>
  )
}

export function FormSelect({
  label, value, onChange, options,
}: {
  label: string; value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <div>
      <p className="text-xs text-[#9aa5b4] mb-1">{label}</p>
      <select
        value={value} onChange={e => onChange(e.target.value)}
        className="w-full border border-[#dde3ea] rounded-lg px-3 py-2 text-sm text-[#1a2e35] focus:outline-none focus:border-[#8cc7c4] focus:ring-2 focus:ring-[#8cc7c4]/20 transition bg-white appearance-none"
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  )
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
      {message}
    </p>
  )
}

export function FormActions({
  onBack, onSubmit, isPending,
}: {
  onBack: () => void
  onSubmit: () => void
  isPending: boolean
}) {
  return (
    <div className="flex items-center justify-between pt-2 border-t border-[#edf0f4]">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-[#718096] hover:text-[#1a2e35] border-none bg-transparent cursor-pointer"
      >
        <ChevronLeft size={15} /> Change service
      </button>
      <button
        onClick={onSubmit} disabled={isPending}
        className="flex items-center gap-2 bg-[#1a2e35] hover:bg-[#243d47] text-white text-sm font-semibold px-5 py-2.5 rounded-lg border-none cursor-pointer transition disabled:opacity-50"
      >
        {isPending ? 'Creating…' : 'Create booking'}
      </button>
    </div>
  )
}