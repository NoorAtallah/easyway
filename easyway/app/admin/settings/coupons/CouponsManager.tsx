'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Plus, Trash2, ChevronLeft, Tag, Percent, DollarSign, Calendar, Hash, X, Check } from 'lucide-react'
import { createCoupon, updateCoupon, deleteCoupon } from './actions'

type Coupon = {
  id: string
  code: string
  description: string | null
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  expiry_date: string | null
  usage_limit: number | null
  usage_count: number
  is_active: boolean
  created_at: string
}

const emptyForm = {
  code: '',
  description: '',
  discount_type: 'percentage' as 'percentage' | 'fixed',
  discount_value: '',
  expiry_date: '',
  usage_limit: '',
}

function formatDiscount(type: 'percentage' | 'fixed', value: number) {
  return type === 'percentage' ? `${value}% off` : `$${value} off`
}

function isExpired(date: string | null) {
  if (!date) return false
  return new Date(date) < new Date()
}

// ── Create modal ──────────────────────────────────────────────
function CreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: (c: Coupon) => void }) {
  const [form, setForm] = useState(emptyForm)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = () => {
    if (!form.code.trim()) return setError('Code is required')
    if (!form.discount_value || isNaN(Number(form.discount_value))) return setError('Valid discount value is required')
    if (form.discount_type === 'percentage' && (Number(form.discount_value) <= 0 || Number(form.discount_value) > 100)) {
      return setError('Percentage must be between 1 and 100')
    }

    startTransition(async () => {
      const result = await createCoupon({
        code: form.code,
        description: form.description,
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        expiry_date: form.expiry_date || null,
        usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
      })
      if (!result.success) return setError(result.error ?? 'Failed to create')
      onCreated({
        id: crypto.randomUUID(),
        code: form.code.trim().toUpperCase(),
        description: form.description || null,
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        expiry_date: form.expiry_date || null,
        usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
        usage_count: 0,
        is_active: true,
        created_at: new Date().toISOString(),
      })
      onClose()
    })
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[200]" onClick={onClose} />
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-[480px] overflow-hidden">
          <div className="bg-[#1a2e35] px-6 py-4 flex items-center justify-between">
            <h2 className="font-['Playfair_Display',serif] text-lg font-bold text-white m-0">New coupon</h2>
            <button onClick={onClose} className="border-none bg-transparent text-white/60 hover:text-white cursor-pointer p-0">
              <X size={18} />
            </button>
          </div>

          <div className="p-6 flex flex-col gap-4">
            {/* Code */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Coupon code *</label>
              <div className="relative">
                <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa5b4] pointer-events-none" />
                <input
                  autoFocus
                  value={form.code}
                  onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. SUMMER20"
                  className="w-full pl-9 pr-3 py-[10px] bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-sm text-[#1a202c] outline-none focus:border-[#8cc7c4] font-mono tracking-wider"
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Description <span className="normal-case font-normal text-[#c4cdd6]">(optional)</span></label>
              <input
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="e.g. Summer promotion 2026"
                className="w-full px-3 py-[10px] bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-sm text-[#1a202c] outline-none focus:border-[#8cc7c4]"
              />
            </div>

            {/* Discount type + value */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">Discount *</label>
              <div className="flex gap-2">
                <div className="flex rounded-lg border border-[#dde3ea] overflow-hidden">
                  {(['percentage', 'fixed'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setForm(p => ({ ...p, discount_type: type }))}
                      className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold cursor-pointer border-none transition-colors
                        ${form.discount_type === type ? 'bg-[#8cc7c4] text-[#1a2e35]' : 'bg-white text-[#718096] hover:bg-[#fafbfc]'}`}
                    >
                      {type === 'percentage' ? <Percent size={12} /> : <DollarSign size={12} />}
                      {type === 'percentage' ? 'Percent' : 'Fixed'}
                    </button>
                  ))}
                </div>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa5b4] text-sm pointer-events-none">
                    {form.discount_type === 'percentage' ? '%' : '$'}
                  </span>
                  <input
                    type="number"
                    value={form.discount_value}
                    onChange={e => setForm(p => ({ ...p, discount_value: e.target.value }))}
                    placeholder={form.discount_type === 'percentage' ? '10' : '20'}
                    min="0"
                    max={form.discount_type === 'percentage' ? '100' : undefined}
                    className="w-full pl-8 pr-3 py-[10px] bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-sm text-[#1a202c] outline-none focus:border-[#8cc7c4]"
                  />
                </div>
              </div>
            </div>

            {/* Expiry + usage limit */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">
                  Expiry date <span className="normal-case font-normal text-[#c4cdd6]">(optional)</span>
                </label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa5b4] pointer-events-none" />
                  <input
                    type="date"
                    value={form.expiry_date}
                    onChange={e => setForm(p => ({ ...p, expiry_date: e.target.value }))}
                    className="w-full pl-9 pr-3 py-[10px] bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-sm text-[#1a202c] outline-none focus:border-[#8cc7c4]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">
                  Usage limit <span className="normal-case font-normal text-[#c4cdd6]">(optional)</span>
                </label>
                <div className="relative">
                  <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa5b4] pointer-events-none" />
                  <input
                    type="number"
                    value={form.usage_limit}
                    onChange={e => setForm(p => ({ ...p, usage_limit: e.target.value }))}
                    placeholder="Unlimited"
                    min="1"
                    className="w-full pl-9 pr-3 py-[10px] bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded text-sm text-[#1a202c] outline-none focus:border-[#8cc7c4]"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>
            )}

            <div className="flex gap-2 pt-1">
              <button onClick={onClose}
                className="flex-1 py-2.5 border border-[#dde3ea] rounded-lg text-sm text-[#718096] cursor-pointer bg-white hover:bg-[#fafbfc]">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={isPending}
                className="flex-1 py-2.5 bg-[#8cc7c4] border-none rounded-lg text-sm font-bold text-[#1a2e35] cursor-pointer hover:bg-[#6fb8b4] disabled:opacity-60">
                {isPending ? 'Creating…' : 'Create coupon'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Main ──────────────────────────────────────────────────────
export default function CouponsManager({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const [coupons, setCoupons] = useState(initialCoupons)
  const [showCreate, setShowCreate] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [copied, setCopied] = useState<string | null>(null)

  const handleToggle = (id: string, current: boolean) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, is_active: !current } : c))
    startTransition(async () => { await updateCoupon(id, { is_active: !current }) })
  }

  const handleDelete = (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"? This cannot be undone.`)) return
    setCoupons(prev => prev.filter(c => c.id !== id))
    startTransition(async () => { await deleteCoupon(id) })
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  const active = coupons.filter(c => c.is_active && !isExpired(c.expiry_date))
  const inactive = coupons.filter(c => !c.is_active || isExpired(c.expiry_date))

  return (
    <div className="p-6 md:p-8 font-['DM_Sans',sans-serif] max-w-[900px]">
      <Link href="/admin/settings"
        className="inline-flex items-center gap-1.5 text-xs text-[#718096] hover:text-[#1a2e35] mb-4 no-underline">
        <ChevronLeft size={14} /> Back to Settings
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1a2e35] m-0">Coupons</h1>
          <p className="text-sm text-[#718096] mt-1">Manage discount codes for customers.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#8cc7c4] text-[#1a2e35] rounded-lg font-bold text-sm cursor-pointer border-none hover:bg-[#6fb8b4] transition-colors"
        >
          <Plus size={16} /> New coupon
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total coupons', value: coupons.length },
          { label: 'Active',        value: active.length },
          { label: 'Expired / off', value: inactive.length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-[#dde3ea] rounded-xl p-4 text-center">
            <p className="font-['Playfair_Display',serif] text-3xl font-bold text-[#1a2e35]">{value}</p>
            <p className="text-xs text-[#9aa5b4] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {coupons.length === 0 ? (
        <div className="bg-white border border-[#dde3ea] rounded-xl p-12 text-center">
          <Tag size={32} className="text-[#dde3ea] mx-auto mb-3" />
          <p className="text-sm text-[#9aa5b4]">No coupons yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#dde3ea] rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_100px_80px_100px] gap-4 px-5 py-3 bg-[#fafbfc] border-b border-[#dde3ea] text-[10px] uppercase tracking-[0.1em] text-[#9aa5b4] font-bold">
            <span>Code</span>
            <span>Discount</span>
            <span>Expiry</span>
            <span>Usage</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {coupons.map(coupon => {
            const expired = isExpired(coupon.expiry_date)
            const exhausted = coupon.usage_limit !== null && coupon.usage_count >= coupon.usage_count
            const effectivelyActive = coupon.is_active && !expired

            return (
              <div key={coupon.id}
                className={`grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_100px_80px_100px] gap-3 md:gap-4 items-center px-5 py-4 border-b border-[#edf0f4] last:border-0 transition-colors ${!effectivelyActive ? 'opacity-50' : 'hover:bg-[#fafbfc]'}`}>

                {/* Code */}
                <div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(coupon.code)}
                      title="Copy code"
                      className="font-mono font-bold text-[#1a2e35] text-sm tracking-wider border-none bg-transparent cursor-pointer p-0 hover:text-[#8cc7c4] transition-colors flex items-center gap-1.5"
                    >
                      {coupon.code}
                      {copied === coupon.code
                        ? <Check size={13} className="text-green-500" />
                        : <Tag size={11} className="text-[#9aa5b4]" />
                      }
                    </button>
                  </div>
                  {coupon.description && (
                    <p className="text-xs text-[#9aa5b4] mt-0.5">{coupon.description}</p>
                  )}
                </div>

                {/* Discount */}
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-md bg-[#8cc7c4]/10 flex items-center justify-center">
                    {coupon.discount_type === 'percentage'
                      ? <Percent size={12} className="text-[#8cc7c4]" />
                      : <DollarSign size={12} className="text-[#8cc7c4]" />
                    }
                  </div>
                  <span className="text-sm font-semibold text-[#1a2e35]">
                    {formatDiscount(coupon.discount_type, coupon.discount_value)}
                  </span>
                </div>

                {/* Expiry */}
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-[#9aa5b4] shrink-0" />
                  {coupon.expiry_date ? (
                    <span className={`text-xs ${expired ? 'text-red-400 font-medium' : 'text-[#4a5568]'}`}>
                      {expired ? 'Expired ' : ''}{new Date(coupon.expiry_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  ) : (
                    <span className="text-xs text-[#9aa5b4]">No expiry</span>
                  )}
                </div>

                {/* Usage */}
                <div className="flex items-center gap-1.5">
                  <Hash size={12} className="text-[#9aa5b4] shrink-0" />
                  <span className="text-xs text-[#4a5568]">
                    {coupon.usage_count} / {coupon.usage_limit ?? '∞'}
                  </span>
                </div>

                {/* Status */}
                <div>
                  <button
                    onClick={() => handleToggle(coupon.id, coupon.is_active)}
                    disabled={isPending || expired}
                    className={`text-[10px] font-bold uppercase tracking-[0.5px] px-2.5 py-[4px] rounded-full cursor-pointer border-none transition-colors
                      ${effectivelyActive
                        ? 'bg-green-100 text-green-700'
                        : expired
                          ? 'bg-red-100 text-red-500 cursor-default'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                  >
                    {expired ? 'Expired' : coupon.is_active ? 'Active' : 'Off'}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDelete(coupon.id, coupon.code)}
                    title="Delete coupon"
                    className="p-1.5 text-red-400 hover:text-red-600 bg-[#f4f6f8] hover:bg-red-50 rounded-md border-none cursor-pointer transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onCreated={c => { setCoupons(prev => [c, ...prev]); setShowCreate(false) }}
        />
      )}
    </div>
  )
}