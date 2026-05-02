'use client'

import { useState, useTransition, useRef } from 'react'
import Link from 'next/link'
import {
  ChevronLeft, Save, Upload, X, ImageIcon,
  FileText, Mail, Building2, Check,
} from 'lucide-react'
import { updateEmailSetting, uploadEmailAsset, removeEmailAsset } from './actions'

type Settings = Record<string, string | null>

function Field({
  label, description, value, onSave, placeholder, type = 'text',
}: {
  label: string; description?: string; value: string
  onSave: (v: string) => void; placeholder?: string; type?: string
}) {
  const [draft, setDraft] = useState(value)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSave = () => {
    if (draft === value) return
    startTransition(async () => {
      await onSave(draft)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">{label}</label>
          {description && <p className="text-xs text-[#9aa5b4] mt-0.5">{description}</p>}
        </div>
        {saved && (
          <span className="flex items-center gap-1 text-xs text-green-600 font-medium shrink-0">
            <Check size={12} /> Saved
          </span>
        )}
      </div>
      {type === 'textarea' ? (
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={handleSave}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2.5 bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded-lg text-sm text-[#1a202c] outline-none focus:border-[#8cc7c4] resize-none transition-colors"
        />
      ) : (
        <div className="flex gap-2">
          <input
            type={type}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={handleSave}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder={placeholder}
            className="flex-1 px-3 py-2.5 bg-[#fafbfc] border-[1.5px] border-[#dde3ea] rounded-lg text-sm text-[#1a202c] outline-none focus:border-[#8cc7c4] transition-colors"
          />
          {draft !== value && (
            <button
              onClick={handleSave}
              disabled={isPending}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#8cc7c4] text-[#1a2e35] rounded-lg text-xs font-bold border-none cursor-pointer hover:bg-[#6fb8b4] disabled:opacity-60 shrink-0"
            >
              <Save size={12} /> Save
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function AssetUpload({
  label, description, assetKey, currentUrl, accept, icon, onUploaded, onRemoved,
}: {
  label: string; description: string; assetKey: string
  currentUrl: string | null; accept: string; icon: React.ReactNode
  onUploaded: (url: string) => void; onRemoved: () => void
}) {
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const result = await uploadEmailAsset(assetKey, fd)
    if (result.success && result.url) onUploaded(result.url)
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleRemove = async () => {
    setRemoving(true)
    await removeEmailAsset(assetKey)
    onRemoved()
    setRemoving(false)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] tracking-[0.12em] uppercase text-[#4a5568] font-bold">{label}</label>
      <p className="text-xs text-[#9aa5b4] -mt-1">{description}</p>

      {currentUrl ? (
        <div className="flex items-center gap-3 p-3 bg-[#fafbfc] border border-[#dde3ea] rounded-lg">
          {assetKey === 'header_image_url' ? (
            <img src={currentUrl} alt="Header" className="h-10 w-20 object-cover rounded border border-[#dde3ea]" />
          ) : (
            <div className="w-10 h-10 bg-[#edf0f4] rounded flex items-center justify-center">
              <FileText size={18} className="text-[#718096]" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#1a2e35] truncate">
              {currentUrl.split('/').pop()}
            </p>
            <p className="text-[11px] text-[#9aa5b4]">Uploaded</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => inputRef.current?.click()}
              className="text-xs text-[#8cc7c4] font-semibold border-none bg-transparent cursor-pointer hover:text-[#1a2e35]"
            >
              Replace
            </button>
            <button
              onClick={handleRemove}
              disabled={removing}
              className="text-xs text-red-400 font-semibold border-none bg-transparent cursor-pointer hover:text-red-600 disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-3 p-4 border-2 border-dashed border-[#dde3ea] rounded-lg hover:border-[#8cc7c4] hover:bg-[#fafbfc] transition-colors cursor-pointer bg-transparent text-left disabled:opacity-60"
        >
          <div className="w-10 h-10 rounded-lg bg-[#8cc7c4]/10 flex items-center justify-center text-[#8cc7c4] shrink-0">
            {uploading ? (
              <div className="w-4 h-4 border-2 border-[#8cc7c4] border-t-transparent rounded-full animate-spin" />
            ) : (
              icon
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-[#1a2e35]">
              {uploading ? 'Uploading…' : `Upload ${label.toLowerCase()}`}
            </p>
            <p className="text-xs text-[#9aa5b4]">{accept.replace(/\./g, '').toUpperCase().replace(',', ', ')} supported</p>
          </div>
        </button>
      )}
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFile} />
    </div>
  )
}

export default function EmailSettingsManager({ settings: initial }: { settings: Settings }) {
  const [settings, setSettings] = useState(initial)

  const update = (key: string) => async (value: string) => {
    await updateEmailSetting(key, value)
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="p-6 md:p-8 font-['DM_Sans',sans-serif] max-w-[720px]">
      <Link href="/admin/settings"
        className="inline-flex items-center gap-1.5 text-xs text-[#718096] hover:text-[#1a2e35] mb-4 no-underline">
        <ChevronLeft size={14} /> Back to Settings
      </Link>

      <div className="mb-6">
        <h1 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1a2e35] m-0">Email Templates</h1>
        <p className="text-sm text-[#718096] mt-1">Customize how outgoing emails look and what they say.</p>
      </div>

      <div className="flex flex-col gap-5">

        {/* Branding */}
        <div className="bg-white border border-[#dde3ea] rounded-xl overflow-hidden">
          <div className="bg-[#fafbfc] border-b border-[#dde3ea] px-5 py-3 flex items-center gap-2">
            <Building2 size={15} className="text-[#8cc7c4]" />
            <h2 className="text-sm font-bold text-[#1a2e35] m-0">Branding</h2>
          </div>
          <div className="p-5 flex flex-col gap-4">
            <Field
              label="Company name"
              description="Shown in the email header and footer"
              value={settings.company_name ?? ''}
              onSave={update('company_name')}
              placeholder="EasyWay"
            />
            <Field
              label="Tagline"
              description="Shown under the company name in the header"
              value={settings.company_tagline ?? ''}
              onSave={update('company_tagline')}
              placeholder="Home Services"
            />
            <AssetUpload
              label="Header image"
              description="Banner image shown at the top of every email (recommended: 560×120px)"
              assetKey="header_image_url"
              currentUrl={settings.header_image_url ?? null}
              accept=".jpg,.jpeg,.png,.webp"
              icon={<ImageIcon size={18} />}
              onUploaded={url => setSettings(prev => ({ ...prev, header_image_url: url }))}
              onRemoved={() => setSettings(prev => ({ ...prev, header_image_url: null }))}
            />
          </div>
        </div>

        {/* Email content */}
        <div className="bg-white border border-[#dde3ea] rounded-xl overflow-hidden">
          <div className="bg-[#fafbfc] border-b border-[#dde3ea] px-5 py-3 flex items-center gap-2">
            <Mail size={15} className="text-[#8cc7c4]" />
            <h2 className="text-sm font-bold text-[#1a2e35] m-0">Email content</h2>
          </div>
          <div className="p-5 flex flex-col gap-4">
            <Field
              label="From email"
              description="The email address emails are sent from"
              value={settings.from_email ?? ''}
              onSave={update('from_email')}
              placeholder="hello@yourcompany.com"
              type="email"
            />
            <Field
              label="Subject line"
              description="Use {ref} as a placeholder for the booking reference number"
              value={settings.email_subject ?? ''}
              onSave={update('email_subject')}
              placeholder="Your EasyWay booking is confirmed — Ref #{ref}"
            />
            <Field
              label="Footer message"
              description="Shown at the bottom of every email"
              value={settings.footer_message ?? ''}
              onSave={update('footer_message')}
              placeholder="Questions? Reply to this email or call us directly."
              type="textarea"
            />
          </div>
        </div>

        {/* PDF attachment */}
        <div className="bg-white border border-[#dde3ea] rounded-xl overflow-hidden">
          <div className="bg-[#fafbfc] border-b border-[#dde3ea] px-5 py-3 flex items-center gap-2">
            <FileText size={15} className="text-[#8cc7c4]" />
            <h2 className="text-sm font-bold text-[#1a2e35] m-0">PDF attachment</h2>
          </div>
          <div className="p-5">
            <AssetUpload
              label="PDF attachment"
              description="Optional PDF attached to every outgoing email (e.g. service agreement, terms)"
              assetKey="pdf_attachment_url"
              currentUrl={settings.pdf_attachment_url ?? null}
              accept=".pdf"
              icon={<FileText size={18} />}
              onUploaded={url => setSettings(prev => ({ ...prev, pdf_attachment_url: url }))}
              onRemoved={() => setSettings(prev => ({ ...prev, pdf_attachment_url: null }))}
            />
          </div>
        </div>

        {/* Preview note */}
        <div className="bg-[#fafbfc] border border-[#dde3ea] rounded-xl p-4 flex items-start gap-3">
          <Mail size={16} className="text-[#8cc7c4] shrink-0 mt-0.5" />
          <p className="text-xs text-[#718096] leading-relaxed m-0">
            Changes take effect on the next email sent. Fields save automatically when you click away or press Enter.
            Use <code className="bg-[#edf0f4] px-1 py-0.5 rounded text-[#1a2e35] font-mono">{'{ref}'}</code> in the subject line to insert the booking reference number.
          </p>
        </div>
      </div>
    </div>
  )
}