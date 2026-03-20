'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { ToolHeader } from '@/components/tools/tool-header'
import { InfoTabs } from '@/components/tools/info-tabs'
import { MessageSquareIcon, SearchIcon, RefreshIcon, CopyIcon, GeistSpinner } from '@/components/icons'

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

export default function FindPostIDPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function handleFind() {
    const trimmed = url.trim()
    if (!trimmed) { toast.error('Please enter a Facebook post URL'); return }
    if (!trimmed.includes('facebook.com')) { toast.error('Please enter a valid Facebook URL'); return }

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/find-post-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Server error ${res.status}`)

      const id = String(data.postId ?? data.id ?? '').trim()
      if (!id) throw new Error('No Post ID returned. The post may be private or the URL is unsupported.')

      setResult(id)
      toast.success('Post ID found!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to extract Post ID')
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
        icon={<MessageSquareIcon />}
        iconClass="k"
        name="Find Facebook Post ID"
        subtitle="Extract numeric Post IDs from any Facebook post URL"
      />

      {/* Input card */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden mb-2.5 shadow-[0_1px_3px_rgba(0,0,0,.06)]">
        <div className="p-3.5">
          <label className="block text-[13px] font-bold text-zinc-700 mb-[7px]">
            Enter Facebook Post URL
          </label>
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleFind()}
            placeholder="e.g. https://facebook.com/username/posts/123456789"
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
          {loading ? <><GeistSpinner /> Finding…</> : <><SearchIcon className="w-[13px] h-[13px]" />Find Post ID</>}
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
              Facebook Post ID
            </div>
            <div className="text-[30px] font-black text-white tracking-[-1px] leading-none mb-4 break-all sm:text-[34px]">
              {result}
            </div>
            <button
              onClick={() => clip(result, 'Post ID copied')}
              className="inline-flex items-center gap-1.5 h-9 px-4 bg-zinc-800 text-white border border-zinc-700 rounded-md text-[13px] font-bold hover:bg-zinc-700 hover:border-zinc-600 active:scale-[.96] transition-all"
            >
              <CopyIcon className="w-[13px] h-[13px]" />
              Copy Post ID
            </button>
          </div>
        </div>
      )}

      {/* Info Tabs */}
      <InfoTabs
        steps={[
          { title: 'Open the Facebook post', desc: 'Navigate to any Facebook post — from a profile, group, page, or shared content.' },
          { title: 'Copy the post URL', desc: 'Click the post timestamp or three-dot menu → Copy link. Then paste the full URL into the input field.' },
          { title: 'Click Find Post ID', desc: 'Hit the button and the numeric Post ID will appear instantly in the result card below.' },
          { title: 'Copy the ID', desc: 'Click Copy Post ID to copy the numeric ID directly to your clipboard.' },
        ]}
        about={
          <>
            <p>The <strong>Find Facebook Post ID</strong> tool extracts the unique numeric ID from any Facebook post URL — whether it&apos;s from a profile, group, page, or shared post.</p>
            <p>Post IDs are useful for Facebook Graph API calls, ad targeting, embedding posts, and tracking content programmatically.</p>
          </>
        }
        faqs={[
          { q: 'What types of post URLs are supported?', a: 'Profile posts, group posts, page posts, and shared posts. The URL can be in any standard Facebook format including facebook.com/permalink, /posts/, and /photo/ style links.' },
          { q: 'Where can I find the post URL?', a: 'Click the timestamp of the post (e.g. "3 hours ago") — your browser will navigate to the post\'s direct URL. You can also tap the three-dot menu on the post and choose "Copy link".' },
          { q: 'What is a Post ID used for?', a: 'Post IDs are needed for Facebook Graph API calls, embedding posts on websites, ad reporting, and any automation that references specific Facebook posts.' },
          { q: 'Why might a lookup fail?', a: 'Private or friends-only posts, malformed URLs, or temporary service issues can cause failures. Make sure the post is publicly accessible and the URL is complete.' },
        ]}
      />
    </main>
  )
}
