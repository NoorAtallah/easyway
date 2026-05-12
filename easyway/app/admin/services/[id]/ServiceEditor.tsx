'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft, Plus, Trash2, ChevronDown,
  ChevronUp, Pencil, Check, X, ToggleLeft, ToggleRight,
} from 'lucide-react'
import {
  updateService, addStep, updateStep, deleteStep, reorderSteps,
  addItem, updateItem, deleteItem, reorderItems,
} from '../actions'

type Item = {
  id: string; key: string; label: string; description: string
  price: number; sort_order: number; is_active: boolean
}
type Step = {
  id: string; type: string; title: string; sub: string
  field: string | null; sort_order: number; is_active: boolean
  cleaning_step_items: Item[]
}
type Service = {
  id: string; key: string; name: string; description: string
  image_url: string; flow_type: 'wizard' | 'quote'; is_active: boolean
  steps: Step[]
}

const STEP_TYPES = ['counter', 'select', 'textarea', 'photo', 'datetime', 'address', 'contact']
const STEP_TYPE_LABELS: Record<string, string> = {
  counter: '🔢 Counter', select: '☑️ Select', textarea: '📝 Text area',
  photo: '📷 Photo upload', datetime: '📅 Date & time', address: '📍 Address', contact: '👤 Contact',
}

function InlineEdit({ value, onSave, className = '', type = 'text' }: {
  value: string; onSave: (v: string) => void; className?: string; type?: string
}) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value)

  if (!editing) return (
    <button
      onClick={() => setEditing(true)}
      className={`group flex items-center gap-1.5 text-left border-none bg-transparent cursor-pointer p-0 ${className}`}
    >
      <span>{value || <span className="text-[#9aa5b4] italic">Click to edit</span>}</span>
      <Pencil size={11} className="text-[#9aa5b4] opacity-0 group-hover:opacity-100 shrink-0" />
    </button>
  )

  return (
    <div className="flex items-center gap-1.5">
      <input
        autoFocus type={type} value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') { onSave(val); setEditing(false) }
          if (e.key === 'Escape') { setVal(value); setEditing(false) }
        }}
        className="border border-[#8cc7c4] rounded px-2 py-1 text-sm outline-none text-[#1a2e35] bg-white"
      />
      <button onClick={() => { onSave(val); setEditing(false) }} className="p-1 text-green-600 border-none bg-transparent cursor-pointer"><Check size={14} /></button>
      <button onClick={() => { setVal(value); setEditing(false) }} className="p-1 text-[#9aa5b4] border-none bg-transparent cursor-pointer"><X size={14} /></button>
    </div>
  )
}

// ── Reorder arrows ────────────────────────────────────────────
function ReorderButtons({ index, total, onMove }: {
  index: number
  total: number
  onMove: (dir: 'up' | 'down') => void
}) {
  return (
    <div className="flex flex-col gap-0.5 items-center text-[#9aa5b4] shrink-0">
      <button
        onClick={() => onMove('up')}
        disabled={index === 0}
        className="hover:text-[#8cc7c4] bg-transparent border-none cursor-pointer p-0 leading-none disabled:opacity-30"
      >▲</button>
      <span className="text-[10px]">{index + 1}</span>
      <button
        onClick={() => onMove('down')}
        disabled={index === total - 1}
        className="hover:text-[#8cc7c4] bg-transparent border-none cursor-pointer p-0 leading-none disabled:opacity-30"
      >▼</button>
    </div>
  )
}

