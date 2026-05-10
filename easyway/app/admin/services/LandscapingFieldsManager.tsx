'use client'

import { useState, useTransition } from 'react'
import {
  Plus, Trash2, Eye, EyeOff, X, ChevronDown, ChevronRight,
  Save, Loader2,
} from 'lucide-react'
import {
  createLandscapingField, updateLandscapingField, deleteLandscapingField,
  createLandscapingFieldOption, updateLandscapingFieldOption, deleteLandscapingFieldOption,
} from './landscaping-actions'
import type { LandscapingField, LandscapingFieldType, LandscapingFieldOption } from '@/types/landscaping'

const FIELD_TYPES: { value: LandscapingFieldType; label: string }[] = [
  { value: 'text',     label: 'Text' },
  { value: 'email',    label: 'Email' },
  { value: 'tel',      label: 'Phone' },
  { value: 'number',   label: 'Number' },
  { value: 'textarea', label: 'Long text' },
  { value: 'select',   label: 'Dropdown' },
]

const ICON_OPTIONS = [
  'FileText','MapPin','Building2','Home','Maximize2','User','Mail','Phone',
  'Calendar','Clock','DollarSign','Hash','Info','MessageSquare','Trees','Flower2','Leaf',
]

type FieldChange = Partial<{
  key: string; label: string; placeholder: string; help_text: string
  type: LandscapingFieldType; icon: string; required: boolean
  sort_order: number; is_active: boolean
}>

type OptionChange = Partial<{ label: string; value: string; sort_order: number }>

type PendingNewOption = {
  tempId: string
  field_id: string
  label: string
  value: string
  sort_order: number
}

// ── Inline editable text ─────────────────────────────────────
function InlineEdit({
  value, onSave, type = 'text', className = '', isDirty = false, placeholder,
}: {
  value: string | number
  onSave: (val: string) => void
  type?: 'text' | 'number'
  className?: string
  isDirty?: boolean
  placeholder?: string
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
        placeholder={placeholder}
        className={`border border-[#8cc7c4] rounded px-2 py-1 text-sm text-[#1a2e35] outline-none bg-white w-full ${className}`}
      />
    )
  }

  return (
    <span
      onClick={() => { setDraft(String(value)); setEditing(true) }}
      className={`cursor-pointer hover:text-[#8cc7c4] transition-colors ${isDirty ? 'text-amber-600' : ''} ${!value ? 'italic text-[#9aa5b4]' : ''} ${className}`}
    >
      {value || placeholder || '—'}
      {isDirty && <span className="ml-1 text-amber-400 text-[10px]">●</span>}
    </span>
  )
}

