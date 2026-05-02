'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import { BookingConfirmationEmail } from './emails/BookingConfirmationEmail'
import { getEmailSettings } from '@/app/admin/settings/email/actions'

const resend = new Resend(process.env.RESEND_API_KEY)

type Status = 'new' | 'contacted' | 'quoted' | 'won' | 'lost' | 'confirmed' | 'completed'

// ── Landscaping ──────────────────────────────────────────────────
export async function updateLandscapingQuoteStatus(id: string, status: Status) {
  const sessionClient = await createServerClient()
  const { data: { user } } = await sessionClient.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { data: profile } = await sessionClient
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'manager', 'staff'].includes(profile.role)) {
    return { success: false, error: 'Forbidden' }
  }

  const admin = createAdminClient()

  const { data: currentQuote } = await admin
    .from('landscaping_quotes')
    .select('status')
    .eq('id', id)
    .single()

  if (!currentQuote) return { success: false, error: 'Quote not found' }
  if (currentQuote.status === status) return { success: true }

  const { error: updateError } = await admin
    .from('landscaping_quotes')
    .update({ status })
    .eq('id', id)

  if (updateError) return { success: false, error: updateError.message }

  await admin.from('quote_status_history').insert({
    quote_id: id,
    quote_type: 'landscaping',
    from_status: currentQuote.status,
    to_status: status,
    changed_by: user.id,
    changed_by_name: profile.full_name,
    changed_by_email: profile.email,
  })

  revalidatePath('/admin/bookings')
  return { success: true }
}
type SendEmailPayload = {
  to: string
  customerName: string
  serviceType: string
  jobDetails: string
  address?: string
  date?: string
  lineItems: { label: string; price: number }[]
  customMessage?: string
  referenceId: string
}
// ── Plumbing ─────────────────────────────────────────────────────
export async function updatePlumbingQuoteStatus(id: string, status: Status) {
  const sessionClient = await createServerClient()
  const { data: { user } } = await sessionClient.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { data: profile } = await sessionClient
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'manager', 'staff'].includes(profile.role)) {
    return { success: false, error: 'Forbidden' }
  }

  const admin = createAdminClient()

  const { data: currentQuote } = await admin
    .from('plumbing_quotes')
    .select('status')
    .eq('id', id)
    .single()

  if (!currentQuote) return { success: false, error: 'Quote not found' }
  if (currentQuote.status === status) return { success: true }

  const { error: updateError } = await admin
    .from('plumbing_quotes')
    .update({ status })
    .eq('id', id)

  if (updateError) return { success: false, error: updateError.message }

  await admin.from('quote_status_history').insert({
    quote_id: id,
    quote_type: 'plumbing',
    from_status: currentQuote.status,
    to_status: status,
    changed_by: user.id,
    changed_by_name: profile.full_name,
    changed_by_email: profile.email,
  })

  revalidatePath('/admin/bookings')
  return { success: true }
}

// ── Cleaning ─────────────────────────────────────────────────────
export async function updateCleaningQuoteStatus(id: string, status: Status) {
  const sessionClient = await createServerClient()
  const { data: { user } } = await sessionClient.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { data: profile } = await sessionClient
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'manager', 'staff'].includes(profile.role)) {
    return { success: false, error: 'Forbidden' }
  }

  const admin = createAdminClient()

  const { data: currentQuote } = await admin
    .from('cleaning_quotes')
    .select('status')
    .eq('id', id)
    .single()

  if (!currentQuote) return { success: false, error: 'Quote not found' }
  if (currentQuote.status === status) return { success: true }

  const { error: updateError } = await admin
    .from('cleaning_quotes')
    .update({ status })
    .eq('id', id)

  if (updateError) return { success: false, error: updateError.message }

  await admin.from('quote_status_history').insert({
    quote_id: id,
    quote_type: 'cleaning',
    from_status: currentQuote.status,
    to_status: status,
    changed_by: user.id,
    changed_by_name: profile.full_name,
    changed_by_email: profile.email,
  })

  revalidatePath('/admin/bookings')
  return { success: true }
}


export async function createAdminBooking(
  service: 'landscaping' | 'moving' | 'cleaning' | 'pool_maintenance' | 'plumbing',
  data: Record<string, string>
) {
  const supabase = await createAdminClient()

  const tableMap = {
    landscaping: 'landscaping_quotes',
    moving: 'moving_quotes',
    cleaning: 'cleaning_quotes',
    pool_maintenance: 'pool_maintenance_quotes',
    plumbing: 'plumbing_quotes',
  }

  const { error } = await supabase
    .from(tableMap[service])
    .insert({ ...data, status: 'new' })

  if (error) return { success: false, error: error.message }
  return { success: true }
}



