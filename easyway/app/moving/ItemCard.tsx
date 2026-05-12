'use client'

import Image from 'next/image'
import { Truck, Plus, Minus } from 'lucide-react'
import type { MovingItem } from '@/types/moving'

export function ItemCard({
  item,
  count,
  onInc,
  onDec,
}: {
  item: MovingItem
  count: number
  onInc: () => void
  onDec: () => void
}) {
  return (
    <div
      className="rounded-xl overflow-hidden transition-[border-color] duration-200"
      style={{
        background: 'var(--ew-bg)',
        border: count > 0
          ? '1.5px solid var(--ew-sky)'
          : '1px solid rgba(51,63,54,0.12)',
      }}
    >
      {/* Image */}
      <div className="relative h-[130px]" style={{ background: 'rgba(51,63,54,0.04)' }}>
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 50vw, 200px"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Truck size={28} style={{ color: 'rgba(51,63,54,0.2)' }} />
          </div>
        )}
        {count > 0 && (
          <div
            className="absolute top-2 right-2 text-xs font-bold w-[22px] h-[22px] rounded-full flex items-center justify-center z-10"
            style={{ background: 'var(--ew-sky)', color: '#ffffff' }}
          >
            {count}
          </div>
        )}
      </div>

      {/* Info + controls */}
      <div className="p-3.5">
        <p className="m-0 mb-0.5 text-sm font-medium" style={{ color: 'var(--ew-forest)' }}>
          {item.name}
        </p>
        <p className="m-0 mb-3 text-xs" style={{ color: '#9aa5b4' }}>
          {item.cuft} cu.ft
        </p>
        <div className="flex items-center justify-between">
          <button
            onClick={onDec}
            className="w-[30px] h-[30px] rounded-md flex items-center justify-center transition-all duration-150"
            style={{
              border: '1px solid rgba(51,63,54,0.15)',
              background: count > 0 ? 'rgba(51,63,54,0.05)' : 'transparent',
              color: count > 0 ? 'var(--ew-forest)' : 'rgba(51,63,54,0.2)',
              cursor: count > 0 ? 'pointer' : 'default',
            }}
          >
            <Minus size={12} />
          </button>
          <span
            className="text-[15px] font-medium min-w-6 text-center transition-colors duration-200"
            style={{ color: count > 0 ? 'var(--ew-sky)' : 'rgba(51,63,54,0.2)' }}
          >
            {count}
          </span>
          <button
            onClick={onInc}
            className="w-[30px] h-[30px] rounded-md flex items-center justify-center cursor-pointer transition-colors duration-150"
            style={{
              border: '1px solid var(--ew-sky)',
              background: 'rgba(27,110,180,0.08)',
              color: 'var(--ew-forest)',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(27,110,180,0.18)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(27,110,180,0.08)')}
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}