// ── Add field modal ──────────────────────────────────────────
function AddFieldModal({
  onClose, onAdded, nextSortOrder,
}: {
  onClose: () => void
  onAdded: (field: LandscapingField) => void
  nextSortOrder: number
}) {
  const [form, setForm] = useState<{
    key: string; label: string; type: LandscapingFieldType
    placeholder: string; icon: string; required: boolean
  }>({
    key: '', label: '', type: 'text',
    placeholder: '', icon: 'FileText', required: true,
  })
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const autoKey = (label: string) =>
    label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')

  const handleSubmit = () => {
    if (!form.label.trim()) return setError('Label is required')
    if (!form.key.trim()) return setError('Key is required')
    if (!/^[a-z][a-z0-9_]*$/.test(form.key)) {
      return setError('Key must be lowercase letters, numbers, and underscores')
    }
    startTransition(async () => {
      const result = await createLandscapingField({
        key: form.key.trim(),
        label: form.label.trim(),
        type: form.type,
        placeholder: form.placeholder.trim(),
        icon: form.icon,
        required: form.required,
        sort_order: nextSortOrder,
      })
      if (!result.success) return setError(result.error)
      onAdded({
        id: result.id,
        key: form.key.trim(),
        label: form.label.trim(),
        placeholder: form.placeholder.trim(),
        help_text: '',
        type: form.type,
        icon: form.icon,
        required: form.required,
        sort_order: nextSortOrder,
        is_active: true,
        landscaping_field_options: [],
      })
      onClose()
    })
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[200]" onClick={onClose} />
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-[460px] overflow-hidden">
          <div className="bg-[#1a2e35] px-6 py-4 flex items-center justify-between">
            <h2 className="font-['Playfair_Display',serif] text-lg font-bold text-white m-0">
              New form field
            </h2>
            <button onClick={onClose} className="border-none bg-transparent text-white/60 hover:text-white cursor-pointer p-0">
              <X size={18} />
            </button>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Label *</label>
              <input
                autoFocus
                value={form.label}
                onChange={e => {
                  const label = e.target.value
                  setForm(p => ({ ...p, label, key: p.key || autoKey(label) }))
                }}
                placeholder="e.g. Preferred service date"
                className="w-full py-[10px] px-3 bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-sm text-[#1a202c] outline-none focus:border-[#8cc7c4]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">
                Key * <span className="text-[#9aa5b4] font-normal normal-case">(internal id)</span>
              </label>
              <input
                value={form.key}
                onChange={e => setForm(p => ({ ...p, key: e.target.value }))}
                placeholder="e.g. preferred_date"
                className="w-full py-[10px] px-3 bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-sm text-[#1a202c] outline-none focus:border-[#8cc7c4] font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Type *</label>
                <select
                  value={form.type}
                  onChange={e => setForm(p => ({ ...p, type: e.target.value as LandscapingFieldType }))}
                  className="w-full py-[10px] px-3 bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-sm text-[#1a202c] outline-none focus:border-[#8cc7c4] cursor-pointer"
                >
                  {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Icon</label>
                <select
                  value={form.icon}
                  onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}
                  className="w-full py-[10px] px-3 bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-sm text-[#1a202c] outline-none focus:border-[#8cc7c4] cursor-pointer"
                >
                  {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Placeholder</label>
              <input
                value={form.placeholder}
                onChange={e => setForm(p => ({ ...p, placeholder: e.target.value }))}
                placeholder="Hint text shown inside the input"
                className="w-full py-[10px] px-3 bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-sm text-[#1a202c] outline-none focus:border-[#8cc7c4]"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-[#4a5568]">
              <input
                type="checkbox"
                checked={form.required}
                onChange={e => setForm(p => ({ ...p, required: e.target.checked }))}
                className="w-4 h-4 accent-[#8cc7c4]"
              />
              Required field
            </label>
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
                {isPending ? 'Adding...' : 'Add field'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Options editor ───────────────────────────────────────────
function OptionsEditor({
  field,
  pendingOptionChanges,
  pendingNewOptions,
  pendingDeletedOptionIds,
  onQueueOptionChange,
  onQueueNewOption,
  onQueueDeleteOption,
}: {
  field: LandscapingField
  pendingOptionChanges: Record<string, OptionChange>
  pendingNewOptions: PendingNewOption[]
  pendingDeletedOptionIds: Set<string>
  onQueueOptionChange: (id: string, change: OptionChange) => void
  onQueueNewOption: (option: PendingNewOption) => void
  onQueueDeleteOption: (id: string) => void
}) {
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState('')

  const visibleSavedOptions = field.landscaping_field_options.filter(
    o => !pendingDeletedOptionIds.has(o.id)
  )
  const newOptions = pendingNewOptions.filter(o => o.field_id === field.id)
  const totalSortOrder = visibleSavedOptions.length + newOptions.length

  const handleAdd = () => {
    if (!draft.trim()) return
    const value = draft.toLowerCase().replace(/\s+/g, '_')
    onQueueNewOption({
      tempId: `tmp_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      field_id: field.id,
      label: draft.trim(),
      value,
      sort_order: totalSortOrder,
    })
    setDraft('')
    setAdding(false)
  }

  return (
    <div className="ml-9 mt-2 mb-2 pl-4 border-l-2 border-[#edf0f4] flex flex-col gap-1.5">
      <div className="text-[10px] uppercase tracking-[0.1em] text-[#9aa5b4] font-bold mb-1">
        Dropdown options
      </div>

      {visibleSavedOptions.length === 0 && newOptions.length === 0 && !adding && (
        <p className="text-xs text-[#9aa5b4] italic">No options yet — add some so users can choose.</p>
      )}

      {visibleSavedOptions
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(opt => {
          const change = pendingOptionChanges[opt.id]
          const displayLabel = change?.label ?? opt.label
          const isDirty = !!change
          return (
            <div key={opt.id} className="flex items-center gap-2 text-sm">
              <span className="text-[#9aa5b4]">•</span>
              <InlineEdit
                value={displayLabel}
                onSave={v => {
                  if (v === opt.label) return
                  onQueueOptionChange(opt.id, {
                    label: v,
                    value: v.toLowerCase().replace(/\s+/g, '_'),
                  })
                }}
                isDirty={isDirty}
                className="text-[#4a5568] flex-1"
              />
              <button
                onClick={() => onQueueDeleteOption(opt.id)}
                className="p-1 text-red-400 hover:text-red-600 bg-transparent border-none cursor-pointer"
              >
                <Trash2 size={11} />
              </button>
            </div>
          )
        })}

      {newOptions.map(opt => (
        <div key={opt.tempId} className="flex items-center gap-2 text-sm bg-amber-50/40 -mx-2 px-2 rounded">
          <span className="text-amber-400">•</span>
          <span className="text-[#4a5568] flex-1">{opt.label}</span>
          <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
            new
          </span>
        </div>
      ))}

      {adding ? (
        <div className="flex items-center gap-2">
          <input
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleAdd()
              if (e.key === 'Escape') { setAdding(false); setDraft('') }
            }}
            onBlur={() => { if (!draft.trim()) setAdding(false) }}
            placeholder="Option label"
            className="flex-1 py-1 px-2 border border-[#8cc7c4] rounded text-sm outline-none bg-white"
          />
          <button
            onClick={handleAdd}
            className="text-xs text-[#8cc7c4] hover:text-[#6fb8b4] bg-transparent border-none cursor-pointer"
          >
            Add
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="self-start flex items-center gap-1 text-xs text-[#8cc7c4] hover:text-[#1a2e35] bg-transparent border-none cursor-pointer mt-1"
        >
          <Plus size={11} /> Add option
        </button>
      )}
    </div>
  )
}

// ── Main component ───────────────────────────────────────────
export default function LandscapingFieldsManager({ fields: initialFields }: { fields: LandscapingField[] }) {
  const safeInitialFields = (Array.isArray(initialFields) ? initialFields : []).map(f => ({
    ...f,
    landscaping_field_options: Array.isArray(f.landscaping_field_options) ? f.landscaping_field_options : [],
  }))
  const [fields, setFields] = useState(safeInitialFields)

  const [pendingChanges, setPendingChanges] = useState<Record<string, FieldChange>>({})
  const [pendingOptionChanges, setPendingOptionChanges] = useState<Record<string, OptionChange>>({})
  const [pendingNewOptions, setPendingNewOptions] = useState<PendingNewOption[]>([])
  const [pendingDeletedOptionIds, setPendingDeletedOptionIds] = useState<Set<string>>(new Set())

  const [showAddField, setShowAddField] = useState(false)
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [, startTransition] = useTransition()

  const totalPending =
    Object.keys(pendingChanges).length +
    Object.keys(pendingOptionChanges).length +
    pendingNewOptions.length +
    pendingDeletedOptionIds.size

  const hasPendingChanges = totalPending > 0
  const sortedFields = [...fields].sort((a, b) => a.sort_order - b.sort_order)

  const queueChange = (id: string, change: FieldChange) => {
    setPendingChanges(prev => ({ ...prev, [id]: { ...prev[id], ...change } }))
    setFields(prev => prev.map(f => f.id === id ? { ...f, ...change } : f))
  }

  const queueOptionChange = (id: string, change: OptionChange) => {
    setPendingOptionChanges(prev => ({ ...prev, [id]: { ...prev[id], ...change } }))
    setFields(prev => prev.map(f => ({
      ...f,
      landscaping_field_options: f.landscaping_field_options.map(o =>
        o.id === id ? { ...o, ...change } : o
      ),
    })))
  }

  const queueNewOption = (option: PendingNewOption) => {
    setPendingNewOptions(prev => [...prev, option])
  }

  const queueDeleteOption = (id: string) => {
    setPendingDeletedOptionIds(prev => new Set(prev).add(id))
  }

  const handleSaveAll = async () => {
    if (!hasPendingChanges) return
    setSaving(true)
    try {
      await Promise.all(
        Object.entries(pendingChanges).map(([id, changes]) =>
          updateLandscapingField(id, changes)
        )
      )

      await Promise.all(
        Object.entries(pendingOptionChanges).map(([id, changes]) =>
          updateLandscapingFieldOption(id, changes)
        )
      )

      await Promise.all(
        Array.from(pendingDeletedOptionIds).map(id => deleteLandscapingFieldOption(id))
      )

      const createResults = await Promise.all(
        pendingNewOptions.map(opt =>
          createLandscapingFieldOption({
            field_id: opt.field_id,
            label: opt.label,
            value: opt.value,
            sort_order: opt.sort_order,
          }).then(r => ({ ...r, opt }))
        )
      )

      setFields(prev => prev.map(f => {
        const remainingOptions = f.landscaping_field_options.filter(
          o => !pendingDeletedOptionIds.has(o.id)
        )
        const newlyCreated = createResults
          .filter(r => r.success && r.opt.field_id === f.id)
          .map(r => ({
            id: (r as { id: string }).id,
            field_id: r.opt.field_id,
            label: r.opt.label,
            value: r.opt.value,
            sort_order: r.opt.sort_order,
          }))
        return { ...f, landscaping_field_options: [...remainingOptions, ...newlyCreated] }
      }))

      setPendingChanges({})
      setPendingOptionChanges({})
      setPendingNewOptions([])
      setPendingDeletedOptionIds(new Set())
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  const handleDiscardAll = () => {
    setPendingChanges({})
    setPendingOptionChanges({})
    setPendingNewOptions([])
    setPendingDeletedOptionIds(new Set())
    setFields(safeInitialFields)
  }

  const handleDelete = (id: string, label: string) => {
    if (!confirm(`Delete "${label}"? This will remove the field permanently.`)) return
    setPendingChanges(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setFields(prev => prev.filter(f => f.id !== id))
    startTransition(async () => { await deleteLandscapingField(id) })
  }

  const handleAddField = (field: LandscapingField) => {
    setFields(prev => [...prev, field])
  }

  const toggleExpanded = (id: string) => {
    setExpandedFields(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const moveField = (id: string, direction: 'up' | 'down') => {
    const idx = sortedFields.findIndex(f => f.id === id)
    if (idx < 0) return
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sortedFields.length) return
    const a = sortedFields[idx]
    const b = sortedFields[swapIdx]
    queueChange(a.id, { sort_order: b.sort_order })
    queueChange(b.id, { sort_order: a.sort_order })
  }

  const nextSortOrder = (Math.max(0, ...fields.map(f => f.sort_order)) + 1)

  return (
    <div className="p-4 md:p-8 font-['DM_Sans',sans-serif]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1a2e35] m-0">
            Landscaping Form Fields
          </h1>
          <p className="text-sm text-[#718096] mt-1">
            Add, edit, reorder, and remove the questions shown on the landscaping quote form. Click "Save changes" when done.
          </p>
        </div>
        <button
          onClick={() => setShowAddField(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#8cc7c4] border-none rounded-lg text-sm font-bold text-[#1a2e35] cursor-pointer hover:bg-[#6fb8b4] whitespace-nowrap"
        >
          <Plus size={16} /> New field
        </button>
      </div>

      {/* Fields list */}
      <div className="bg-white border border-[#dde3ea] rounded-xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[40px_1fr_120px_100px_90px_100px] gap-3 px-5 py-2.5 bg-[#fafbfc] border-b border-[#dde3ea] text-[10px] uppercase tracking-[0.1em] text-[#9aa5b4] font-bold">
          <span>Order</span>
          <span>Label / Key</span>
          <span>Type</span>
          <span>Required</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {sortedFields.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-[#9aa5b4]">
            No fields yet. Click "New field" to add the first one.
          </div>
        ) : (
          <div className="divide-y divide-[#edf0f4]">
            {sortedFields.map((field, i) => {
              const isDirty = !!pendingChanges[field.id]
              const isExpanded = expandedFields.has(field.id)

              return (
                <div key={field.id}>
                  <div
                    className={`grid grid-cols-[1fr_auto] md:grid-cols-[40px_1fr_120px_100px_90px_100px] gap-3 items-center px-5 py-3 transition-colors ${
                      !field.is_active ? 'opacity-50' : ''
                    } ${isDirty ? 'bg-amber-50/40' : ''}`}
                  >
                    <div className="hidden md:flex flex-col gap-0.5 items-center text-[#9aa5b4]">
                      <button
                        onClick={() => moveField(field.id, 'up')}
                        disabled={i === 0}
                        className="hover:text-[#8cc7c4] bg-transparent border-none cursor-pointer p-0 leading-none disabled:opacity-30"
                      >▲</button>
                      <span className="text-[10px]">{i + 1}</span>
                      <button
                        onClick={() => moveField(field.id, 'down')}
                        disabled={i === sortedFields.length - 1}
                        className="hover:text-[#8cc7c4] bg-transparent border-none cursor-pointer p-0 leading-none disabled:opacity-30"
                      >▼</button>
                    </div>

                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleExpanded(field.id)}
                          className="bg-transparent border-none cursor-pointer p-0 text-[#9aa5b4] hover:text-[#1a2e35] shrink-0"
                        >
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                        <InlineEdit
                          value={field.label}
                          onSave={v => queueChange(field.id, { label: v })}
                          isDirty={isDirty && 'label' in (pendingChanges[field.id] ?? {})}
                          className="text-sm font-medium text-[#1a2e35]"
                          placeholder="Field label"
                        />
                      </div>
                      <div className="flex items-center gap-2 ml-6 text-xs">
                        <span className="text-[#9aa5b4] font-mono">key:</span>
                        <InlineEdit
                          value={field.key}
                          onSave={v => queueChange(field.id, { key: v })}
                          isDirty={isDirty && 'key' in (pendingChanges[field.id] ?? {})}
                          className="text-[#718096] font-mono"
                        />
                      </div>
                    </div>

                    <div className="hidden md:block">
                      <select
                        value={field.type}
                        onChange={e => queueChange(field.id, { type: e.target.value as LandscapingFieldType })}
                        className={`text-xs py-1 px-2 border rounded bg-white outline-none cursor-pointer ${
                          isDirty && 'type' in (pendingChanges[field.id] ?? {})
                            ? 'border-amber-400 text-amber-700'
                            : 'border-[#dde3ea] text-[#4a5568]'
                        }`}
                      >
                        {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>

                    <div className="hidden md:block">
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs text-[#4a5568]">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={e => queueChange(field.id, { required: e.target.checked })}
                          className="w-4 h-4 accent-[#8cc7c4]"
                        />
                        {field.required ? 'Required' : 'Optional'}
                      </label>
                    </div>

                    <div className="hidden md:block">
                      <span className={`text-[10px] font-bold uppercase tracking-[0.5px] px-2 py-[3px] rounded-full border ${
                        field.is_active
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-gray-100 text-gray-400 border-gray-200'
                      }`}>
                        {field.is_active ? 'Visible' : 'Hidden'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => queueChange(field.id, { is_active: !field.is_active })}
                        title={field.is_active ? 'Hide' : 'Show'}
                        className="p-1.5 text-[#718096] hover:text-[#1a2e35] bg-[#f4f6f8] hover:bg-[#edf0f4] rounded-md border-none cursor-pointer"
                      >
                        {field.is_active ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                      <button
                        onClick={() => handleDelete(field.id, field.label)}
                        title="Delete"
                        className="p-1.5 text-red-400 hover:text-red-600 bg-[#f4f6f8] hover:bg-red-50 rounded-md border-none cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 py-3 bg-[#fafbfc] border-t border-[#edf0f4] flex flex-col gap-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase tracking-[0.1em] text-[#9aa5b4] font-bold">Placeholder</label>
                          <InlineEdit
                            value={field.placeholder}
                            onSave={v => queueChange(field.id, { placeholder: v })}
                            isDirty={isDirty && 'placeholder' in (pendingChanges[field.id] ?? {})}
                            className="text-sm text-[#4a5568]"
                            placeholder="Hint inside the input"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase tracking-[0.1em] text-[#9aa5b4] font-bold">Help text</label>
                          <InlineEdit
                            value={field.help_text}
                            onSave={v => queueChange(field.id, { help_text: v })}
                            isDirty={isDirty && 'help_text' in (pendingChanges[field.id] ?? {})}
                            className="text-sm text-[#4a5568]"
                            placeholder="Small text below the input"
                          />
                        </div>
                      </div>
                      {field.type === 'select' && (
                        <OptionsEditor
                          field={field}
                          pendingOptionChanges={pendingOptionChanges}
                          pendingNewOptions={pendingNewOptions}
                          pendingDeletedOptionIds={pendingDeletedOptionIds}
                          onQueueOptionChange={queueOptionChange}
                          onQueueNewOption={queueNewOption}
                          onQueueDeleteOption={queueDeleteOption}
                        />
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showAddField && (
        <AddFieldModal
          onClose={() => setShowAddField(false)}
          onAdded={handleAddField}
          nextSortOrder={nextSortOrder}
        />
      )}

      {/* Sticky save bar */}
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
                    <span className="text-white font-semibold">{totalPending}</span>{' '}
                    unsaved change{totalPending !== 1 ? 's' : ''}
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