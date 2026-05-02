'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Plus, Trash2, ChevronLeft, Star, Eye, EyeOff, X, Check } from 'lucide-react'
import { createReview, updateReview, deleteReview } from './actions'

type Review = {
  id: string
  name: string
  avatar: string
  service: string
  rating: number
  text: string
  helpful: number
  date_label: string
  sort_order: number
  is_active: boolean
}

const SERVICES = ['Moving', 'Cleaning', 'Landscaping', 'Pool', 'Plumbing']

const SERVICE_COLORS: Record<string, { bg: string; color: string }> = {
  Moving:      { bg: 'rgba(140,199,196,0.12)', color: '#0F6E56' },
  Landscaping: { bg: 'rgba(99,153,34,0.1)',   color: '#3B6D11' },
  Cleaning:    { bg: 'rgba(59,130,196,0.1)',   color: '#185FA5' },
  Pool:        { bg: 'rgba(59,130,196,0.12)',  color: '#0c447c' },
  Plumbing:    { bg: 'rgba(249,115,22,0.1)',   color: '#9a3412' },
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} onClick={() => onChange(i)}
          className="border-none bg-transparent cursor-pointer p-0">
          <Star size={20}
            fill={i <= value ? '#FBBC05' : 'transparent'}
            stroke={i <= value ? '#FBBC05' : '#dde3ea'}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  )
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={12}
          fill={i <= rating ? '#FBBC05' : 'transparent'}
          stroke={i <= rating ? '#FBBC05' : '#dde3ea'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}

