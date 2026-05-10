'use client'

import { useState } from 'react'
import { Sparkles, Truck, Wrench, Trees, Waves } from 'lucide-react'
import ServicesGrid from './ServicesGrid'
import MovingItemsManager from './MovingItemsManager'
import PlumbingFieldsManager from './PlumbingFieldsManager'
import LandscapingFieldsManager from './LandscapingFieldsManager'
import PoolPageTabs from './pool/pool-page-tabs'
import type { PlumbingField } from '@/types/plumbing'
import type { LandscapingField } from '@/types/landscaping'

type Service = {
  id: string; key: string; name: string; description: string
  image_url: string; flow_type: 'wizard' | 'quote'
  is_active: boolean; sort_order: number
}

type MovingItem = {
  id: string; section: string; name: string; cuft: number
  image_url: string | null; sort_order: number; is_active: boolean
}

type StatePricingRow = {
  state: string; price_per_gallon: number; is_active: boolean
}

type TabId = 'cleaning' | 'moving' | 'plumbing' | 'landscaping' | 'pool'

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'cleaning',    label: 'Cleaning Services', icon: <Sparkles size={15} /> },
  { id: 'moving',      label: 'Moving Items',      icon: <Truck size={15} /> },
  { id: 'plumbing',    label: 'Plumbing Form',     icon: <Wrench size={15} /> },
  { id: 'landscaping', label: 'Landscaping Form',  icon: <Trees size={15} /> },
  { id: 'pool',        label: 'Pool Services',     icon: <Waves size={15} /> },
]

export default function ServicesTabs({
  services,
  movingItems,
  plumbingFields,
  landscapingFields,
  poolCareFields,
  poolFillingFields,
  poolPricing,
}: {
  services: Service[]
  movingItems: MovingItem[]
  plumbingFields: PlumbingField[]
  landscapingFields: LandscapingField[]
  poolCareFields: any[]
  poolFillingFields: any[]
  poolPricing: StatePricingRow[]
}) {
  const [activeTab, setActiveTab] = useState<TabId>('cleaning')

  return (
    <div className="font-['DM_Sans',sans-serif]">
      <div className="flex gap-1 border-b border-[#dde3ea] px-4 md:px-8 pt-6 overflow-x-auto">
        {TABS.map(({ id, label, icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm border-none bg-transparent cursor-pointer whitespace-nowrap transition-colors relative
                ${isActive ? 'text-[#1a2e35] font-semibold' : 'text-[#718096] font-normal hover:text-[#1a2e35]'}`}
            >
              {icon}
              {label}
              {isActive && <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#8cc7c4]" />}
            </button>
          )
        })}
      </div>

      {activeTab === 'cleaning'    && <ServicesGrid services={services} />}
      {activeTab === 'moving'      && <MovingItemsManager items={movingItems} />}
      {activeTab === 'plumbing'    && <PlumbingFieldsManager fields={plumbingFields} />}
      {activeTab === 'landscaping' && <LandscapingFieldsManager fields={landscapingFields} />}
      {activeTab === 'pool'        && (
        <PoolPageTabs
          careFields={poolCareFields}
          fillingFields={poolFillingFields}
          pricing={poolPricing}
        />
      )}
    </div>
  )
}