'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Check, X, ChevronLeft } from 'lucide-react'
import { createJobSize, updateJobSize, deleteJobSize } from './actions'

type JobSize = {
  id: string
  label: string
  description: string
  sort_order: number
  is_active: boolean
}

export default function JobSizesManager({ initialJobSizes }: { initialJobSizes: JobSize[] }) {
  const [jobSizes, setJobSizes] = useState(initialJobSizes)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [newRow, setNewRow] = useState({ label: '', description: '', sort_order: 0 })
  const [editRow, setEditRow] = useState({ label: '', description: '', sort_order: 0 })

  const handleCreate = () => {
    if (!newRow.label.trim() || !newRow.description.trim()) return
    startTransition(async () => {
      const result = await createJobSize(newRow)
      if (result.success) {
        setNewRow({ label: '', description: '', sort_order: 0 })
        setShowNew(false)
        window.location.reload()
      } else {
        alert(result.error)
      }
    })
  }

  const startEdit = (size: JobSize) => {
    setEditingId(size.id)
    setEditRow({
      label: size.label,
      description: size.description,
      sort_order: size.sort_order,
    })
  }

  const handleUpdate = (id: string) => {
    startTransition(async () => {
      const result = await updateJobSize(id, editRow)
      if (result.success) {
        setJobSizes(prev => prev.map(s => (s.id === id ? { ...s, ...editRow } : s)))
        setEditingId(null)
      } else {
        alert(result.error)
      }
    })
  }

  const handleToggleActive = (size: JobSize) => {
    startTransition(async () => {
      const result = await updateJobSize(size.id, { is_active: !size.is_active })
      if (result.success) {
        setJobSizes(prev =>
          prev.map(s => (s.id === size.id ? { ...s, is_active: !s.is_active } : s))
        )
      }
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Deactivate this job size? Existing quotes will keep their label.')) return
    startTransition(async () => {
      const result = await deleteJobSize(id)
      if (result.success) {
        setJobSizes(prev => prev.map(s => (s.id === id ? { ...s, is_active: false } : s)))
      }
    })
  }

  return (
    <div className="p-6 md:p-8 font-['DM_Sans',sans-serif] max-w-[900px]">
      <Link
        href="/admin/settings"
        className="inline-flex items-center gap-1.5 text-xs text-[#718096] hover:text-[#1a2e35] mb-4 no-underline"
      >
        <ChevronLeft size={14} /> Back to Settings
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1a2e35] m-0">
            Job Sizes
          </h1>
          <p className="text-sm text-[#718096] mt-1">
            Options customers pick when requesting a quote.
          </p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#8cc7c4] text-[#1a2e35] rounded font-bold text-sm cursor-pointer border-none hover:bg-[#6fb8b4] transition-colors"
        >
          <Plus size={16} /> Add job size
        </button>
      </div>

      <div className="bg-white border border-[#dde3ea] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#fafbfc] border-b border-[#dde3ea]">
            <tr className="text-left text-[11px] tracking-[0.1em] uppercase text-[#4a5568] font-bold">
              <th className="px-4 py-3">Label</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 w-20">Order</th>
              <th className="px-4 py-3 w-24">Status</th>
              <th className="px-4 py-3 w-28 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {showNew && (
              <tr className="border-b border-[#dde3ea] bg-[#8cc7c4]/[0.06]">
                <td className="px-4 py-3">
                  <input
                    value={newRow.label}
                    onChange={e => setNewRow({ ...newRow, label: e.target.value })}
                    placeholder="e.g. Extra Large"
                    className="w-full px-2 py-1.5 border border-[#dde3ea] rounded text-sm"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    value={newRow.description}
                    onChange={e => setNewRow({ ...newRow, description: e.target.value })}
                    placeholder="e.g. 5,000+ sq.ft"
                    className="w-full px-2 py-1.5 border border-[#dde3ea] rounded text-sm"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={newRow.sort_order}
                    onChange={e => setNewRow({ ...newRow, sort_order: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 border border-[#dde3ea] rounded text-sm"
                  />
                </td>
                <td className="px-4 py-3 text-[#718096] text-xs">New</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={handleCreate} disabled={isPending}
                    className="p-1.5 text-[#8cc7c4] hover:bg-[#8cc7c4]/10 rounded mr-1 border-none bg-transparent cursor-pointer">
                    <Check size={16} />
                  </button>
                  <button onClick={() => setShowNew(false)}
                    className="p-1.5 text-[#718096] hover:bg-gray-100 rounded border-none bg-transparent cursor-pointer">
                    <X size={16} />
                  </button>
                </td>
              </tr>
            )}

            {jobSizes.map(size => {
              const isEditing = editingId === size.id
              return (
                <tr key={size.id} className="border-b border-[#edf0f4] last:border-0 hover:bg-[#fafbfc]">
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        value={editRow.label}
                        onChange={e => setEditRow({ ...editRow, label: e.target.value })}
                        className="w-full px-2 py-1.5 border border-[#dde3ea] rounded text-sm"
                      />
                    ) : (
                      <span className="font-semibold text-[#1a2e35]">{size.label}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        value={editRow.description}
                        onChange={e => setEditRow({ ...editRow, description: e.target.value })}
                        className="w-full px-2 py-1.5 border border-[#dde3ea] rounded text-sm"
                      />
                    ) : (
                      <span className="text-[#4a5568]">{size.description}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editRow.sort_order}
                        onChange={e => setEditRow({ ...editRow, sort_order: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 border border-[#dde3ea] rounded text-sm"
                      />
                    ) : (
                      <span className="text-[#718096]">{size.sort_order}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(size)}
                      disabled={isPending}
                      className={`text-[10px] font-bold uppercase tracking-[0.5px] px-2 py-[3px] rounded-full border-none cursor-pointer ${
                        size.is_active
                          ? 'bg-[#8cc7c4]/20 text-[#1a2e35]'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {size.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isEditing ? (
                      <>
                        <button onClick={() => handleUpdate(size.id)} disabled={isPending}
                          className="p-1.5 text-[#8cc7c4] hover:bg-[#8cc7c4]/10 rounded mr-1 border-none bg-transparent cursor-pointer">
                          <Check size={16} />
                        </button>
                        <button onClick={() => setEditingId(null)}
                          className="p-1.5 text-[#718096] hover:bg-gray-100 rounded border-none bg-transparent cursor-pointer">
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(size)}
                          className="p-1.5 text-[#4a5568] hover:bg-gray-100 rounded mr-1 border-none bg-transparent cursor-pointer">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(size.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded border-none bg-transparent cursor-pointer">
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              )
            })}

            {jobSizes.length === 0 && !showNew && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[#718096] text-sm">
                  No job sizes yet. Click &quot;Add job size&quot; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}