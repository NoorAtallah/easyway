'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createUser } from '@/app/admin/actions/createUser'

type Role = 'admin' | 'manager' | 'staff'

type UserProfile = {
  id: string
  email: string
  full_name: string | null
  role: Role
  is_active: boolean
  last_login: string | null
  created_at: string
}

const roleBadge: Record<Role, string> = {
  admin:   'bg-emerald-100 text-emerald-800',
  manager: 'bg-amber-100 text-amber-800',
  staff:   'bg-sky-100 text-sky-800',
}

function timeAgo(date: string | null) {
  if (!date) return 'Never'
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function UsersPage() {
  const supabase = createClient()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editUser, setEditUser] = useState<UserProfile | null>(null)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState<Role | 'all'>('all')

  const fetchUsers = async () => {
    const { data: { user: me } } = await supabase.auth.getUser()

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', me?.id ?? '')
      .order('created_at', { ascending: false })

    if (data) setUsers(data)
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [])

  const toggleActive = async (user: UserProfile) => {
    await supabase
      .from('profiles')
      .update({ is_active: !user.is_active })
      .eq('id', user.id)
    setUsers(prev => prev.map(u =>
      u.id === user.id ? { ...u, is_active: !u.is_active } : u
    ))
  }

  const updateRole = async (userId: string, role: Role) => {
    await supabase.from('profiles').update({ role }).eq('id', userId)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u))
    setEditUser(null)
  }

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.full_name ?? '').toLowerCase().includes(search.toLowerCase())
    const matchRole = filterRole === 'all' || u.role === filterRole
    return matchSearch && matchRole
  })

  return (
    <div className="font-['DM_Sans',sans-serif] max-w-[1400px] mx-auto mt-10">

      {/* Header */}
      <div className="flex items-start justify-between mb-7 gap-4">
        <div>
          <h1 className="font-['Playfair_Display',serif] text-2xl md:text-[26px] font-bold text-[#1a2e35] m-0 mb-1">
            Users
          </h1>
          <p className="m-0 text-[#6b7280] text-sm">
            Manage staff, managers and their access
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1a2e35] text-white border-none rounded-[10px] text-sm font-semibold cursor-pointer font-['DM_Sans',sans-serif] shrink-0 hover:bg-[#243f49] transition-colors duration-150"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <input
          type="search"
          name="user-search-query"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoComplete="off"
          className="flex-1 min-w-[200px] px-3.5 py-2.5 border-[1.5px] border-[#e5e7eb] rounded-[10px] text-sm text-[#1a2e35] outline-none font-['DM_Sans',sans-serif] bg-white focus:border-[#8cc7c4] transition-colors duration-150"
        />
        <select
          value={filterRole}
          onChange={e => setFilterRole(e.target.value as Role | 'all')}
          className="px-3.5 py-2.5 border-[1.5px] border-[#e5e7eb] rounded-[10px] text-sm text-[#1a2e35] outline-none font-['DM_Sans',sans-serif] bg-white cursor-pointer focus:border-[#8cc7c4] transition-colors duration-150"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="staff">Staff</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-[0_1px_8px_rgba(26,46,53,0.06)] overflow-hidden border border-[#f0f0f0]">

        {/* Table header — hidden on mobile */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_120px] px-5 py-3 bg-[#f8fafc] border-b border-[#f0f0f0] text-[11px] font-semibold text-[#6b7280] uppercase tracking-[0.5px]">
          <div>User</div>
          <div>Role</div>
          <div>Status</div>
          <div>Last Login</div>
          <div>Actions</div>
        </div>

        {loading ? (
          <div className="py-10 text-center text-[#9ca3af] text-sm">Loading users...</div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-[#9ca3af] text-sm">No users found</div>
        ) : filtered.map((user, i) => (
          <div
            key={user.id}
            className={`
              flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr_120px]
              px-5 py-4 md:items-center gap-3 md:gap-0
              hover:bg-[#fafafa] transition-colors duration-100
              ${i < filtered.length - 1 ? 'border-b border-[#f9f9f9]' : ''}
            `}
          >
            {/* User info */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#8cc7c4] flex items-center justify-center text-sm font-bold text-[#1a2e35] shrink-0">
                {(user.full_name || user.email).charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-semibold text-[#1a2e35]">
                  {user.full_name || '—'}
                </div>
                <div className="text-xs text-[#6b7280]">{user.email}</div>
              </div>
            </div>

            {/* Role */}
            <div>
              <span className={`inline-block px-2.5 py-[3px] rounded-full text-xs font-semibold capitalize ${roleBadge[user.role]}`}>
                {user.role}
              </span>
            </div>

            {/* Status toggle */}
            <div>
              <button
                onClick={() => toggleActive(user)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-none text-xs font-semibold cursor-pointer font-['DM_Sans',sans-serif] transition-colors duration-150
                  ${user.is_active
                    ? 'bg-[#dcfce7] text-[#166534] hover:bg-[#bbf7d0]'
                    : 'bg-[#fee2e2] text-[#991b1b] hover:bg-[#fecaca]'
                  }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-[#16a34a]' : 'bg-[#dc2626]'}`} />
                {user.is_active ? 'Active' : 'Inactive'}
              </button>
            </div>

            {/* Last login */}
            <div className="text-[13px] text-[#6b7280]">
              <span className="md:hidden text-xs text-[#9ca3af] mr-1">Last login:</span>
              {timeAgo(user.last_login)}
            </div>

            {/* Actions */}
            <div>
              <button
                onClick={() => setEditUser(user)}
                className="px-3 py-1.5 rounded-lg border-[1.5px] border-[#e5e7eb] bg-white text-xs font-semibold text-[#1a2e35] cursor-pointer font-['DM_Sans',sans-serif] hover:border-[#8cc7c4] transition-colors duration-150"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Role Modal */}
      {editUser && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] px-4"
          onClick={() => setEditUser(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 w-full max-w-[380px] shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="font-['Playfair_Display',serif] text-lg font-bold text-[#1a2e35] m-0 mb-1">
              Edit User
            </h2>
            <p className="text-[#6b7280] text-[13px] m-0 mb-6">{editUser.email}</p>

            <label className="block text-[13px] font-semibold text-[#374151] mb-2">Role</label>
            <select
              defaultValue={editUser.role}
              onChange={e => updateRole(editUser.id, e.target.value as Role)}
              className="w-full px-3.5 py-[11px] border-[1.5px] border-[#e5e7eb] rounded-[10px] text-sm text-[#1a2e35] outline-none font-['DM_Sans',sans-serif] bg-white box-border cursor-pointer focus:border-[#8cc7c4]"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
            </select>

            <button
              onClick={() => setEditUser(null)}
              className="mt-5 w-full py-[11px] bg-[#f4f6f8] border-none rounded-[10px] text-sm font-semibold text-[#1a2e35] cursor-pointer font-['DM_Sans',sans-serif] hover:bg-[#e9ecef] transition-colors duration-150"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <AddUserModal onClose={() => setShowAddModal(false)} onAdded={fetchUsers} />
      )}
    </div>
  )
}

function AddUserModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<Role>('staff')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAdd = async () => {
    setLoading(true)
    setError('')
    const result = await createUser({ email, password, fullName, role })
    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }
    onAdded()
    onClose()
  }

  const fields = [
    { label: 'Full Name', value: fullName, setter: setFullName, type: 'text',     placeholder: 'Jane Smith',        autoComplete: 'off'          },
    { label: 'Email',     value: email,    setter: setEmail,    type: 'email',    placeholder: 'jane@easyway.com',  autoComplete: 'new-email'    },
    { label: 'Password',  value: password, setter: setPassword, type: 'password', placeholder: '••••••••',          autoComplete: 'new-password' },
  ]

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-[400px] shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="font-['Playfair_Display',serif] text-lg font-bold text-[#1a2e35] m-0 mb-6">
          Add New User
        </h2>

        {/* Decoy inputs to trap browser autofill */}
        <input type="text" name="fakeusernameremembered" autoComplete="username" style={{ display: 'none' }} readOnly />
        <input type="password" name="fakepasswordremembered" autoComplete="current-password" style={{ display: 'none' }} readOnly />

        {fields.map(field => (
          <div key={field.label} className="mb-4">
            <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">
              {field.label}
            </label>
            <input
              type={field.type}
              value={field.value}
              onChange={e => field.setter(e.target.value)}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
              name={`new-user-${field.label.toLowerCase().replace(' ', '-')}`}
              className="w-full px-3.5 py-[11px] border-[1.5px] border-[#e5e7eb] rounded-[10px] text-sm text-[#1a2e35] outline-none box-border font-['DM_Sans',sans-serif] focus:border-[#8cc7c4] transition-colors duration-150"
            />
          </div>
        ))}

        <div className="mb-6">
          <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">Role</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value as Role)}
            className="w-full px-3.5 py-[11px] border-[1.5px] border-[#e5e7eb] rounded-[10px] text-sm text-[#1a2e35] outline-none font-['DM_Sans',sans-serif] bg-white box-border cursor-pointer focus:border-[#8cc7c4]"
          >
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {error && (
          <div className="bg-[#fef2f2] border border-[#fecaca] rounded-lg px-3.5 py-2.5 mb-4 text-[13px] text-[#dc2626]">
            {error}
          </div>
        )}

        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-[11px] bg-[#f4f6f8] border-none rounded-[10px] text-sm font-semibold text-[#1a2e35] cursor-pointer font-['DM_Sans',sans-serif] hover:bg-[#e9ecef] transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={loading || !email || !password}
            className={`flex-1 py-[11px] border-none rounded-[10px] text-sm font-semibold text-white font-['DM_Sans',sans-serif] transition-colors duration-150
              ${loading || !email || !password
                ? 'bg-[#a8d5d3] cursor-not-allowed'
                : 'bg-[#1a2e35] cursor-pointer hover:bg-[#243f49]'
              }`}
          >
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  )
}