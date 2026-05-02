import { Clock } from 'lucide-react'

export default function ComingSoon({ service }: { service: string }) {
  return (
    <div className="bg-white border border-[#dde3ea] rounded-lg p-12 text-center">
      <div className="w-12 h-12 rounded-full bg-[#8cc7c4]/[0.12] flex items-center justify-center mx-auto mb-4">
        <Clock size={22} className="text-[#8cc7c4]" />
      </div>
      <h3 className="font-['Playfair_Display',serif] text-lg font-bold text-[#1a2e35] m-0 mb-1">
        {service} form not built yet
      </h3>
      <p className="text-[#718096] text-sm max-w-[360px] mx-auto leading-[1.6]">
        Once you build the public {service.toLowerCase()} quote form, submissions will show up here automatically.
      </p>
    </div>
  )
}