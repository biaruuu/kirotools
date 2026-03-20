'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { NavDrawer } from './nav-drawer'
import { LogoIcon, MenuIcon, SearchIcon, ChevronRightIcon, ToolIcon } from '@/components/icons'
import { cn } from '@/lib/utils'
import { TOOLS, BREADCRUMBS } from '@/lib/tools'

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function SearchDropdown({
  inputId,
  dropId,
  isMobile = false,
  autoFocus = false,
  onSelect,
}: {
  inputId: string
  dropId: string
  isMobile?: boolean
  autoFocus?: boolean
  onSelect?: () => void
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  const results = query
    ? TOOLS.filter(
        t =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.desc.toLowerCase().includes(query.toLowerCase())
      )
    : []

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <div ref={wrapRef} className="relative w-full">
      <SearchIcon className="absolute left-[9px] top-1/2 -translate-y-1/2 w-[13px] h-[13px] text-zinc-400 pointer-events-none" />
      <input
        id={inputId}
        type="text"
        value={query}
        autoFocus={autoFocus}
        onChange={e => {
          setQuery(e.target.value)
          setOpen(!!e.target.value.trim())
        }}
        onKeyDown={e => {
          if (e.key === 'Escape') { setQuery(''); setOpen(false) }
          if (e.key === 'Enter' && results[0]) {
            router.push(results[0].url)
            setQuery(''); setOpen(false)
            onSelect?.()
          }
        }}
        placeholder="Search tools…"
        autoComplete="off"
        className={cn(
          'w-full bg-zinc-100 border border-zinc-200 rounded-md outline-none text-zinc-700 transition-all',
          'pl-[28px] pr-2.5 focus:border-zinc-500 focus:bg-white',
          isMobile ? 'h-[35px] text-[13px]' : 'h-[31px] text-[12.5px]'
        )}
      />
      {open && (
        <div
          id={dropId}
          className="absolute top-[calc(100%+7px)] left-0 right-0 bg-white border border-zinc-200 rounded-xl shadow-lg z-[200] overflow-hidden"
        >
          {results.length === 0 ? (
            <div className="py-3.5 px-3 text-center text-[12.5px] text-zinc-400">
              No tools found for &ldquo;<strong>{query}</strong>&rdquo;
            </div>
          ) : (
            results.map(t => (
              <Link
                key={t.url}
                href={t.url}
                onClick={() => { setQuery(''); setOpen(false); onSelect?.() }}
                className="flex items-center gap-2.5 px-3 py-2.5 border-b border-zinc-100 last:border-0 hover:bg-zinc-50 transition-colors"
              >
                <div className={cn(
                  'w-[30px] h-[30px] rounded-md flex items-center justify-center flex-shrink-0',
                  t.cls === 'g' ? 'bg-green-50 text-green-600' : 'bg-zinc-100 text-zinc-600'
                )}>
                  <ToolIcon iconType={t.iconType} className="w-[13px] h-[13px]" />
                </div>
                <div>
                  <div className="text-[12.5px] font-bold text-zinc-800">{t.name}</div>
                  <div className="text-[11.5px] text-zinc-400 mt-px">{t.desc}</div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const crumb = BREADCRUMBS[pathname] ?? { current: '' }

  return (
    <>
      {/* ── Topbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-zinc-200 flex items-center px-3.5 gap-2 sm:px-5 md:px-6">
        <Link href="/" className="flex items-center gap-[9px] flex-1 min-w-0 no-underline">
          <div className="w-[34px] h-[34px] rounded-[8px] bg-zinc-900 flex items-center justify-center flex-shrink-0">
            <LogoIcon className="w-[18px] h-[18px]" />
          </div>
          <span className="text-base font-extrabold text-zinc-900 tracking-[-0.4px] whitespace-nowrap">KiroTools</span>
        </Link>
        <button className="h-[33px] px-3.5 bg-zinc-900 text-white rounded-md text-[13px] font-bold flex-shrink-0 whitespace-nowrap hover:bg-zinc-700 active:scale-[.97] transition-all">
          Sign In
        </button>
      </nav>

      {/* ── Subnav ── */}
      <div className="fixed top-14 left-0 right-0 z-40 h-[46px] bg-white border-b border-zinc-200 flex items-center px-3.5 gap-2 sm:px-5 md:px-6">
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Menu"
          className="w-[34px] h-[34px] rounded-md flex items-center justify-center text-zinc-600 flex-shrink-0 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
        >
          <MenuIcon className="w-[17px] h-[17px]" />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-[5px] text-[13px] text-zinc-500 flex-1 min-w-0 overflow-hidden whitespace-nowrap sm:flex-none">
          {crumb.parent && (
            <>
              <Link href="/" className="text-zinc-500 hover:text-zinc-800 transition-colors flex-shrink-0 text-[13px]">
                {crumb.parent}
              </Link>
              <ChevronRightIcon className="w-3 h-3 text-zinc-300 flex-shrink-0" />
            </>
          )}
          <span className="text-zinc-800 font-bold overflow-hidden text-ellipsis text-[13px]">{crumb.current}</span>
        </div>

        {/* Desktop search */}
        <div className="hidden sm:flex ml-auto relative w-[280px] md:w-[320px]">
          <SearchDropdown inputId="snavInput" dropId="snavDrop" />
        </div>

        {/* Mobile search toggle */}
        <button
          id="mobSearchBtn"
          onClick={() => setMobileSearchOpen(v => !v)}
          aria-label="Search"
          className="sm:hidden ml-auto w-[34px] h-[34px] rounded-md flex items-center justify-center text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors flex-shrink-0"
        >
          <SearchIcon className="w-4 h-4" />
        </button>
      </div>

      {/* ── Mobile Search Bar ── */}
      <div
        className={cn(
          'fixed left-0 right-0 z-30 bg-white border-b border-zinc-200 px-3.5 py-2 transition-transform duration-200 sm:hidden',
          mobileSearchOpen
            ? 'top-[102px] translate-y-0 pointer-events-auto'
            : 'top-[102px] -translate-y-full pointer-events-none'
        )}
      >
        <SearchDropdown
          inputId="mobInput"
          dropId="mobDrop"
          isMobile
          autoFocus={mobileSearchOpen}
          onSelect={() => setMobileSearchOpen(false)}
        />
      </div>

      {/* ── Drawer ── */}
      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
