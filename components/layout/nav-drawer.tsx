'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { LogoIcon, HomeIcon, ChevronRightIcon, SearchIcon, XIcon } from '@/components/icons'
import { cn } from '@/lib/utils'

interface NavDrawerProps {
  open: boolean
  onClose: () => void
}

const NAV_ITEMS = [
  { href: '/check-live-uid', label: 'Check Live UID Facebook' },
  { href: '/find-facebook-id', label: 'Find Facebook ID' },
  { href: '/find-post-id', label: 'Find Facebook Post ID' },
]

export function NavDrawer({ open, onClose }: NavDrawerProps) {
  const pathname = usePathname()
  const [query, setQuery] = useState('')
  const [sectionOpen, setSectionOpen] = useState(true)

  const filtered = query
    ? NAV_ITEMS.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
    : NAV_ITEMS

  return (
    <Sheet open={open} onOpenChange={v => { if (!v) onClose() }}>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-[270px] p-0 flex flex-col gap-0 border-r border-zinc-200 bg-white"
      >
        {/* Header */}
        <div className="h-14 border-b border-zinc-200 flex items-center justify-between px-3.5 flex-shrink-0">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[7px] bg-zinc-900 flex items-center justify-center flex-shrink-0">
              <LogoIcon className="w-[15px] h-[15px]" />
            </div>
            <span className="text-[15px] font-extrabold text-zinc-900">KiroTools</span>
          </Link>
          <button
            onClick={onClose}
            className="w-[30px] h-[30px] rounded-md flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
          >
            <XIcon className="w-[15px] h-[15px]" />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-[9px] border-b border-zinc-200 flex-shrink-0">
          <div className="relative">
            <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-[13px] h-[13px] text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search tools…"
              className="w-full h-[31px] bg-zinc-100 border border-transparent rounded-md pl-[27px] pr-2.5 text-[12.5px] text-zinc-700 font-[family-name:var(--font-sans)] outline-none focus:border-zinc-400 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-1.5 pb-6">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-2.5 text-[11px] font-extrabold uppercase tracking-[.08em] text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            <HomeIcon className="w-3 h-3" />
            All Tools
          </Link>

          <div className="mb-0.5">
            <button
              onClick={() => setSectionOpen(v => !v)}
              className="w-full flex items-center justify-between px-3.5 py-1.5 text-[10.5px] font-extrabold tracking-[.08em] uppercase text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              Facebook Tools
              <ChevronRightIcon
                className={cn(
                  'w-[11px] h-[11px] flex-shrink-0 transition-transform duration-200',
                  sectionOpen && 'rotate-90'
                )}
              />
            </button>

            {sectionOpen && (
              <div className="py-0.5">
                {filtered.length > 0 ? (
                  filtered.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'block px-3.5 py-[7px] pl-[18px] text-[13px] font-medium border-l-[2.5px] rounded-r-md mb-px transition-all',
                        pathname === item.href
                          ? 'bg-zinc-100 text-zinc-900 font-bold border-l-zinc-900'
                          : 'text-zinc-600 border-l-transparent hover:bg-zinc-50 hover:text-zinc-800'
                      )}
                    >
                      {item.label}
                    </Link>
                  ))
                ) : (
                  <p className="px-3.5 py-2 text-[12px] text-zinc-400">No results</p>
                )}
              </div>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
