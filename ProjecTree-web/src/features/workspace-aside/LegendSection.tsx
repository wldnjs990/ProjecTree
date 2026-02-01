import { cn } from '@/lib/utils'

interface LegendItem {
  label: string
  color: string
  borderColor: string
}

const legendItems: LegendItem[] = [
  { label: 'Frontend', color: 'bg-[#ECFDF5]', borderColor: 'border-[#00D492]' },
  { label: 'Backend', color: 'bg-[#FFF7ED]', borderColor: 'border-[#FF8904]' },
]

export function LegendSection() {
  return (
    <div className="p-3 border-t border-[#DEDEDE]">
      <p className="text-xs font-medium text-[#636363] mb-2">범례</p>

      <div className="space-y-1.5">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div
              className={cn(
                'w-3 h-3 rounded border-2',
                item.color,
                item.borderColor
              )}
            />
            <span className="text-xs text-[#636363]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
