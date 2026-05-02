'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/app/components/navbar'
import Footer from '@/app/components/footer'
import { useState, useEffect } from 'react'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      {mounted && !isAdmin && <Navbar />}
      {children}
      {mounted && !isAdmin && <Footer />}
    </>
  )
}