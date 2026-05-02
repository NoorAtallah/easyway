'use client'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Leaf, Package, Sparkles, Waves, Wrench, CheckCircle2 } from 'lucide-react'
import { LandscapingForm }    from './forms/LandscapingForm'
import { PlumbingForm }       from './forms/PlumbingForm'
import { CleaningForm }       from './forms/CleaningForm'

type ServiceType = 'landscaping' | 'moving' | 'cleaning' | 'pool_maintenance' | 'plumbing'

const SERVICE_LABELS: Record<ServiceType, string> = {
  landscaping: 'Landscaping', moving: 'Moving', cleaning: 'Cleaning',
  pool_maintenance: 'Pool Maintenance', plumbing: 'Plumbing',
}

const SERVICE_ICONS: Record<ServiceType, React.ReactNode> = {
  landscaping:      <Leaf size={24} />,
  moving:           <Package size={24} />,
  cleaning:         <Sparkles size={24} />,
  pool_maintenance: <Waves size={24} />,
  plumbing:         <Wrench size={24} />,
}

function ServicePicker({ onSelect }: { onSelect: (s: ServiceType) => void }) {
  return (
    <div className="p-6">
      <p className="text-sm text-[#718096] mb-4">Select the service type for this booking.</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {(Object.keys(SERVICE_LABELS) as ServiceType[]).map(s => (
          <button key={s} onClick={() => onSelect(s)}
            className="flex flex-col items-center gap-2 p-4 border-2 border-[#dde3ea] rounded-xl hover:border-[#8cc7c4] hover:bg-[#8cc7c4]/5 transition cursor-pointer text-center group"
          >
            <span className="text-[#8cc7c4]">{SERVICE_ICONS[s]}</span>
            <span className="text-xs font-semibold text-[#1a2e35] group-hover:text-[#4a9e9b]">
              {SERVICE_LABELS[s]}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function NewBookingModal({ onClose }: { onClose: () => void }) {
  const [service, setService] = useState<ServiceType | null>(null)
  const [done, setDone] = useState(false)

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/40 z-[200] backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-[560px] pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#dde3ea]">
            <div>
              <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1a2e35] m-0">
                {done ? 'Booking created' : service ? `New ${SERVICE_LABELS[service]} booking` : 'New booking'}
              </h2>
              {!done && (
                <p className="text-xs text-[#9aa5b4] mt-0.5">
                  {!service ? 'Step 1 of 2 — Choose a service' : 'Step 2 of 2 — Customer details'}
                </p>
              )}
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded border-none bg-transparent cursor-pointer">
              <X size={18} className="text-[#4a5568]" />
            </button>
          </div>

          {/* Body */}
          {done ? (
            <div className="p-8 text-center flex flex-col items-center gap-3">
              <CheckCircle2 size={48} className="text-[#8cc7c4]" />
              <p className="text-[#1a2e35] font-semibold">Booking added successfully</p>
              <p className="text-sm text-[#718096]">
                It will appear in the {service ? SERVICE_LABELS[service] : ''} tab momentarily.
              </p>
              <button onClick={onClose}
                className="mt-2 text-sm font-semibold text-white bg-[#1a2e35] px-6 py-2.5 rounded-lg border-none cursor-pointer hover:bg-[#243d47] transition"
              >
                Done
              </button>
            </div>
          ) : !service ? (
            <ServicePicker onSelect={setService} />
          ) : service === 'landscaping' ? (
            <LandscapingForm onBack={() => setService(null)} onSuccess={() => setDone(true)} />
          ) : service === 'plumbing' ? (
            <PlumbingForm onBack={() => setService(null)} onSuccess={() => setDone(true)} />
          ) : service === 'cleaning' ? (
            <CleaningForm onBack={() => setService(null)} onSuccess={() => setDone(true)} />
          ) : (
            // Moving / Pool Maintenance — not built yet
            <div className="p-8 text-center text-sm text-[#718096]">
              <p>This service form isn't set up yet.</p>
              <button onClick={() => setService(null)} className="mt-3 text-[#8cc7c4] underline cursor-pointer bg-transparent border-none text-sm">
                Go back
              </button>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  )
}