import { cn } from '@/lib/utils'

interface ToolHeaderProps {
  icon: React.ReactNode
  iconClass?: 'g' | 'k'
  name: string
  subtitle: string
}

export function ToolHeader({ icon, iconClass = 'k', name, subtitle }: ToolHeaderProps) {
  return (
    <div className="flex items-start gap-3 mb-[22px]">
      <div className={cn(
        'w-[46px] h-[46px] xl:w-[52px] xl:h-[52px] rounded-[10px] flex items-center justify-center flex-shrink-0',
        iconClass === 'g' ? 'bg-green-50 text-green-600' : 'bg-zinc-100 text-zinc-600'
      )}>
        <span className="[&>svg]:w-[22px] [&>svg]:h-[22px] xl:[&>svg]:w-[25px] xl:[&>svg]:h-[25px]">{icon}</span>
      </div>
      <div>
        <div className="text-[19px] font-extrabold text-zinc-900 tracking-[-0.3px] leading-[1.25] md:text-[20px] xl:text-[22px]">
          {name}
        </div>
        <div className="text-[12.5px] text-zinc-500 mt-[3px] font-medium xl:text-[13px]">{subtitle}</div>
      </div>
    </div>
  )
}
