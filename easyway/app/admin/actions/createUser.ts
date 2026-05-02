'use server'

import { createServerClient, createAdminClient } from '@/lib/supabase/server'

export async function createUser({ email, password, fullName, role }: {
  email: string
  password: string
  fullName: string
  role: 'admin' | 'manager' | 'staff'
}) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return { error: 'Forbidden' }

  const supabaseAdmin = createAdminClient()

  const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role },
  })

  if (error) return { error: error.message }

  await supabaseAdmin.from('profiles').upsert({
    id: newUser.user.id,
    email,
    full_name: fullName,
    role,
    is_active: true,
  })

  return { success: true }
}