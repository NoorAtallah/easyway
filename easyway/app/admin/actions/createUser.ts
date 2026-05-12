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

// in createUser.ts (or a separate updateUser.ts)
export async function updateUser({
  userId, email, password, role, isActive,
}: {
  userId: string
  email?: string
  password?: string
  role: string
  isActive: boolean
}) {
  const supabase = createAdminClient() // service role client

  // Update auth (email + password)
  const authUpdate: any = {}
  if (email) authUpdate.email = email
  if (password) authUpdate.password = password

  if (Object.keys(authUpdate).length > 0) {
    const { error } = await supabase.auth.admin.updateUserById(userId, authUpdate)
    if (error) return { error: error.message }
  }

  // Update profile (role + is_active)
  const { error } = await supabase
    .from('profiles')
    .update({ role, is_active: isActive })
    .eq('id', userId)

  if (error) return { error: error.message }
  return { error: null }
}