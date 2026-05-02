'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center font-['DM_Sans',sans-serif]">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />

      <div className="w-full max-w-[420px] px-6">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 bg-[#8cc7c4] rounded-[10px] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12h6v10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1a2e35] tracking-[-0.5px]">
              EasyWay
            </span>
          </div>
          <p className="text-[#6b7280] text-sm m-0">Admin Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-10 shadow-[0_4px_24px_rgba(26,46,53,0.08)] border border-[#e5e7eb]">
          <h1 className="font-['Playfair_Display',serif] text-[22px] font-bold text-[#1a2e35] m-0 mb-2">
            Welcome back
          </h1>
          <p className="text-[#6b7280] text-sm m-0 mb-7">
            Sign in to manage your bookings
          </p>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="admin@easyway.com"
                className="w-full px-3.5 py-[11px] border-[1.5px] border-[#e5e7eb] rounded-[10px] text-sm text-[#1a2e35] outline-none box-border transition-colors duration-200 font-['DM_Sans',sans-serif] focus:border-[#8cc7c4]"
              />
            </div>

            <div className="mb-6">
              <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-3.5 py-[11px] border-[1.5px] border-[#e5e7eb] rounded-[10px] text-sm text-[#1a2e35] outline-none box-border transition-colors duration-200 font-['DM_Sans',sans-serif] focus:border-[#8cc7c4]"
              />
            </div>

            {error && (
              <div className="bg-[#fef2f2] border border-[#fecaca] rounded-lg px-3.5 py-2.5 mb-5 text-[13px] text-[#dc2626]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-[13px] border-none rounded-[10px] text-[15px] font-semibold text-white font-['DM_Sans',sans-serif] tracking-[0.2px] transition-colors duration-200 ${
                loading
                  ? 'bg-[#a8d5d3] cursor-not-allowed'
                  : 'bg-[#1a2e35] cursor-pointer hover:bg-[#243f49]'
              }`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-xs text-[#9ca3af]">
          EasyWay Admin · Protected area
        </p>
      </div>
    </div>
  )
}