'use client'

import { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import NotificationBell from './components/NotificationBell'

export function AdminLayoutClient({ children, userEmail, userRole, userName }: {
  children: React.ReactNode
  userEmail: string
  userRole: 'admin' | 'manager' | 'staff'
  userName: string
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#f4f6f8]">
      <AdminSidebar
        userEmail={userEmail}
        userRole={userRole}
        userName={userName}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
      />

      {/* Desktop top header */}
      <header
        className={`hidden md:flex fixed top-0 right-0 z-[90] h-14 bg-white border-b border-[#dde3ea] items-center justify-end px-6 transition-[left] duration-300 ease-in-out ${
          collapsed ? 'left-[68px]' : 'left-[240px]'
        }`}
      >
        <NotificationBell />
      </header>

      <main
        className={`flex-1 min-h-screen p-6 md:p-9 pt-[56px] md:pt-[80px]transition-[margin] duration-300 ease-in-out ${
          collapsed ? 'md:ml-[68px]' : 'md:ml-[240px]'
        }`}
      >
        {children}
      </main>
    </div>
  )
}