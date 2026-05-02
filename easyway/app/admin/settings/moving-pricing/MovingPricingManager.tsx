'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Check, X, ChevronLeft } from 'lucide-react'
import {
  createPricingRange,
  updatePricingRange,
  deletePricingRange,
} from './actions'

type PricingRange = {
  id: string
  min_miles: number
  max_miles: number | null
  price_per_cuft: number
  sort_order: number
  is_active: boolean
}

type RowForm = {
  min_miles: string
  max_miles: string
  price_per_cuft: string
  sort_order: string
}

const emptyRow: RowForm = {
  min_miles: '',
  max_miles: '',
  price_per_cuft: '',
  sort_order: '0',
}

function parseRow(row: RowForm) {
  return {
    min_miles: parseInt(row.min_miles) || 0,
    max_miles: row.max_miles.trim() === '' ? null : parseInt(row.max_miles),
    price_per_cuft: parseFloat(row.price_per_cuft) || 0,
    sort_order: parseInt(row.sort_order) || 0,
  }
}

export default function MovingPricingManager({
  initialRanges,
}: {
  initialRanges: PricingRange[]
}) {
  const [ranges, setRanges] = useState(initialRanges)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [newRow, setNewRow] = useState<RowForm>(emptyRow)
  const [editRow, setEditRow] = useState<RowForm>(emptyRow)

  const handleCreate = () => {
    const parsed = parseRow(newRow)
    if (!newRow.min_miles.trim() || !newRow.price_per_cuft.trim()) return
    startTransition(async () => {
      const result = await createPricingRange(parsed)
      if (result.success) {
        setNewRow(emptyRow)
        setShowNew(false)
        window.location.reload()
      } else {
        alert(result.error)
      }
    })
  }

  const startEdit = (r: PricingRange) => {
    setEditingId(r.id)
    setEditRow({
      min_miles: String(r.min_miles),
      max_miles: r.max_miles == null ? '' : String(r.max_miles),
      price_per_cuft: String(r.price_per_cuft),
      sort_order: String(r.sort_order),
    })
  }

  const handleUpdate = (id: string) => {
    const parsed = parseRow(editRow)
    startTransition(async () => {
      const result = await updatePricingRange(id, parsed)
      if (result.success) {
        setRanges(prev =>
          prev.map(r => (r.id === id ? { ...r, ...parsed } : r))
        )
        setEditingId(null)
      } else {
        alert(result.error)
      }
    })
  }

  const handleToggleActive = (r: PricingRange) => {
    startTransition(async () => {
      const result = await updatePricingRange(r.id, { is_active: !r.is_active })
      if (result.success) {
        setRanges(prev =>
          prev.map(s => (s.id === r.id ? { ...s, is_active: !s.is_active } : s))
        )
      }
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Deactivate this pricing range?')) return
    startTransition(async () => {
      const result = await deletePricingRange(id)
      if (result.success) {
        setRanges(prev =>
          prev.map(r => (r.id === id ? { ...r, is_active: false } : r))
        )
      }
    })
  }

  const inputCls =
    'w-full px-2 py-1.5 border border-[#dde3ea] rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#8cc7c4]'

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
            Moving Pricing Ranges
          </h1>
          <p className="text-sm text-[#718096] mt-1">
            Price per cubic foot based on distance. Estimated price = total cuft × rate.
          </p>
        </div>
        <button
          onClick={() => { setShowNew(true); setNewRow(emptyRow) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#8cc7c4] text-[#1a2e35] rounded font-bold text-sm cursor-pointer border-none hover:bg-[#6fb8b4] transition-colors"
        >
          <Plus size={16} /> Add Range
        </button>
      </div>

      <div className="bg-white border border-[#dde3ea] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#fafbfc] border-b border-[#dde3ea]">
            <tr className="text-left text-[11px] tracking-[0.1em] uppercase text-[#4a5568] font-bold">
              <th className="px-4 py-3">Min Miles</th>
              <th className="px-4 py-3">Max Miles</th>
              <th className="px-4 py-3">Price / cuft</th>
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
                    type="number"
                    value={newRow.min_miles}
                    onChange={e => setNewRow({ ...newRow, min_miles: e.target.value })}
                    placeholder="e.g. 0"
                    className={inputCls}
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={newRow.max_miles}
                    onChange={e => setNewRow({ ...newRow, max_miles: e.target.value })}
                    placeholder="blank = unlimited"
                    className={inputCls}
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    step="0.01"
                    value={newRow.price_per_cuft}
                    onChange={e => setNewRow({ ...newRow, price_per_cuft: e.target.value })}
                    placeholder="e.g. 2.50"
                    className={inputCls}
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={newRow.sort_order}
                    onChange={e => setNewRow({ ...newRow, sort_order: e.target.value })}
                    className={inputCls}
                  />
                </td>
                <td className="px-4 py-3 text-[#718096] text-xs">New</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={handleCreate}
                    disabled={isPending}
                    className="p-1.5 text-[#8cc7c4] hover:bg-[#8cc7c4]/10 rounded mr-1 border-none bg-transparent cursor-pointer"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => setShowNew(false)}
                    className="p-1.5 text-[#718096] hover:bg-gray-100 rounded border-none bg-transparent cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </td>
              </tr>
            )}

            {ranges.map(r => {
              const isEditing = editingId === r.id
              return (
                <tr
                  key={r.id}
                  className="border-b border-[#edf0f4] last:border-0 hover:bg-[#fafbfc]"
                >
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input type="number" value={editRow.min_miles} onChange={e => setEditRow({ ...editRow, min_miles: e.target.value })} className={inputCls} />
                    ) : (
                      <span className="font-semibold text-[#1a2e35]">{r.min_miles}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input type="number" value={editRow.max_miles} onChange={e => setEditRow({ ...editRow, max_miles: e.target.value })} placeholder="blank = unlimited" className={inputCls} />
                    ) : (
                      <span className="text-[#4a5568]">{r.max_miles ?? '∞'}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input type="number" step="0.01" value={editRow.price_per_cuft} onChange={e => setEditRow({ ...editRow, price_per_cuft: e.target.value })} className={inputCls} />
                    ) : (
                      <span className="font-semibold text-[#1a2e35]">
                        ${Number(r.price_per_cuft).toFixed(2)}
                        <span className="text-[#718096] font-normal text-xs ml-1">/ cuft</span>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input type="number" value={editRow.sort_order} onChange={e => setEditRow({ ...editRow, sort_order: e.target.value })} className={inputCls} />
                    ) : (
                      <span className="text-[#718096]">{r.sort_order}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(r)}
                      disabled={isPending}
                      className={`text-[10px] font-bold uppercase tracking-[0.5px] px-2 py-[3px] rounded-full border-none cursor-pointer ${
                        r.is_active
                          ? 'bg-[#8cc7c4]/20 text-[#1a2e35]'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {r.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleUpdate(r.id)}
                          disabled={isPending}
                          className="p-1.5 text-[#8cc7c4] hover:bg-[#8cc7c4]/10 rounded mr-1 border-none bg-transparent cursor-pointer"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1.5 text-[#718096] hover:bg-gray-100 rounded border-none bg-transparent cursor-pointer"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(r)}
                          className="p-1.5 text-[#4a5568] hover:bg-gray-100 rounded mr-1 border-none bg-transparent cursor-pointer"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded border-none bg-transparent cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              )
            })}

            {ranges.length === 0 && !showNew && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[#718096] text-sm">
                  No pricing ranges yet. Click &quot;Add Range&quot; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}