'use client'

import { useState } from 'react'
import { Sparkles, Truck } from 'lucide-react'
import ServicesGrid from './ServicesGrid'
import MovingItemsManager from './MovingItemsManager'

type Service = {
  id: string; key: string; name: string; description: string
  image_url: string; flow_type: 'wizard' | 'quote'
  is_active: boolean; sort_order: number
}

type MovingItem = {
  id: string; section: string; name: string; cuft: number
  image_url: string | null; sort_order: number; is_active: boolean
}

type TabId = 'cleaning' | 'moving'

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'cleaning', label: 'Cleaning Services', icon: <Sparkles size={15} /> },
  { id: 'moving',   label: 'Moving Items',      icon: <Truck size={15} /> },
]

export default function ServicesTabs({
  services,
  movingItems,
}: {
  services: Service[]
  movingItems: MovingItem[]
}) {
  const [activeTab, setActiveTab] = useState<TabId>('cleaning')

  return (
    <div className="font-['DM_Sans',sans-serif]">
      {/* Tab bar */}
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
              {isActive && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#8cc7c4]" />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'cleaning' && <ServicesGrid services={services} />}
      {activeTab === 'moving'   && <MovingItemsManager items={movingItems} />}
    </div>
  )
}