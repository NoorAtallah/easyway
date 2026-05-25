'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Eye, EyeOff, Wand2 } from 'lucide-react'
import { createService, updateService, deleteService } from './actions'

type Service = {
  id: string
  key: string
  name: string
  description: string
  image_url: string
  flow_type: 'wizard' | 'quote'
  is_active: boolean
  sort_order: number
}

function Badge({ active }: { active: boolean }) {
  return (
    <span className={`text-[10px] font-bold uppercase tracking-[0.5px] px-2 py-[3px] rounded-full border ${
      active
        ? 'bg-green-100 text-green-700 border-green-200'
        : 'bg-gray-100 text-gray-400 border-gray-200'
    }`}>
      {active ? 'Active' : 'Hidden'}
    </span>
  )
}

function FlowBadge({ type }: { type: 'wizard' | 'quote' }) {
  return (
    <span className={`text-[10px] font-bold uppercase tracking-[0.5px] px-2 py-[3px] rounded-full border ${
      type === 'wizard'
        ? 'bg-[#8cc7c4]/20 text-[#1a2e35] border-[#8cc7c4]/40'
        : 'bg-blue-50 text-blue-600 border-blue-200'
    }`}>
      {type === 'wizard' ? '⚡ Wizard' : '📋 Quote'}
    </span>
  )
}

function CreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    image_url: '',
    flow_type: 'wizard' as 'wizard' | 'quote',
  })
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = () => {
    if (!form.name.trim()) return setError('Name is required')
    startTransition(async () => {
      const result = await createService(form)
      if (result.success) {
        onCreated()
        onClose()
      } else {
        setError(result.error ?? 'Failed to create')
      }
    })
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[200]" onClick={onClose} />
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-[480px] overflow-hidden">
          <div className="bg-[#1a2e35] px-6 py-4">
            <h2 className="font-['Playfair_Display',serif] text-lg font-bold text-white m-0">
              New cleaning service
            </h2>
          </div>
          <div className="p-6 flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Service name *</label>
              <input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Window Cleaning"
                className="w-full py-[10px] px-3 bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-sm text-[#1a202c] outline-none focus:border-[#8cc7c4]"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Short description shown on the service selection grid"
                rows={3}
                className="w-full py-[10px] px-3 bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-sm text-[#1a202c] outline-none focus:border-[#8cc7c4] resize-none"
              />
            </div>

            {/* Image URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Image URL</label>
              <input
                value={form.image_url}
                onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))}
                placeholder="https://images.unsplash.com/..."
                className="w-full py-[10px] px-3 bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-sm text-[#1a202c] outline-none focus:border-[#8cc7c4]"
              />
            </div>

            {/* Flow type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Booking flow</label>
              <div className="grid grid-cols-2 gap-2">
                {(['wizard', 'quote'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setForm(p => ({ ...p, flow_type: type }))}
                    className={`py-3 px-4 rounded-lg border-[1.5px] text-sm font-medium text-left transition-colors cursor-pointer ${
                      form.flow_type === type
                        ? 'border-[#8cc7c4] bg-[#8cc7c4]/10 text-[#1a2e35]'
                        : 'border-[#dde3ea] bg-white text-[#718096]'
                    }`}
                  >
                    <div className="font-bold">{type === 'wizard' ? '⚡ Wizard' : '📋 Quote form'}</div>
                    <div className="text-xs mt-0.5 opacity-70">
                      {type === 'wizard' ? 'Multi-step with pricing' : 'Simple contact form'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>
            )}

            <div className="flex gap-2 pt-1">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 border border-[#dde3ea] rounded-lg text-sm text-[#718096] cursor-pointer bg-white hover:bg-[#fafbfc]"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="flex-1 py-2.5 bg-[#8cc7c4] border-none rounded-lg text-sm font-bold text-[#1a2e35] cursor-pointer hover:bg-[#6fb8b4] disabled:opacity-60"
              >
                {isPending ? 'Creating...' : 'Create service'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function ServicesGrid({ services: initial }: { services: Service[] }) {
  const router = useRouter()
  const [services, setServices] = useState(initial)
  const [showCreate, setShowCreate] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleToggleActive = (id: string, current: boolean) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, is_active: !current } : s))
    startTransition(async () => {
  await updateService(id, { is_active: !current })
  router.refresh()  // add this
    })
  }

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This will remove all its steps and items. This cannot be undone.`)) return
    setDeletingId(id)
    startTransition(async () => {
      const result = await deleteService(id)
      if (result.success) {
        setServices(prev => prev.filter(s => s.id !== id))
      } else {
        alert(result.error ?? 'Failed to delete')
      }
      setDeletingId(null)
    })
  }

  return (
    <>
      <div className="p-4 md:p-8 font-['DM_Sans',sans-serif]">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8 mt">
          <div>
            <h1 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1a2e35] m-0">
              Cleaning Services
            </h1>
            <p className="text-sm text-[#718096] mt-1">
              Manage services, steps, and pricing shown on the booking page.
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#8cc7c4] border-none rounded-lg text-sm font-bold text-[#1a2e35] cursor-pointer hover:bg-[#6fb8b4] whitespace-nowrap shrink-0"
          >
            <Plus size={16} /> New service
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services.map(s => (
            <div
              key={s.id}
              className={`bg-white border rounded-xl overflow-hidden transition-all ${
                s.is_active ? 'border-[#dde3ea]' : 'border-[#edf0f4] opacity-60'
              }`}
            >
              {/* Image */}
              <div
                className="h-[130px] bg-cover bg-center relative"
                style={{ backgroundImage: s.image_url ? `url('${s.image_url}')` : undefined, backgroundColor: s.image_url ? undefined : '#f4f6f8' }}
              >
                {!s.image_url && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Wand2 size={32} className="text-[#dde3ea]" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge active={s.is_active} />
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-['Playfair_Display',serif] text-sm font-bold text-[#1a2e35] leading-snug m-0">
                    {s.name}
                  </h3>
                </div>
                <FlowBadge type={s.flow_type} />
                {s.description && (
                  <p className="text-xs text-[#718096] mt-2 leading-relaxed line-clamp-2">{s.description}</p>
                )}

                {/* Actions */}
                <div className="flex gap-1.5 mt-3 pt-3 border-t border-[#edf0f4]">
                  <button
                    onClick={() => router.push(`/admin/services/${s.id}`)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#1a2e35] bg-[#f4f6f8] hover:bg-[#edf0f4] rounded-md border-none cursor-pointer flex-1 justify-center"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleToggleActive(s.id, s.is_active)}
                    title={s.is_active ? 'Hide from public' : 'Show on public page'}
                    className="p-1.5 text-[#718096] hover:text-[#1a2e35] bg-[#f4f6f8] hover:bg-[#edf0f4] rounded-md border-none cursor-pointer"
                  >
                    {s.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    onClick={() => handleDelete(s.id, s.name)}
                    disabled={deletingId === s.id}
                    title="Delete service"
                    className="p-1.5 text-red-400 hover:text-red-600 bg-[#f4f6f8] hover:bg-red-50 rounded-md border-none cursor-pointer disabled:opacity-40"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onCreated={() => router.refresh()}
        />
      )}
    </>
  )
}