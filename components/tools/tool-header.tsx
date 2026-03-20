import { cn } from '@/lib/utils'

type IconVariant = 'g' | 'b' | 'v' | 'o' | 'k'

const iconVariants: Record<IconVariant, string> = {
  g: 'bg-green-50 text-green-600',
  b: 'bg-blue-50 text-blue-600',
  v: 'bg-violet-50 text-violet-600',
  o: 'bg-orange-50 text-orange-500',
  k: 'bg-zinc-100 text-zinc-600',
}

interface ToolHeaderProps {
  icon: React.ReactNode
  iconClass?: IconVariant
  name: string
  subtitle: string
  count?: number | null
  countLoading?: boolean
}

export function ToolHeader({ icon, iconClass = 'k', name, subtitle, count, countLoading }: ToolHeaderProps) {
  return (
    <div className="flex items-start gap-3 mb-[22px]">
      <div className={cn(
        'w-[46px] h-[46px] xl:w-[52px] xl:h-[52px] rounded-[10px] flex items-center justify-center flex-shrink-0',
        iconVariants[iconClass]
      )}>
        <span className="[&>svg]:w-[22px] [&>svg]:h-[22px] xl:[&>svg]:w-[25px] xl:[&>svg]:h-[25px]">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[19px] font-extrabold text-zinc-900 tracking-[-0.3px] leading-[1.25] md:text-[20px] xl:text-[22px]">
          {name}
        </div>
        <div className="text-[12.5px] text-zinc-500 mt-[3px] font-medium xl:text-[13px]">{subtitle}</div>
        <div className="flex items-center gap-1.5 mt-[7px] h-4">
          {countLoading ? (
            <div className="h-[10px] w-[110px] bg-zinc-100 rounded-full animate-pulse" />
          ) : count != null ? (
            <>
              <span className="w-[6px] h-[6px] rounded-full bg-green-500 animate-pulse flex-shrink-0" />
              <span className="text-[11.5px] text-zinc-400 font-medium">
                {count.toLocaleString()} total requests
              </span>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
