'use client'

import { useState, useTransition, useRef } from 'react'
import { Plus, Trash2, Eye, EyeOff, Upload, X, ImageOff, ChevronDown, ChevronRight, Save, Loader2 } from 'lucide-react'
import { createMovingItem, updateMovingItem, deleteMovingItem } from './actions'
import { createClient } from '@/lib/supabase/client'

type MovingItem = {
  id: string
  section: string
  name: string
  cuft: number
  image_url: string | null
  sort_order: number
  is_active: boolean
}

type PendingChange = Partial<{
  name: string
  cuft: number
  image_url: string | null
  is_active: boolean
  sort_order: number
}>

// ── Image upload cell ─────────────────────────────────────────
function ImageUpload({
  item,
  onUploaded,
}: {
  item: MovingItem
  onUploaded: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)

    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${item.id}.${ext}`

    const { error } = await supabase.storage
      .from('moving-items')
      .upload(path, file, { upsert: true })

    if (error) {
      console.error(error)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('moving-items')
      .getPublicUrl(path)

    const bustUrl = `${publicUrl}?t=${Date.now()}`
    await updateMovingItem(item.id, { image_url: bustUrl })
    onUploaded(bustUrl)
    setUploading(false)
  }

  return (
    <div
      className="relative group w-[52px] h-[52px] rounded-lg overflow-hidden border border-[#dde3ea] shrink-0 cursor-pointer"
      onClick={() => inputRef.current?.click()}
    >
      {item.image_url ? (
        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-[#f4f6f8] flex items-center justify-center">
          <ImageOff size={16} className="text-[#dde3ea]" />
        </div>
      )}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        {uploading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Upload size={14} className="text-white" />
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}

// ── Inline editable field ─────────────────────────────────────
function InlineEdit({
  value,
  onSave,
  type = 'text',
  className = '',
  isDirty = false,
}: {
  value: string | number
  onSave: (val: string) => void
  type?: 'text' | 'number'
  className?: string
  isDirty?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(value))

  const commit = () => {
    setEditing(false)
    if (draft !== String(value)) onSave(draft)
  }

  if (editing) {
    return (
      <input
        autoFocus
        type={type}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') setEditing(false)
        }}
        className={`border border-[#8cc7c4] rounded px-2 py-1 text-sm text-[#1a2e35] outline-none bg-white w-full ${className}`}
      />
    )
  }

  return (
    <span
      onClick={() => { setDraft(String(value)); setEditing(true) }}
      className={`cursor-pointer hover:text-[#8cc7c4] transition-colors ${isDirty ? 'text-amber-600' : ''} ${className}`}
    >
      {value}
      {isDirty && <span className="ml-1 text-amber-400 text-[10px]">●</span>}
    </span>
  )
}

