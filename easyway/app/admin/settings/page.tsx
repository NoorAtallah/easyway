import Link from 'next/link'
import { ChevronRight, Maximize2, Tag , Mail, Star} from 'lucide-react'

export default function SettingsPage() {
  const sections = [
    {
      href: '/admin/settings/job-sizes',
      icon: <Maximize2 size={20} />,
      title: 'Job Sizes',
      description: 'Manage the size options customers see when requesting a quote.',
    },
    {
      href: '/admin/settings/coupons',
      icon: <Tag size={20} />,
      title: 'Coupons',
      description: 'Create and manage discount codes for customers.',
    },
    {
  href: '/admin/settings/email',
  icon: <Mail size={20} />,
  title: 'Email Templates',
  description: 'Customize email branding, subject line, footer and attachments.',
},
{
  href: '/admin/settings/reviews',
  icon: <Star size={20} />,
  title: 'Reviews',
  description: 'Manage customer reviews shown on the public website.',
},
{
  href: '/admin/settings/moving-pricing',
  icon: <Star size={20} />,
  title: 'Moving Pricing',
  description: 'Manage the pricing ranges for moving services.',
}
  ]

  return (
    <div className="p-6 md:p-8 font-['DM_Sans',sans-serif] max-w-[900px]">
      <h1 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1a2e35] m-0">
        Settings
      </h1>
      <p className="text-sm text-[#718096] mt-1 mb-6">
        Configure how your booking forms and services work.
      </p>

      <div className="grid gap-3">
        {sections.map(({ href, icon, title, description }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 p-5 bg-white border border-[#dde3ea] rounded-lg hover:border-[#8cc7c4] hover:shadow-sm transition-all no-underline group"
          >
            <div className="w-11 h-11 rounded-lg bg-[#8cc7c4]/[0.14] text-[#1a2e35] flex items-center justify-center shrink-0">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-semibold text-[#1a2e35] mb-0.5">{title}</div>
              <div className="text-xs text-[#718096] leading-[1.5]">{description}</div>
            </div>
            <ChevronRight size={18} className="text-[#9aa5b4] group-hover:text-[#8cc7c4] transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}