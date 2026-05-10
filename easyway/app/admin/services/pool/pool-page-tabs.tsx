'use client'

import { useState } from 'react'
import { Waves, Droplets } from 'lucide-react'
import PoolCareFieldsManager from './pool-care-fields-manager'
import PoolFillingManager from './pool-filling-manager'

type Tab = 'care' | 'filling'

export default function PoolPageTabs({
  careFields,
  fillingFields,
  pricing,
}: {
  careFields: any[]
  fillingFields: any[]
  pricing: any[]
}) {
  const [tab, setTab] = useState<Tab>('care')

  return (
    <div className="p-4 md:p-8 font-['DM_Sans',sans-serif]">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1a2e35] m-0">
          Pool Services
        </h1>
        <p className="text-sm text-[#718096] mt-1">
          Manage pool care and water filling form fields, and state pricing.
        </p>
      </div>

      {/* Top-level tabs */}
      <div className="flex gap-1 mb-8 border-b border-[#dde3ea]">
        {([
          { id: 'care',    label: 'Pool Care',     icon: <Waves size={14} /> },
          { id: 'filling', label: 'Water Filling',  icon: <Droplets size={14} /> },
        ] as { id: Tab; label: string; icon: React.ReactNode }[]).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-none cursor-pointer transition-colors rounded-t-lg -mb-px ${
              tab === t.id
                ? 'bg-white border border-[#dde3ea] border-b-white text-[#1a2e35] font-bold shadow-sm'
                : 'bg-transparent text-[#718096] hover:text-[#1a2e35]'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'care' && (
        <PoolCareFieldsManager fields={careFields} />
      )}

      {tab === 'filling' && (
        <PoolFillingManager
          fields={fillingFields}
          pricing={pricing}
        />
      )}
    </div>
  )
}