// ── Add item modal ────────────────────────────────────────────
function AddItemModal({
  section,
  onClose,
  onAdded,
}: {
  section: string
  onClose: () => void
  onAdded: (item: MovingItem) => void
}) {
  const [form, setForm] = useState({ name: '', cuft: '' })
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = () => {
    if (!form.name.trim()) return setError('Name is required')
    if (!form.cuft || isNaN(Number(form.cuft))) return setError('Valid cu.ft is required')
    startTransition(async () => {
      const result = await createMovingItem({
        section,
        name: form.name.trim(),
        cuft: Number(form.cuft),
        sort_order: 999,
      })
      if (!result.success) return setError(result.error ?? 'Failed')
      onAdded({
        id: result.id!,
        section,
        name: form.name.trim(),
        cuft: Number(form.cuft),
        image_url: null,
        sort_order: 999,
        is_active: true,
      })
      onClose()
    })
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[200]" onClick={onClose} />
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-[400px] overflow-hidden">
          <div className="bg-[#1a2e35] px-6 py-4 flex items-center justify-between">
            <h2 className="font-['Playfair_Display',serif] text-lg font-bold text-white m-0">
              Add item to <em className="italic text-[#8cc7c4]">{section}</em>
            </h2>
            <button onClick={onClose} className="border-none bg-transparent text-white/60 hover:text-white cursor-pointer p-0">
              <X size={18} />
            </button>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Item name *</label>
              <input
                autoFocus
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. King bed"
                className="w-full py-[10px] px-3 bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-sm text-[#1a202c] outline-none focus:border-[#8cc7c4]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Volume (cu.ft) *</label>
              <input
                type="number"
                value={form.cuft}
                onChange={e => setForm(p => ({ ...p, cuft: e.target.value }))}
                placeholder="e.g. 70"
                className="w-full py-[10px] px-3 bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-sm text-[#1a202c] outline-none focus:border-[#8cc7c4]"
              />
            </div>
            {error && <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>}
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
                {isPending ? 'Adding...' : 'Add item'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Add section modal ─────────────────────────────────────────
function AddSectionModal({
  onClose,
  onAdded,
}: {
  onClose: () => void
  onAdded: (name: string) => void
}) {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = () => {
    if (!name.trim()) return setError('Section name is required')
    onAdded(name.trim())
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[200]" onClick={onClose} />
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-[380px] overflow-hidden">
          <div className="bg-[#1a2e35] px-6 py-4 flex items-center justify-between">
            <h2 className="font-['Playfair_Display',serif] text-lg font-bold text-white m-0">New section</h2>
            <button onClick={onClose} className="border-none bg-transparent text-white/60 hover:text-white cursor-pointer p-0">
              <X size={18} />
            </button>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Section name *</label>
              <input
                autoFocus
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="e.g. Garden, Garage, Attic"
                className="w-full py-[10px] px-3 bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-sm text-[#1a202c] outline-none focus:border-[#8cc7c4]"
              />
            </div>
            {error && <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 border border-[#dde3ea] rounded-lg text-sm text-[#718096] cursor-pointer bg-white hover:bg-[#fafbfc]"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2.5 bg-[#8cc7c4] border-none rounded-lg text-sm font-bold text-[#1a2e35] cursor-pointer hover:bg-[#6fb8b4]"
              >
                Add section
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Main component ────────────────────────────────────────────
export default function MovingItemsManager({ items: initialItems }: { items: MovingItem[] }) {
  const [items, setItems] = useState(initialItems)
  const [pendingChanges, setPendingChanges] = useState<Record<string, PendingChange>>({})
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())
  const [addItemSection, setAddItemSection] = useState<string | null>(null)
  const [showAddSection, setShowAddSection] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const hasPendingChanges = Object.keys(pendingChanges).length > 0

  const sections = Array.from(new Set(items.map(i => i.section))).sort()

  // Queue a change instead of saving immediately
  const queueChange = (id: string, change: PendingChange) => {
    setPendingChanges(prev => ({
      ...prev,
      [id]: { ...prev[id], ...change },
    }))
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...change } : i))
  }

  // Swap sort_order between two items within a section
  const moveItem = (sectionItems: MovingItem[], id: string, direction: 'up' | 'down') => {
    const sorted = [...sectionItems].sort((a, b) => a.sort_order - b.sort_order)
    const idx = sorted.findIndex(i => i.id === id)
    if (idx < 0) return
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sorted.length) return
    const a = sorted[idx]
    const b = sorted[swapIdx]
    queueChange(a.id, { sort_order: b.sort_order })
    queueChange(b.id, { sort_order: a.sort_order })
  }

  // Flush all pending changes to DB
  const handleSaveAll = async () => {
    if (!hasPendingChanges) return
    setSaving(true)
    try {
      await Promise.all(
        Object.entries(pendingChanges).map(([id, changes]) =>
          updateMovingItem(id, changes)
        )
      )
      setPendingChanges({})
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  // Discard all pending changes
  const handleDiscardAll = () => {
    setPendingChanges({})
    setItems(initialItems)
  }

  const toggleSection = (s: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev)
      next.has(s) ? next.delete(s) : next.add(s)
      return next
    })
  }

  const handleImageUploaded = (id: string, url: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, image_url: url } : i))
  }

  const handleToggleActive = (id: string, current: boolean) => {
    queueChange(id, { is_active: !current })
  }

  const handleUpdateName = (id: string, name: string) => {
    queueChange(id, { name })
  }

  const handleUpdateCuft = (id: string, cuft: string) => {
    const n = Number(cuft)
    if (isNaN(n)) return
    queueChange(id, { cuft: n })
  }

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setPendingChanges(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setItems(prev => prev.filter(i => i.id !== id))
    startTransition(async () => { await deleteMovingItem(id) })
  }

  const handleAddItem = (item: MovingItem) => {
    setItems(prev => [...prev, item])
  }

  const handleAddSection = (name: string) => {
    setAddItemSection(name)
  }

  return (
    <div className="p-4 md:p-8 font-['DM_Sans',sans-serif]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1a2e35] m-0">
            Moving Items
          </h1>
          <p className="text-sm text-[#718096] mt-1">
            Manage items shown in the moving calculator. Click any name or volume to edit, then save.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAddSection(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#8cc7c4] border-none rounded-lg text-sm font-bold text-[#1a2e35] cursor-pointer hover:bg-[#6fb8b4] whitespace-nowrap"
          >
            <Plus size={16} /> New section
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-4">
        {sections.map(section => {
          const sectionItems = items.filter(i => i.section === section)
          const sortedItems = [...sectionItems].sort((a, b) => a.sort_order - b.sort_order)
          const collapsed = collapsedSections.has(section)
          const activeCount = sectionItems.filter(i => i.is_active).length

          return (
            <div key={section} className="bg-white border border-[#dde3ea] rounded-xl overflow-hidden">
              {/* Section header */}
              <div
                className="flex items-center justify-between px-5 py-3.5 bg-[#fafbfc] border-b border-[#dde3ea] cursor-pointer hover:bg-[#f4f6f8] transition-colors"
                onClick={() => toggleSection(section)}
              >
                <div className="flex items-center gap-3">
                  {collapsed
                    ? <ChevronRight size={16} className="text-[#9aa5b4]" />
                    : <ChevronDown size={16} className="text-[#9aa5b4]" />}
                  <span className="font-['Playfair_Display',serif] font-bold text-[#1a2e35]">{section}</span>
                  <span className="text-xs text-[#9aa5b4]">{activeCount}/{sectionItems.length} active</span>
                  {sectionItems.some(i => pendingChanges[i.id]) && (
                    <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                      unsaved
                    </span>
                  )}
                </div>
                <button
                  onClick={e => { e.stopPropagation(); setAddItemSection(section) }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#8cc7c4] hover:text-[#1a2e35] border border-[#8cc7c4] rounded-lg bg-transparent cursor-pointer transition-colors"
                >
                  <Plus size={12} /> Add item
                </button>
              </div>

              {/* Items table */}
              {!collapsed && (
                <div className="divide-y divide-[#edf0f4]">
                  {/* Table header */}
                  <div className="hidden md:grid grid-cols-[40px_52px_1fr_80px_100px_80px] gap-4 px-5 py-2 text-[10px] uppercase tracking-[0.1em] text-[#9aa5b4] font-bold">
                    <span>Order</span>
                    <span>Image</span>
                    <span>Name</span>
                    <span>Cu.ft</span>
                    <span>Status</span>
                    <span>Actions</span>
                  </div>

                  {sortedItems.length === 0 ? (
                    <div className="px-5 py-8 text-center text-sm text-[#9aa5b4]">
                      No items yet. Click "Add item" to add one.
                    </div>
                  ) : (
                    sortedItems.map((item, i) => {
                      const isDirty = !!pendingChanges[item.id]
                      return (
                        <div
                          key={item.id}
                          className={`grid grid-cols-[52px_1fr] md:grid-cols-[40px_52px_1fr_80px_100px_80px] gap-4 items-center px-5 py-3 transition-colors ${
                            !item.is_active ? 'opacity-50' : ''
                          } ${isDirty ? 'bg-amber-50/40' : ''}`}
                        >
                          {/* Reorder — desktop only */}
                          {/* Reorder — desktop only */}
<div className="hidden md:flex items-center justify-center">
  <input
    type="number"
    min={1}
    value={item.sort_order}
    onChange={e => {
      const val = Number(e.target.value)
      if (isNaN(val) || val < 1) return
      queueChange(item.id, { sort_order: val })
    }}
    className="w-10 text-center text-sm text-[#1a2e35] border border-[#dde3ea] rounded px-1 py-1 outline-none focus:border-[#8cc7c4] bg-white"
  />
</div>

                          {/* Image */}
                          <ImageUpload item={item} onUploaded={url => handleImageUploaded(item.id, url)} />

                          {/* Name */}
                          <div className="flex flex-col gap-0.5">
                            <InlineEdit
                              value={item.name}
                              onSave={val => handleUpdateName(item.id, val)}
                              isDirty={isDirty && 'name' in (pendingChanges[item.id] ?? {})}
                              className="text-sm font-medium text-[#1a2e35]"
                            />
                            <span className="text-xs text-[#9aa5b4] md:hidden">{item.cuft} cu.ft</span>
                          </div>

                          {/* Cu.ft */}
                          <div className="hidden md:block">
                            <InlineEdit
                              value={item.cuft}
                              type="number"
                              onSave={val => handleUpdateCuft(item.id, val)}
                              isDirty={isDirty && 'cuft' in (pendingChanges[item.id] ?? {})}
                              className="text-sm text-[#4a5568]"
                            />
                          </div>

                          {/* Status */}
                          <div className="hidden md:block">
                            <span className={`text-[10px] font-bold uppercase tracking-[0.5px] px-2 py-[3px] rounded-full border ${
                              item.is_active
                                ? 'bg-green-100 text-green-700 border-green-200'
                                : 'bg-gray-100 text-gray-400 border-gray-200'
                            }`}>
                              {item.is_active ? 'Active' : 'Hidden'}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="hidden md:flex items-center gap-1">
                            <button
                              onClick={() => handleToggleActive(item.id, item.is_active)}
                              title={item.is_active ? 'Hide' : 'Show'}
                              className="p-1.5 text-[#718096] hover:text-[#1a2e35] bg-[#f4f6f8] hover:bg-[#edf0f4] rounded-md border-none cursor-pointer"
                            >
                              {item.is_active ? <EyeOff size={13} /> : <Eye size={13} />}
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, item.name)}
                              title="Delete"
                              className="p-1.5 text-red-400 hover:text-red-600 bg-[#f4f6f8] hover:bg-red-50 rounded-md border-none cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          {/* Mobile actions */}
                          <div className="flex md:hidden items-center gap-2 col-span-2 justify-end">
                            <button
                              onClick={() => handleToggleActive(item.id, item.is_active)}
                              className="p-1.5 text-[#718096] bg-[#f4f6f8] rounded-md border-none cursor-pointer"
                            >
                              {item.is_active ? <EyeOff size={13} /> : <Eye size={13} />}
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, item.name)}
                              className="p-1.5 text-red-400 bg-[#f4f6f8] rounded-md border-none cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              )}
            </div>
          )
        })}

        {sections.length === 0 && (
          <div className="bg-white border border-[#dde3ea] rounded-xl p-12 text-center">
            <p className="text-[#718096] text-sm">No sections yet. Click "New section" to get started.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {addItemSection && (
        <AddItemModal
          section={addItemSection}
          onClose={() => setAddItemSection(null)}
          onAdded={handleAddItem}
        />
      )}

      {showAddSection && (
        <AddSectionModal
          onClose={() => setShowAddSection(false)}
          onAdded={handleAddSection}
        />
      )}

      {/* ── Sticky save bar ── */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
          hasPendingChanges || saveSuccess ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 pb-4">
          <div className="flex items-center justify-between gap-4 bg-[#1a2e35] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-white/10">
            <div className="flex items-center gap-2.5 text-sm">
              {saveSuccess ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-green-300 font-medium">All changes saved!</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-white/70">
                    <span className="text-white font-semibold">{Object.keys(pendingChanges).length}</span>{' '}
                    item{Object.keys(pendingChanges).length !== 1 ? 's' : ''} with unsaved changes
                  </span>
                </>
              )}
            </div>

            {!saveSuccess && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDiscardAll}
                  disabled={saving}
                  className="px-3 py-1.5 text-xs text-white/60 hover:text-white border border-white/20 hover:border-white/40 rounded-lg bg-transparent cursor-pointer transition-colors disabled:opacity-40"
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveAll}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-1.5 bg-[#8cc7c4] hover:bg-[#6fb8b4] border-none rounded-lg text-sm font-bold text-[#1a2e35] cursor-pointer transition-colors disabled:opacity-60"
                >
                  {saving ? (
                    <><Loader2 size={13} className="animate-spin" /> Saving…</>
                  ) : (
                    <><Save size={13} /> Save changes</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}