export async function sendBookingEmail(payload: SendEmailPayload) {
  try {
    // Fetch settings from DB
    const settings = await getEmailSettings()
 
    const companyName    = settings.company_name    ?? 'EasyWay'
    const companyTagline = settings.company_tagline ?? 'Home Services'
    const fromEmail      = settings.from_email      ?? 'onboarding@resend.dev'
    const subjectTemplate = settings.email_subject  ?? 'Your {company} booking is confirmed — Ref #{ref}'
    const footerMessage  = settings.footer_message  ?? 'Questions? Reply to this email or call us directly.'
    const headerImageUrl = settings.header_image_url ?? null
    const pdfUrl         = settings.pdf_attachment_url ?? null
 
    const subject = subjectTemplate
      .replace('{ref}', payload.referenceId)
      .replace('{company}', companyName)
 
    const html = await render(
      BookingConfirmationEmail({
        customerName:   payload.customerName,
        serviceType:    payload.serviceType,
        jobDetails:     payload.jobDetails,
        address:        payload.address,
        date:           payload.date,
        lineItems:      payload.lineItems,
        customMessage:  payload.customMessage,
        referenceId:    payload.referenceId,
        companyName,
        companyTagline,
        footerMessage,
        headerImageUrl,
      })
    )
 
    // Build attachments array if PDF exists
    let attachments: { filename: string; url: string }[] = []
    if (pdfUrl) {
      attachments = [{ filename: 'EasyWay-Booking.pdf', url: pdfUrl }]
    }
 
    await resend.emails.send({
      from:        `${companyName} <${fromEmail}>`,
      to:          payload.to,
      subject,
      html,
      ...(attachments.length > 0 && { attachments }),
    })
 
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message ?? 'Failed to send email' }
  }
}

// ── Shared ────────────────────────────────────────────────────────
export async function getQuoteStatusHistory(quoteId: string, quoteType: string) {
  const admin = createAdminClient()
  const { data } = await admin
    .from('quote_status_history')
    .select('*')
    .eq('quote_id', quoteId)
    .eq('quote_type', quoteType)
    .order('changed_at', { ascending: false })

  return data ?? []
}


// ── Pool Care ────────────────────────────────────────────────────




export async function updatePoolCareQuoteStatus(id: string, status: Status) {
  const sessionClient = await createServerClient()
  const { data: { user } } = await sessionClient.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { data: profile } = await sessionClient
    .from('profiles').select('role, full_name, email').eq('id', user.id).single()
  if (!profile || !['admin', 'manager', 'staff'].includes(profile.role))
    return { success: false, error: 'Forbidden' }

  const admin = createAdminClient()
  const { data: current } = await admin
    .from('pool_care_quotes').select('status').eq('id', id).single()
  if (!current) return { success: false, error: 'Quote not found' }
  if (current.status === status) return { success: true }

  const { error } = await admin.from('pool_care_quotes').update({ status }).eq('id', id)
  if (error) return { success: false, error: error.message }

  await admin.from('quote_status_history').insert({
    quote_id: id, quote_type: 'pool_care',
    from_status: current.status, to_status: status,
    changed_by: user.id,
    changed_by_name: profile.full_name,
    changed_by_email: profile.email,
  })

  revalidatePath('/admin/bookings')
  return { success: true }
}
export async function updateMovingQuoteStatus(id: string, status: string) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('moving_quotes')
    .update({ status })
    .eq('id', id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function getMovingItemsAdmin() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('moving_items')
    .select('*')
    .order('section')
    .order('sort_order')
  return data ?? []
}

export async function createMovingItem(data: {
  section: string; name: string; cuft: number; sort_order: number
}) {
  const supabase = createAdminClient()
  const { data: item, error } = await supabase
    .from('moving_items')
    .insert(data)
    .select('id')
    .single()
  if (error) return { success: false, error: error.message }
  return { success: true, id: item.id }
}

export async function updateMovingItem(id: string, data: Partial<{
  name: string; section: string; cuft: number;
  image_url: string | null; is_active: boolean; sort_order: number
}>) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('moving_items').update(data).eq('id', id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function deleteMovingItem(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('moving_items').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function uploadMovingItemImage(id: string, file: FormData) {
  const supabase = createAdminClient()
  const fileData = file.get('file') as File
  if (!fileData) return { success: false, error: 'No file provided' }
  const ext = fileData.name.split('.').pop()
  const path = `${id}.${ext}`
  const { error: uploadError } = await supabase.storage
    .from('moving-items')
    .upload(path, fileData, { upsert: true })
  if (uploadError) return { success: false, error: uploadError.message }
  const { data: { publicUrl } } = supabase.storage.from('moving-items').getPublicUrl(path)
  await supabase.from('moving_items').update({ image_url: publicUrl }).eq('id', id)
  return { success: true, url: publicUrl }
}
export async function updatePoolFillingQuoteStatus(id: string, status: Status) {
  const sessionClient = await createServerClient()
  const { data: { user } } = await sessionClient.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { data: profile } = await sessionClient
    .from('profiles').select('role, full_name, email').eq('id', user.id).single()
  if (!profile || !['admin', 'manager', 'staff'].includes(profile.role))
    return { success: false, error: 'Forbidden' }

  const admin = createAdminClient()
  const { data: current } = await admin
    .from('pool_filling_quotes').select('status').eq('id', id).single()
  if (!current) return { success: false, error: 'Quote not found' }
  if (current.status === status) return { success: true }

  const { error } = await admin.from('pool_filling_quotes').update({ status }).eq('id', id)
  if (error) return { success: false, error: error.message }

  await admin.from('quote_status_history').insert({
    quote_id: id, quote_type: 'pool_filling',
    from_status: current.status, to_status: status,
    changed_by: user.id,
    changed_by_name: profile.full_name,
    changed_by_email: profile.email,
  })

  revalidatePath('/admin/bookings')
  return { success: true }
}