function ItemRow({ item, index, total, onUpdate, onDelete, onMove }: {
  item: Item
  index: number
  total: number
  onUpdate: (id: string, data: Partial<Item>) => void
  onDelete: (id: string) => void
  onMove: (id: string, dir: 'up' | 'down') => void
}) {
  const [isPending, startTransition] = useTransition()

  const save = (field: keyof Item, value: any) => {
    onUpdate(item.id, { [field]: value })
    startTransition(async () => {
      await updateItem(item.id, { [field]: value })
    })
  }

  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 border-b border-[#edf0f4] last:border-0 ${!item.is_active ? 'opacity-40' : ''}`}>
      <ReorderButtons index={index} total={total} onMove={dir => onMove(item.id, dir)} />
      <div className="flex-1 min-w-0 grid grid-cols-[1fr_1fr_80px] gap-3 items-center">
        <InlineEdit
          value={item.label}
          onSave={v => save('label', v)}
          className="text-sm text-[#1a2e35] font-medium"
        />
        <InlineEdit
          value={item.description}
          onSave={v => save('description', v)}
          className="text-xs text-[#718096]"
        />
        <div className="flex items-center gap-1">
          <span className="text-xs text-[#9aa5b4]">$</span>
          <InlineEdit
            value={String(item.price)}
            onSave={v => save('price', parseInt(v) || 0)}
            className="text-sm font-bold text-[#8cc7c4] w-12"
            type="number"
          />
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => save('is_active', !item.is_active)}
          className="p-1 border-none bg-transparent cursor-pointer text-[#718096] hover:text-[#1a2e35]"
        >
          {item.is_active ? <ToggleRight size={16} className="text-[#8cc7c4]" /> : <ToggleLeft size={16} />}
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-1 border-none bg-transparent cursor-pointer text-red-300 hover:text-red-500"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}

function StepCard({ step, index, total, onUpdateStep, onDeleteStep, onMoveStep, onAddItem, onUpdateItem, onDeleteItem, onMoveItem }: {
  step: Step
  index: number
  total: number
  onUpdateStep: (id: string, data: Partial<Step>) => void
  onDeleteStep: (id: string) => void
  onMoveStep: (id: string, dir: 'up' | 'down') => void
  onAddItem: (stepId: string) => void
  onUpdateItem: (id: string, data: Partial<Item>) => void
  onDeleteItem: (id: string) => void
  onMoveItem: (stepId: string, itemId: string, dir: 'up' | 'down') => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [isPending, startTransition] = useTransition()
  const hasItems = ['counter', 'select'].includes(step.type)

  const sortedItems = [...step.cleaning_step_items].sort((a, b) => a.sort_order - b.sort_order)

  const saveStep = (field: keyof Step, value: any) => {
    onUpdateStep(step.id, { [field]: value })
    startTransition(async () => {
      await updateStep(step.id, { [field]: value } as any)
    })
  }

  return (
    <div className={`bg-white border rounded-lg overflow-hidden ${!step.is_active ? 'opacity-50' : 'border-[#dde3ea]'}`}>
      {/* Step header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#fafbfc] border-b border-[#edf0f4]">
        <ReorderButtons index={index} total={total} onMove={dir => onMoveStep(step.id, dir)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-[0.5px] px-2 py-[2px] rounded-full bg-[#8cc7c4]/20 text-[#1a2e35] border border-[#8cc7c4]/30 shrink-0">
              {STEP_TYPE_LABELS[step.type] ?? step.type}
            </span>
            <InlineEdit
              value={step.title}
              onSave={v => saveStep('title', v)}
              className="text-sm font-semibold text-[#1a2e35]"
            />
          </div>
          {step.sub && (
            <InlineEdit
              value={step.sub}
              onSave={v => saveStep('sub', v)}
              className="text-xs text-[#718096] mt-0.5"
            />
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => saveStep('is_active', !step.is_active)}
            className="p-1 border-none bg-transparent cursor-pointer"
          >
            {step.is_active
              ? <ToggleRight size={18} className="text-[#8cc7c4]" />
              : <ToggleLeft size={18} className="text-[#9aa5b4]" />}
          </button>
          {hasItems && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 border-none bg-transparent cursor-pointer text-[#718096] hover:text-[#1a2e35]"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
          <button
            onClick={() => onDeleteStep(step.id)}
            className="p-1 border-none bg-transparent cursor-pointer text-red-300 hover:text-red-500"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Items */}
      {hasItems && expanded && (
        <div>
          <div className="grid grid-cols-[32px_1fr_1fr_80px_60px] gap-3 px-3 py-1.5 bg-[#f9fafb] border-b border-[#edf0f4]">
            <div />
            <span className="text-[10px] uppercase tracking-[0.1em] text-[#9aa5b4] font-bold">Label</span>
            <span className="text-[10px] uppercase tracking-[0.1em] text-[#9aa5b4] font-bold">Description</span>
            <span className="text-[10px] uppercase tracking-[0.1em] text-[#9aa5b4] font-bold">Price</span>
            <div />
          </div>

          {sortedItems.map((item, i) => (
            <ItemRow
              key={item.id}
              item={item}
              index={i}
              total={sortedItems.length}
              onUpdate={onUpdateItem}
              onDelete={onDeleteItem}
              onMove={(itemId, dir) => onMoveItem(step.id, itemId, dir)}
            />
          ))}

          <button
            onClick={() => onAddItem(step.id)}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-[#8cc7c4] font-semibold border-none bg-transparent cursor-pointer hover:bg-[#fafbfc] border-t border-[#edf0f4]"
          >
            <Plus size={13} /> Add item
          </button>
        </div>
      )}
    </div>
  )
}

export default function ServiceEditor({ service: initial }: { service: Service }) {
  const router = useRouter()
  const [service, setService] = useState(initial)
  const [steps, setSteps] = useState(initial.steps)
  const [isPending, startTransition] = useTransition()
  const [showAddStep, setShowAddStep] = useState(false)
  const [newStepType, setNewStepType] = useState('counter')
  const [newStepTitle, setNewStepTitle] = useState('')

  const sortedSteps = [...steps].sort((a, b) => a.sort_order - b.sort_order)

  const saveService = (field: keyof Service, value: any) => {
    setService(p => ({ ...p, [field]: value }))
    startTransition(async () => {
      await updateService(service.id, { [field]: value } as any)
    })
  }

  const handleUpdateStep = (id: string, data: Partial<Step>) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, ...data } : s))
  }

  const handleDeleteStep = (id: string) => {
    if (!confirm('Delete this step and all its items?')) return
    setSteps(prev => prev.filter(s => s.id !== id))
    startTransition(async () => { await deleteStep(id) })
  }

  // Swap sort_order between two steps
  const handleMoveStep = (id: string, dir: 'up' | 'down') => {
    const idx = sortedSteps.findIndex(s => s.id === id)
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sortedSteps.length) return
    const a = sortedSteps[idx]
    const b = sortedSteps[swapIdx]
    setSteps(prev => prev.map(s => {
      if (s.id === a.id) return { ...s, sort_order: b.sort_order }
      if (s.id === b.id) return { ...s, sort_order: a.sort_order }
      return s
    }))
    startTransition(async () => {
      await Promise.all([
        updateStep(a.id, { sort_order: b.sort_order } as any),
        updateStep(b.id, { sort_order: a.sort_order } as any),
      ])
    })
  }

  const handleAddStep = () => {
    if (!newStepTitle.trim() && !['photo', 'datetime', 'address', 'contact'].includes(newStepType)) return
    startTransition(async () => {
      const title = newStepTitle.trim() || STEP_TYPE_LABELS[newStepType]
      const result = await addStep(service.id, { type: newStepType, title })
      if (result.success && result.step) {
        setSteps(prev => [...prev, { ...result.step, cleaning_step_items: [] }])
        setShowAddStep(false)
        setNewStepTitle('')
        setNewStepType('counter')
      }
    })
  }

  const handleAddItem = (stepId: string) => {
    startTransition(async () => {
      const result = await addItem(stepId, {
        key: `item-${Date.now()}`,
        label: 'New item',
        description: '',
        price: 0,
      })
      if (result.success) {
        router.refresh()
      }
    })
  }

  const handleUpdateItem = (id: string, data: Partial<Item>) => {
    setSteps(prev => prev.map(s => ({
      ...s,
      cleaning_step_items: s.cleaning_step_items.map(i => i.id === id ? { ...i, ...data } : i),
    })))
  }

  const handleDeleteItem = (id: string) => {
    setSteps(prev => prev.map(s => ({
      ...s,
      cleaning_step_items: s.cleaning_step_items.filter(i => i.id !== id),
    })))
    startTransition(async () => { await deleteItem(id) })
  }

  // Swap sort_order between two items within a step
  const handleMoveItem = (stepId: string, itemId: string, dir: 'up' | 'down') => {
    const step = steps.find(s => s.id === stepId)
    if (!step) return
    const sorted = [...step.cleaning_step_items].sort((a, b) => a.sort_order - b.sort_order)
    const idx = sorted.findIndex(i => i.id === itemId)
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sorted.length) return
    const a = sorted[idx]
    const b = sorted[swapIdx]
    setSteps(prev => prev.map(s => {
      if (s.id !== stepId) return s
      return {
        ...s,
        cleaning_step_items: s.cleaning_step_items.map(i => {
          if (i.id === a.id) return { ...i, sort_order: b.sort_order }
          if (i.id === b.id) return { ...i, sort_order: a.sort_order }
          return i
        }),
      }
    }))
    startTransition(async () => {
      await Promise.all([
        updateItem(a.id, { sort_order: b.sort_order }),
        updateItem(b.id, { sort_order: a.sort_order }),
      ])
    })
  }

  return (
    <div className="p-4 md:p-8 font-['DM_Sans',sans-serif] max-w-[860px]">
      {/* Back */}
      <button
        onClick={() => router.push('/admin/services')}
        className="flex items-center gap-1.5 text-sm text-[#718096] hover:text-[#1a2e35] border-none bg-transparent cursor-pointer p-0 mb-6"
      >
        <ChevronLeft size={16} /> Back to services
      </button>

      {/* Service meta */}
      <div className="bg-white border border-[#dde3ea] rounded-xl overflow-hidden mb-6">
        <div className="bg-[#1a2e35] px-6 py-4 flex items-center justify-between">
          <h1 className="font-['Playfair_Display',serif] text-xl font-bold text-white m-0">
            {service.name}
          </h1>
          <button
            onClick={() => saveService('is_active', !service.is_active)}
            className="flex items-center gap-2 text-xs font-bold border-none bg-transparent cursor-pointer text-white/70 hover:text-white"
          >
            {service.is_active
              ? <><ToggleRight size={20} className="text-[#8cc7c4]" /> Active</>
              : <><ToggleLeft size={20} /> Hidden</>}
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Service name</label>
            <InlineEdit
              value={service.name}
              onSave={v => saveService('name', v)}
              className="text-sm text-[#1a2e35] font-semibold"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Image URL</label>
            <InlineEdit
              value={service.image_url}
              onSave={v => saveService('image_url', v)}
              className="text-sm text-[#1a2e35]"
            />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Description</label>
            <InlineEdit
              value={service.description}
              onSave={v => saveService('description', v)}
              className="text-sm text-[#718096]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Booking flow</label>
            <div className="flex gap-2">
              {(['wizard', 'quote'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => saveService('flow_type', type)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
                    service.flow_type === type
                      ? 'border-[#8cc7c4] bg-[#8cc7c4]/10 text-[#1a2e35]'
                      : 'border-[#dde3ea] bg-white text-[#718096]'
                  }`}
                >
                  {type === 'wizard' ? '⚡ Wizard' : '📋 Quote form'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-[#1a2e35] m-0">
          Steps <span className="text-[#9aa5b4] font-normal">({steps.length})</span>
        </h2>
        <button
          onClick={() => setShowAddStep(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#8cc7c4] border-none rounded-lg text-xs font-bold text-[#1a2e35] cursor-pointer hover:bg-[#6fb8b4]"
        >
          <Plus size={13} /> Add step
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {sortedSteps.map((step, i) => (
          <StepCard
            key={step.id}
            step={step}
            index={i}
            total={sortedSteps.length}
            onUpdateStep={handleUpdateStep}
            onDeleteStep={handleDeleteStep}
            onMoveStep={handleMoveStep}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onMoveItem={handleMoveItem}
          />
        ))}
      </div>

      {/* Add step modal */}
      {showAddStep && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[200]" onClick={() => setShowAddStep(false)} />
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-[400px] overflow-hidden">
              <div className="bg-[#1a2e35] px-5 py-4">
                <h3 className="font-bold text-white text-sm m-0">Add a step</h3>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Step type</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {STEP_TYPES.map(type => (
                      <button
                        key={type}
                        onClick={() => setNewStepType(type)}
                        className={`px-3 py-2 rounded-lg border text-xs font-medium text-left cursor-pointer transition-colors ${
                          newStepType === type
                            ? 'border-[#8cc7c4] bg-[#8cc7c4]/10 text-[#1a2e35]'
                            : 'border-[#dde3ea] bg-white text-[#718096]'
                        }`}
                      >
                        {STEP_TYPE_LABELS[type]}
                      </button>
                    ))}
                  </div>
                </div>

                {!['photo', 'datetime', 'address', 'contact'].includes(newStepType) && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Step title</label>
                    <input
                      autoFocus
                      value={newStepTitle}
                      onChange={e => setNewStepTitle(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddStep()}
                      placeholder="e.g. Select property size"
                      className="w-full py-[10px] px-3 bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-sm text-[#1a202c] outline-none focus:border-[#8cc7c4]"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddStep(false)}
                    className="flex-1 py-2.5 border border-[#dde3ea] rounded-lg text-sm text-[#718096] cursor-pointer bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddStep}
                    disabled={isPending}
                    className="flex-1 py-2.5 bg-[#8cc7c4] border-none rounded-lg text-sm font-bold text-[#1a2e35] cursor-pointer hover:bg-[#6fb8b4] disabled:opacity-60"
                  >
                    {isPending ? 'Adding...' : 'Add step'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}