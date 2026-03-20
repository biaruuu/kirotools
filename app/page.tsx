import Link from 'next/link'
import { cn } from '@/lib/utils'
import { CheckUidIcon, SearchIcon, MessageSquareIcon, FileTextIcon, ChevronRightIcon } from '@/components/icons'

const TOOL_SECTIONS = [
  {
    heading: 'Facebook Tools',
    tools: [
      {
        href: '/check-live-uid',
        name: 'Check Live UID Facebook',
        desc: 'Check if Facebook UIDs are live or dead — up to 50 at once',
        icon: 'check-uid',
        iconBg: 'bg-green-50',
        iconFg: 'text-green-600',
      },
      {
        href: '/find-facebook-id',
        name: 'Find Facebook ID',
        desc: 'Find Facebook numeric IDs from any profile or group URL',
        icon: 'search',
        iconBg: 'bg-blue-50',
        iconFg: 'text-blue-600',
      },
      {
        href: '/find-post-id',
        name: 'Find Facebook Post ID',
        desc: 'Extract numeric Post IDs from any Facebook post URL',
        icon: 'message-square',
        iconBg: 'bg-violet-50',
        iconFg: 'text-violet-600',
      },
    ],
  },
  {
    heading: 'Resources',
    tools: [
      {
        href: '/documentation',
        name: 'API Documentation',
        desc: 'Full API reference for KiroTools endpoints',
        icon: 'file-text',
        iconBg: 'bg-orange-50',
        iconFg: 'text-orange-500',
      },
    ],
  },
]

function ToolIcon({ type, className }: { type: string; className?: string }) {
  if (type === 'check-uid') return <CheckUidIcon className={className} />
  if (type === 'search') return <SearchIcon className={className} />
  if (type === 'message-square') return <MessageSquareIcon className={className} />
  return <FileTextIcon className={className} />
}

export default function HomePage() {
  return (
    <main className="max-w-[720px] mx-auto px-4 pb-16 pt-5 sm:px-5 sm:pt-6 md:px-7 md:pt-7 lg:max-w-[840px] lg:px-10 lg:pt-8 xl:max-w-[960px] xl:px-14">
      {/* Hero */}
      <div className="text-center py-8 pb-5 mb-5 sm:py-10 sm:mb-6">
        <div className="inline-flex items-center gap-1.5 h-[26px] px-3 bg-zinc-100 border border-zinc-200 rounded-full text-[11.5px] font-bold text-zinc-500 mb-4">
          <span className="w-[7px] h-[7px] rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
          Free Facebook Tools
        </div>
        <h1 className="text-[27px] font-black text-zinc-900 tracking-[-0.6px] mb-3 leading-[1.15] sm:text-[32px] md:text-[36px] lg:text-[40px]">
          Welcome to KiroTools
        </h1>
        <p className="text-[14px] text-zinc-500 max-w-[380px] mx-auto leading-[1.7] font-medium">
          Fast, free Facebook tools — check live UIDs, find Facebook IDs, extract post IDs, and more.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-5 sm:gap-2.5">
        {[
          { val: '50', lbl: 'UIDs / batch', valCls: 'text-emerald-600' },
          { val: '3', lbl: 'Tools', valCls: 'text-blue-600' },
          { val: 'Fast', lbl: 'Results', valCls: 'text-amber-600' },
        ].map(s => (
          <div key={s.lbl} className="bg-white border border-zinc-200 rounded-xl px-2.5 py-3.5 text-center shadow-[0_1px_3px_rgba(0,0,0,.06)] hover:border-zinc-300 hover:shadow-[0_2px_6px_rgba(0,0,0,.08)] transition-all sm:py-4">
            <div className={cn('text-[22px] font-black tracking-[-0.5px] leading-none mb-1', s.valCls)}>{s.val}</div>
            <div className="text-[11px] text-zinc-400 font-semibold">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Tool Sections */}
      {TOOL_SECTIONS.map(section => (
        <div key={section.heading}>
          <div className="flex items-center gap-2.5 mb-2 pl-px">
            <div className="text-[10.5px] font-extrabold tracking-[.1em] uppercase text-zinc-400 whitespace-nowrap">
              {section.heading}
            </div>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>
          <div className="flex flex-col gap-[7px] mb-5">
            {section.tools.map(tool => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group bg-white border border-zinc-200 rounded-xl px-3.5 py-3 flex items-center gap-3 no-underline text-inherit shadow-[0_1px_3px_rgba(0,0,0,.06)] hover:border-zinc-300 hover:shadow-[0_4px_14px_rgba(0,0,0,.08),0_1px_3px_rgba(0,0,0,.04)] hover:-translate-y-px active:scale-[.99] active:translate-y-0 transition-all duration-200"
              >
                <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${tool.iconBg} ${tool.iconFg}`}>
                  <ToolIcon type={tool.icon} className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold text-zinc-800 whitespace-nowrap overflow-hidden text-ellipsis">{tool.name}</div>
                  <div className="text-[12px] text-zinc-400 whitespace-nowrap overflow-hidden text-ellipsis mt-px font-medium">{tool.desc}</div>
                </div>
                <ChevronRightIcon className="w-[15px] h-[15px] text-zinc-300 flex-shrink-0 group-hover:text-zinc-500 group-hover:translate-x-[2px] transition-all duration-200" />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </main>
  )
}
