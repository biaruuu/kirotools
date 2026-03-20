'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { ToolHeader } from '@/components/tools/tool-header'
import { InfoTabs } from '@/components/tools/info-tabs'
import { SearchIcon, RefreshIcon, CopyIcon, GeistSpinner } from '@/components/icons'
import { cn } from '@/lib/utils'

async function clip(text: string, label = 'Copied') {
  try {
    if (navigator.clipboard) await navigator.clipboard.writeText(text)
    else {
      const a = document.createElement('textarea')
      a.value = text; a.style.cssText = 'position:fixed;opacity:0'
      document.body.appendChild(a); a.select(); document.execCommand('copy'); document.body.removeChild(a)
    }
    toast.success(`${label}!`)
  } catch { toast.error('Copy failed') }
}

export default function FindFacebookIDPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function handleFind() {
    const trimmed = url.trim()
    if (!trimmed) { toast.error('Please enter a Facebook URL'); return }

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/find-facebook-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Server error ${res.status}`)
      if (data.success === false) throw new Error(data.error || 'Lookup failed')

      const id = String(data.uid ?? data.id ?? '').trim()
      if (!id) throw new Error('No ID returned from server')

      setResult(id)
      toast.success('ID found!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to find ID')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setUrl(''); setResult(null)
    toast.info('Reset!')
  }

  return (
    <main className="max-w-[720px] mx-auto px-4 pb-16 pt-5 sm:px-5 sm:pt-6 md:px-7 md:pt-7 lg:max-w-[840px] lg:px-10 lg:pt-8 xl:max-w-[960px] xl:px-14">
      <ToolHeader
        icon={<SearchIcon />}
        iconClass="k"
        name="Find Facebook ID"
        subtitle="Find numeric Facebook IDs from any profile or group URL"
      />

      {/* Input card */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden mb-2.5 shadow-[0_1px_3px_rgba(0,0,0,.06)]">
        <div className="p-3.5">
          <label className="block text-[13px] font-bold text-zinc-700 mb-[7px]">
            Enter Facebook URL
          </label>
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleFind()}
            placeholder="e.g. https://facebook.com/cristiano"
            autoComplete="off"
            className="w-full h-[42px] border border-zinc-200 rounded-[10px] px-3 text-[14px] text-zinc-800 bg-white outline-none focus:border-zinc-600 focus:shadow-[0_0_0_3px_rgba(39,39,42,.08)] transition-all placeholder:text-zinc-400"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mb-3.5">
        <button
          onClick={handleFind}
          disabled={loading}
          className="flex-1 h-[42px] bg-zinc-900 text-white rounded-[10px] text-[14px] font-bold inline-flex items-center justify-center gap-[7px] border border-zinc-900 hover:bg-zinc-700 hover:border-zinc-700 active:scale-[.97] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? <><GeistSpinner /> Finding…</> : <><SearchIcon className="w-[13px] h-[13px]" />Find Facebook ID</>}
        </button>
        <button
          onClick={handleReset}
          className="h-[42px] px-[18px] bg-white text-zinc-600 rounded-[10px] text-[14px] font-bold inline-flex items-center gap-[7px] border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-800 active:scale-[.97] transition-all"
        >
          <RefreshIcon className="w-[13px] h-[13px]" />Reset
        </button>
      </div>

      {/* Result card */}
      {result && (
        <div className="bg-zinc-900 rounded-xl px-[18px] py-[22px] mb-3.5 text-center animate-scale-in">
          <div>
            <div className="text-[10.5px] font-extrabold uppercase tracking-[.12em] text-zinc-500 mb-2.5">
              Facebook ID
            </div>
            <div className="text-[30px] font-black text-white tracking-[-1px] leading-none mb-4 break-all sm:text-[34px]">
              {result}
            </div>
            <button
              onClick={() => clip(result, 'ID copied')}
              className="inline-flex items-center gap-1.5 h-9 px-4 bg-zinc-800 text-white border border-zinc-700 rounded-md text-[13px] font-bold hover:bg-zinc-700 hover:border-zinc-600 active:scale-[.96] transition-all"
            >
              <CopyIcon className="w-[13px] h-[13px]" />
              Copy ID
            </button>
          </div>
        </div>
      )}

      {/* Info Tabs */}
      <InfoTabs
        steps={[
          { title: 'Copy the URL', desc: 'Copy a Facebook Profile, Group, or Page URL from your browser address bar.' },
          { title: 'Paste & Search', desc: 'Paste into the input field and click Find Facebook ID.' },
          { title: 'Copy the ID', desc: 'The numeric Facebook ID appears. Click Copy ID to copy it instantly.' },
        ]}
        about={
          <>
            <p>The <strong>Find Facebook ID</strong> tool retrieves the numeric ID behind any Facebook profile, group, or page URL. Paste a URL and get the ID instantly.</p>
            <p>Useful for API integrations, ad targeting, and data exports that require numeric Facebook IDs.</p>
          </>
        }
        faqs={[
          { q: 'What URL types are supported?', a: 'Profile, Group, and Page URLs. You can also enter a username directly (e.g. cristiano).' },
          { q: 'Why might a lookup fail?', a: 'Private profiles, malformed URLs, or temporary rate limiting. Wait a moment and retry.' },
          { q: 'What is the API response format?', a: 'The server returns {"success":true,"uid":"12345"} — the numeric UID is in the uid field.' },
        ]}
      />
    </main>
  )
}
