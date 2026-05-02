'use client'
import { useState, useTransition } from 'react'
import { createPortal } from 'react-dom'
import { X, Plus, Trash2, Mail, CheckCircle2 } from 'lucide-react'
import { sendBookingEmail } from './actions'

type LineItem = { id: string; label: string; price: string }

type BaseQuote = {
  id: string
  email: string
  status: string
  created_at: string
}

// Each service passes its own shape — we normalize it here
type EmailModalProps = {
  quote: BaseQuote
  customerName: string   // "Jane Smith" or quote.name
  serviceType: string    // "Landscaping", "Plumbing", "Cleaning"
  jobDetails: string     // job_size_label, job_description, service_name
  address?: string
  date?: string
  // Cleaning passes its own line_items pre-filled
  initialLineItems?: LineItem[]
  onClose: () => void
}

function genId() {
  return Math.random().toString(36).slice(2, 8)
}

export function EmailModal({
  quote, customerName, serviceType, jobDetails,
  address, date, initialLineItems = [], onClose,
}: EmailModalProps) {
  const [message, setMessage]     = useState('')
  const [lineItems, setLineItems] = useState<LineItem[]>(initialLineItems)
  const [isPending, startTransition] = useTransition()
  const [done, setDone]           = useState(false)
  const [error, setError]         = useState<string | null>(null)

  const addItem = () =>
    setLineItems(prev => [...prev, { id: genId(), label: '', price: '' }])

  const updateItem = (id: string, field: 'label' | 'price', value: string) =>
    setLineItems(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l))

  const removeItem = (id: string) =>
    setLineItems(prev => prev.filter(l => l.id !== id))

  const total = lineItems.reduce((s, l) => s + (parseFloat(l.price) || 0), 0)

  const handleSend = () => {
    setError(null)
    const validItems = lineItems.filter(l => l.label.trim() && l.price.trim())

    startTransition(async () => {
      const result = await sendBookingEmail({
        to:            quote.email,
        customerName,
        serviceType,
        jobDetails,
        address,
        date,
        lineItems:     validItems.map(l => ({ label: l.label, price: parseFloat(l.price) || 0 })),
        customMessage: message.trim() || undefined,
        referenceId:   quote.id,
      })
      if (result.success) setDone(true)
      else setError(result.error ?? 'Failed to send.')
    })
  }

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/40 z-[200] backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-[580px] pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#dde3ea]">
            <div>
              <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1a2e35] m-0">
                {done ? 'Email sent' : 'Send booking confirmation'}
              </h2>
              {!done && (
                <p className="text-xs text-[#9aa5b4] mt-0.5">
                  To: <span className="font-medium text-[#4a5568]">{customerName}</span>
                  <span className="text-[#c4cdd6] mx-1.5">·</span>
                  {quote.email}
                </p>
              )}
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded border-none bg-transparent cursor-pointer">
              <X size={18} className="text-[#4a5568]" />
            </button>
          </div>

          {done ? (
            <div className="p-10 flex flex-col items-center gap-3 text-center">
              <CheckCircle2 size={48} className="text-[#8cc7c4]" />
              <p className="font-semibold text-[#1a2e35]">Email sent successfully</p>
              <p className="text-sm text-[#718096]">
                Confirmation sent to <span className="font-medium text-[#1a2e35]">{quote.email}</span>
              </p>
              <button
                onClick={onClose}
                className="mt-2 text-sm font-semibold text-white bg-[#1a2e35] px-6 py-2.5 rounded-lg border-none cursor-pointer hover:bg-[#243d47] transition"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[75vh]">

              {/* Booking summary — read only */}
              <div className="bg-[#fafbfc] border border-[#edf0f4] rounded-lg px-4 py-3 flex flex-col gap-1.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9aa5b4] mb-0.5">Booking summary</p>
                <div className="flex justify-between text-xs">
                  <span className="text-[#718096]">Service</span>
                  <span className="font-medium text-[#1a2e35]">{serviceType}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#718096]">Details</span>
                  <span className="font-medium text-[#1a2e35] text-right max-w-[60%] truncate">{jobDetails}</span>
                </div>
                {address && (
                  <div className="flex justify-between text-xs">
                    <span className="text-[#718096]">Address</span>
                    <span className="font-medium text-[#1a2e35]">{address}</span>
                  </div>
                )}
                {date && (
                  <div className="flex justify-between text-xs">
                    <span className="text-[#718096]">Date</span>
                    <span className="font-medium text-[#1a2e35]">{date}</span>
                  </div>
                )}
              </div>

              {/* Custom message */}
              <div>
                <p className="text-[11px] tracking-[0.1em] uppercase text-[#718096] font-bold mb-1.5">
                  Personal message <span className="normal-case font-normal text-[#c4cdd6]">(optional)</span>
                </p>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Hi Jane, just confirming your booking — we'll have a team out on Thursday. Feel free to call us if anything changes."
                  className="w-full border border-[#dde3ea] rounded-lg px-3 py-2.5 text-sm text-[#1a2e35] placeholder:text-[#c4cdd6] focus:outline-none focus:border-[#8cc7c4] focus:ring-2 focus:ring-[#8cc7c4]/20 transition resize-none"
                />
              </div>

              {/* Line items / receipt builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] tracking-[0.1em] uppercase text-[#718096] font-bold">
                    Price breakdown <span className="normal-case font-normal text-[#c4cdd6]">(optional)</span>
                  </p>
                  <button
                    onClick={addItem}
                    className="flex items-center gap-1 text-xs font-semibold text-[#8cc7c4] hover:text-[#4a9e9b] border-none bg-transparent cursor-pointer"
                  >
                    <Plus size={13} /> Add item
                  </button>
                </div>

                {lineItems.length === 0 ? (
                  <button
                    onClick={addItem}
                    className="w-full border-2 border-dashed border-[#dde3ea] rounded-lg py-4 text-xs text-[#9aa5b4] hover:border-[#8cc7c4] hover:text-[#8cc7c4] transition cursor-pointer bg-transparent flex items-center justify-center gap-2"
                  >
                    <Plus size={13} /> Click to add line items
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    {/* Column headers */}
                    <div className="grid grid-cols-[1fr_100px_32px] gap-2 px-1">
                      <p className="text-[10px] uppercase tracking-[0.08em] text-[#9aa5b4] font-bold m-0">Description</p>
                      <p className="text-[10px] uppercase tracking-[0.08em] text-[#9aa5b4] font-bold m-0">Price ($)</p>
                      <span />
                    </div>

                    {lineItems.map(item => (
                      <div key={item.id} className="grid grid-cols-[1fr_100px_32px] gap-2 items-center">
                        <input
                          value={item.label}
                          onChange={e => updateItem(item.id, 'label', e.target.value)}
                          placeholder="e.g. Labour"
                          className="border border-[#dde3ea] rounded-lg px-3 py-2 text-sm text-[#1a2e35] placeholder:text-[#c4cdd6] focus:outline-none focus:border-[#8cc7c4] focus:ring-2 focus:ring-[#8cc7c4]/20 transition"
                        />
                        <input
                          value={item.price}
                          onChange={e => updateItem(item.id, 'price', e.target.value)}
                          placeholder="0.00"
                          type="number"
                          min="0"
                          className="border border-[#dde3ea] rounded-lg px-3 py-2 text-sm text-[#1a2e35] placeholder:text-[#c4cdd6] focus:outline-none focus:border-[#8cc7c4] focus:ring-2 focus:ring-[#8cc7c4]/20 transition"
                        />
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 border-none bg-transparent cursor-pointer text-[#c4cdd6] hover:text-red-400 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}

                    {/* Total */}
                    <div className="flex justify-between items-center bg-[#fafbfc] border border-[#edf0f4] rounded-lg px-3 py-2.5 mt-1">
                      <span className="text-xs font-bold text-[#1a2e35] uppercase tracking-[0.08em]">Total</span>
                      <span className="text-base font-extrabold text-[#8cc7c4]">${total.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              {/* Send button */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#edf0f4]">
                <button
                  onClick={onClose}
                  className="text-sm text-[#718096] hover:text-[#1a2e35] border-none bg-transparent cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={isPending}
                  className="flex items-center gap-2 bg-[#1a2e35] hover:bg-[#243d47] text-white text-sm font-semibold px-5 py-2.5 rounded-lg border-none cursor-pointer transition disabled:opacity-50"
                >
                  <Mail size={14} />
                  {isPending ? 'Sending…' : 'Send email'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  )
}