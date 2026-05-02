"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import NotificationBell from "./components/NotificationBell";

type Role = "admin" | "manager" | "staff";

const OverviewIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    className="shrink-0"
  >
    <rect
      x="3"
      y="3"
      width="7"
      height="7"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="2"
    />
    <rect
      x="14"
      y="3"
      width="7"
      height="7"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="2"
    />
    <rect
      x="3"
      y="14"
      width="7"
      height="7"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="2"
    />
    <rect
      x="14"
      y="14"
      width="7"
      height="7"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const BookingsIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    className="shrink-0"
  >
    <rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M16 2v4M8 2v4M3 10h18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const CustomersIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    className="shrink-0"
  >
    <path
      d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
    <path
      d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const ServicesIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    className="shrink-0"
  >
    <path
      d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    className="shrink-0"
  >
    <path
      d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
    <path
      d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    className="shrink-0"
  >
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    <path
      d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const ChevronIcon = ({ collapsed }: { collapsed: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    className={`transition-transform duration-300 ${collapsed ? "rotate-180" : "rotate-0"}`}
  >
    <path
      d="M15 18l-6-6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const allNavItems = [
  {
    label: "Overview",
    href: "/admin",
    roles: ["admin", "manager", "staff"],
    Icon: OverviewIcon,
  },
  {
    label: "Bookings",
    href: "/admin/bookings",
    roles: ["admin", "manager", "staff"],
    Icon: BookingsIcon,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    roles: ["admin", "manager"],
    Icon: CustomersIcon,
  },
  {
    label: "Services",
    href: "/admin/services",
    roles: ["admin"],
    Icon: ServicesIcon,
  },
  { label: "Users", href: "/admin/users", roles: ["admin"], Icon: UsersIcon },
  {
    label: "Settings",
    href: "/admin/settings",
    roles: ["admin"],
    Icon: SettingsIcon,
  },
];

const roleBadgeColors: Record<Role, string> = {
  admin: "bg-[#8cc7c4] text-[#1a2e35]",
  manager: "bg-[#f59e0b] text-[#1a2e35]",
  staff: "bg-white/15 text-white/70",
};

export default function AdminSidebar({
  userEmail,
  userRole,
  userName,
  collapsed,
  onCollapsedChange,
}: {
  userEmail: string;
  userRole: Role;
  userName: string;
  collapsed: boolean;
  onCollapsedChange: (val: boolean) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = allNavItems.filter((item) => item.roles.includes(userRole));

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const sidebarContent = (isCollapsed: boolean) => (
    <>
      {/* Logo */}
      <div
        className={`border-b border-white/[0.08] ${isCollapsed ? "px-3 py-7" : "px-6 py-7"}`}
      >
        <div
          className={`flex items-center ${isCollapsed ? "justify-center" : "gap-2.5"}`}
        >
          <div className="w-[34px] h-[34px] bg-[#8cc7c4] rounded-lg flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 22V12h6v10"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {!isCollapsed && (
            <div>
              <div className="font-['Playfair_Display',serif] text-[17px] font-bold text-white leading-none">
                EasyWay
              </div>
              <div className="text-[11px] text-[#8cc7c4] mt-0.5 font-medium">
                Admin Panel
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navItems.map(({ label, href, Icon }) => {
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={isCollapsed ? label : undefined}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] mb-0.5 text-sm transition-all duration-150 no-underline
                ${
                  isActive
                    ? "bg-[#8cc7c4] text-[#1a2e35] font-semibold"
                    : "text-white/65 font-normal hover:bg-white/[0.07] hover:text-white"
                }
                ${isCollapsed ? "justify-center" : ""}
              `}
            >
              <Icon />
              {!isCollapsed && label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-white/[0.08] px-3 py-4">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5 px-3 py-2.5 mb-1">
            <div className="w-8 h-8 rounded-full bg-[#8cc7c4] flex items-center justify-center text-[13px] font-bold text-[#1a2e35] shrink-0">
              {(userName || userEmail).charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-white font-medium truncate">
                {userName || userEmail}
              </div>
              <span
                className={`inline-block mt-0.5 text-[10px] font-bold uppercase tracking-[0.5px] px-1.5 py-[2px] rounded-full ${roleBadgeColors[userRole]}`}
              >
                {userRole}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-1 px-3 py-2">
            <div
              className="w-8 h-8 rounded-full bg-[#8cc7c4] flex items-center justify-center text-[13px] font-bold text-[#1a2e35]"
              title={userName || userEmail}
            >
              {(userName || userEmail).charAt(0).toUpperCase()}
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          title={isCollapsed ? "Sign out" : undefined}
          className={`w-full flex items-center gap-2.5 px-3 py-[9px] rounded-[10px] border-none bg-transparent text-white/50 text-sm cursor-pointer font-['DM_Sans',sans-serif] transition-all duration-150 hover:bg-white/[0.06] hover:text-white
            ${isCollapsed ? "justify-center" : ""}
          `}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="shrink-0"
          >
            <path
              d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {!isCollapsed && "Sign out"}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-[110] bg-[#1a2e35] border-b border-white/[0.08] flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#8cc7c4] rounded-lg flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 22V12h6v10"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-['Playfair_Display',serif] text-[16px] font-bold text-white">
            EasyWay
          </span>
        </div>

        <div className="flex items-center gap-1">
          <NotificationBell />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-9 h-9 flex flex-col items-center justify-center gap-[5px] bg-transparent border-none cursor-pointer"
          >
            <span
              className={`block w-5 h-[1.5px] bg-white/70 transition-all duration-200 ${mobileOpen ? "rotate-45 translate-y-[6.5px]" : ""}`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-white/70 transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-white/70 transition-all duration-200 ${mobileOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-[105] bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`
        md:hidden fixed top-14 left-0 h-[calc(100vh-56px)] w-[240px] bg-[#1a2e35] z-[106]
        flex flex-col font-['DM_Sans',sans-serif]
        transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {sidebarContent(false)}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`
          hidden md:flex flex-col fixed top-0 left-0 h-screen bg-[#1a2e35]
          font-['DM_Sans',sans-serif] z-[100]
          transition-[width] duration-300 ease-in-out
          ${collapsed ? "w-[68px]" : "w-[240px]"}
        `}
      >
        {sidebarContent(collapsed)}

        {/* Collapse toggle */}
        <button
          onClick={() => onCollapsedChange(!collapsed)}
          className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-[#1a2e35] border border-white/20 flex items-center justify-center text-white/60 hover:text-white cursor-pointer transition-colors duration-150"
        >
          <ChevronIcon collapsed={collapsed} />
        </button>
      </aside>
    </>
  );
}
