import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin:   ['/admin', '/admin/bookings', '/admin/customers', '/admin/services', '/admin/settings', '/admin/users'],
  manager: ['/admin', '/admin/bookings', '/admin/customers'],
  staff:   ['/admin', '/admin/bookings'],
}

function canAccess(role: string, pathname: string): boolean {
  const allowed = ROLE_PERMISSIONS[role] ?? []
  return allowed.some(route => pathname === route || pathname.startsWith(route + '/'))
}

function redirectWithCookies(url: URL, supabaseResponse: NextResponse) {
  const res = NextResponse.redirect(url)
  supabaseResponse.cookies.getAll().forEach(c => res.cookies.set(c.name, c.value))
  return res
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname
  const isLoginPage = pathname === '/login'
  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return redirectWithCookies(url, supabaseResponse)
  }

  if (isLoginPage && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return redirectWithCookies(url, supabaseResponse)
  }

  if (isLoginPage && !user) {
    return supabaseResponse
  }

  if (isAdminRoute && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role ?? 'staff'

    if (!canAccess(role, pathname)) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return redirectWithCookies(url, supabaseResponse)
    }
  }

  return supabaseResponse
}