// ── Create modal ──────────────────────────────────────────────
function CreateModal({ onClose, onCreated, nextOrder }: {
  onClose: () => void
  onCreated: (r: Review) => void
  nextOrder: number
}) {
  const [form, setForm] = useState({
    name: '', service: 'Moving', rating: 5,
    text: '', helpful: 0, date_label: '',
  })
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // Auto-generate avatar from name
  const avatar = form.name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const handleSubmit = () => {
    if (!form.name.trim()) return setError('Name is required')
    if (!form.text.trim()) return setError('Review text is required')
    if (!form.date_label.trim()) return setError('Date label is required')

    startTransition(async () => {
      const result = await createReview({
        name: form.name.trim(),
        avatar,
        service: form.service,
        rating: form.rating,
        text: form.text.trim(),
        helpful: form.helpful,
        date_label: form.date_label.trim(),
        sort_order: nextOrder,
      })
      if (!result.success) return setError(result.error ?? 'Failed')
      onCreated({
        id: result.id!,
        name: form.name.trim(),
        avatar,
        service: form.service,
        rating: form.rating,
        text: form.text.trim(),
        helpful: form.helpful,
        date_label: form.date_label.trim(),
        sort_order: nextOrder,
        is_active: true,
      })
      onClose()
    })
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[200]" onClick={onClose} />
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-[520px] overflow-hidden max-h-[90vh] flex flex-col">
          <div className="bg-[#1a2e35] px-6 py-4 flex items-center justify-between shrink-0">
            <h2 className="font-['Playfair_Display',serif] text-lg font-bold text-white m-0">Add review</h2>
            <button onClick={onClose} className="border-none bg-transparent text-white/60 hover:text-white cursor-pointer p-0">
              <X size={18} />
            </button>
          </div>

          <div className="p-6 flex flex-col gap-4 overflow-y-auto">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Customer name *</label>
              <div className="flex gap-2 items-center">
                <input autoFocus value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Michael T."
                  className="flex-1 py-[10px] px-3 bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-sm text-[#1a202c] outline-none focus:border-[#8cc7c4]"
                />
                {avatar && (
                  <div className="w-10 h-10 rounded-full bg-[#1a2e35] flex items-center justify-center text-[11px] font-bold text-[#8cc7c4] shrink-0">
                    {avatar}
                  </div>
                )}
              </div>
            </div>

            {/* Service + rating */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Service *</label>
                <select value={form.service}
                  onChange={e => setForm(p => ({ ...p, service: e.target.value }))}
                  className="py-[10px] px-3 bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-sm text-[#1a202c] outline-none focus:border-[#8cc7c4]">
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Rating *</label>
                <div className="py-2">
                  <StarPicker value={form.rating} onChange={r => setForm(p => ({ ...p, rating: r }))} />
                </div>
              </div>
            </div>

            {/* Review text */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Review text *</label>
              <textarea value={form.text}
                onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
                placeholder="The crew showed up on time..."
                rows={4}
                className="w-full py-[10px] px-3 bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-sm text-[#1a202c] outline-none focus:border-[#8cc7c4] resize-none"
              />
            </div>

            {/* Date label + helpful */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Date label *</label>
                <input value={form.date_label}
                  onChange={e => setForm(p => ({ ...p, date_label: e.target.value }))}
                  placeholder="e.g. 2 days ago"
                  className="py-[10px] px-3 bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-sm text-[#1a202c] outline-none focus:border-[#8cc7c4]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Helpful count</label>
                <input type="number" value={form.helpful} min={0}
                  onChange={e => setForm(p => ({ ...p, helpful: Number(e.target.value) }))}
                  className="py-[10px] px-3 bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-sm text-[#1a202c] outline-none focus:border-[#8cc7c4]"
                />
              </div>
            </div>

            {error && <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>}

            <div className="flex gap-2 pt-1">
              <button onClick={onClose}
                className="flex-1 py-2.5 border border-[#dde3ea] rounded-lg text-sm text-[#718096] cursor-pointer bg-white hover:bg-[#fafbfc]">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={isPending}
                className="flex-1 py-2.5 bg-[#8cc7c4] border-none rounded-lg text-sm font-bold text-[#1a2e35] cursor-pointer hover:bg-[#6fb8b4] disabled:opacity-60">
                {isPending ? 'Adding…' : 'Add review'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Review card (admin) ───────────────────────────────────────
function ReviewCard({ review, onToggle, onDelete }: {
  review: Review
  onToggle: (id: string, current: boolean) => void
  onDelete: (id: string, name: string) => void
}) {
  const tag = SERVICE_COLORS[review.service] ?? { bg: 'rgba(140,199,196,0.12)', color: '#1a2e35' }

  return (
    <div className={`bg-white border border-[#dde3ea] border-l-[3px] border-l-[#8cc7c4] rounded-xl p-5 flex flex-col gap-3 transition-opacity ${!review.is_active ? 'opacity-50' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#1a2e35] flex items-center justify-center text-[11px] font-bold text-[#8cc7c4] shrink-0">
            {review.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1a2e35] m-0">{review.name}</p>
            <p className="text-xs text-[#9aa5b4] m-0">{review.date_label}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={() => onToggle(review.id, review.is_active)}
            className="p-1.5 text-[#718096] hover:text-[#1a2e35] bg-[#f4f6f8] hover:bg-[#edf0f4] rounded-md border-none cursor-pointer">
            {review.is_active ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
          <button onClick={() => onDelete(review.id, review.name)}
            className="p-1.5 text-red-400 hover:text-red-600 bg-[#f4f6f8] hover:bg-red-50 rounded-md border-none cursor-pointer">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Stars + service */}
      <div className="flex items-center justify-between">
        <StarRow rating={review.rating} />
        <span className="text-[10px] tracking-[0.08em] uppercase font-semibold px-2 py-[3px] rounded-[4px]"
          style={{ color: tag.color, background: tag.bg }}>
          {review.service}
        </span>
      </div>

      {/* Text */}
      <p className="text-xs text-[#4a5568] leading-[1.7] m-0 line-clamp-3">"{review.text}"</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#edf0f4]">
        <span className="text-[11px] text-[#9aa5b4]">{review.helpful} found helpful</span>
        <span className={`text-[10px] font-bold uppercase tracking-[0.5px] px-2 py-[2px] rounded-full ${review.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {review.is_active ? 'Visible' : 'Hidden'}
        </span>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────
export default function ReviewsManager({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState(initialReviews)
  const [showCreate, setShowCreate] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (id: string, current: boolean) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, is_active: !current } : r))
    startTransition(async () => { await updateReview(id, { is_active: !current }) })
  }

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete review from "${name}"? This cannot be undone.`)) return
    setReviews(prev => prev.filter(r => r.id !== id))
    startTransition(async () => { await deleteReview(id) })
  }

  const visible = reviews.filter(r => r.is_active).length
  const nextOrder = reviews.length > 0 ? Math.max(...reviews.map(r => r.sort_order)) + 1 : 1

  return (
    <div className="p-6 md:p-8 font-['DM_Sans',sans-serif] max-w-[900px]">
      <Link href="/admin/settings"
        className="inline-flex items-center gap-1.5 text-xs text-[#718096] hover:text-[#1a2e35] mb-4 no-underline">
        <ChevronLeft size={14} /> Back to Settings
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1a2e35] m-0">Reviews</h1>
          <p className="text-sm text-[#718096] mt-1">
            Manage reviews shown on the public website. <span className="font-medium text-[#1a2e35]">{visible} visible</span> of {reviews.length} total.
          </p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#8cc7c4] text-[#1a2e35] rounded-lg font-bold text-sm cursor-pointer border-none hover:bg-[#6fb8b4] transition-colors">
          <Plus size={16} /> Add review
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white border border-[#dde3ea] rounded-xl p-12 text-center">
          <Star size={32} className="text-[#dde3ea] mx-auto mb-3" />
          <p className="text-sm text-[#9aa5b4]">No reviews yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map(review => (
            <ReviewCard
              key={review.id}
              review={review}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onCreated={r => { setReviews(prev => [...prev, r]); setShowCreate(false) }}
          nextOrder={nextOrder}
        />
      )}
    </div>
  )
}