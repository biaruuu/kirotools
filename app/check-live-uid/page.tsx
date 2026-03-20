'use client'

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { ToolHeader } from '@/components/tools/tool-header'
import { InfoTabs } from '@/components/tools/info-tabs'
import { CheckUidIcon, PlayIcon, RefreshIcon, CopyIcon, DownloadIcon, CheckCircleIcon, XCircleIcon, TriangleAlertIcon, UserCheckIcon, ListIcon, GripIcon, GeistSpinner } from '@/components/icons'
import { cn } from '@/lib/utils'

type Mode = 'uid' | 'full' | 'sep' | 'compact'
type UIDResult = { uid: string; status: string }

const VIEW_MODES: { mode: Mode; label: string; icon: React.ReactNode }[] = [
  { mode: 'uid', label: 'UID', icon: <UserCheckIcon className="w-[11px] h-[11px]" /> },
  { mode: 'full', label: 'Full', icon: <ListIcon className="w-[11px] h-[11px]" /> },
  { mode: 'sep', label: 'Separated', icon: <ListIcon className="w-[11px] h-[11px]" /> },
  { mode: 'compact', label: 'Compact', icon: <GripIcon className="w-[11px] h-[11px]" /> },
]

function formatBucket(arr: UIDResult[], mode: Mode) {
  if (mode === 'uid') return arr.map(r => r.uid).join('\n')
  if (mode === 'full') return arr.map(r => `${r.uid} | ${r.status}`).join('\n')
  if (mode === 'sep') return arr.map(r => r.uid).join('\n')
  if (mode === 'compact') return arr.map(r => r.uid).join(' | ')
  return ''
}

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

function saveFile(text: string, name = 'export.txt') {
  const b = new Blob([text], { type: 'text/plain' })
  const u = URL.createObjectURL(b)
  const a = document.createElement('a')
  a.href = u; a.download = name; a.click()
  URL.revokeObjectURL(u)
  toast.success('File exported!')
}

interface BucketProps {
  title: string
  type: 'live' | 'dead' | 'err'
  count: number
  value: string
  onCopy: () => void
  onExport: () => void
}

function ResultBucket({ title, type, count, value, onCopy, onExport }: BucketProps) {
  const iconCls = type === 'live' ? 'text-green-500' : type === 'dead' ? 'text-red-500' : 'text-amber-500'
  const badgeCls = type === 'live' ? 'bg-green-50 text-green-800' : type === 'dead' ? 'bg-red-50 text-red-800' : 'bg-amber-50 text-amber-800'
  const headerBg = type === 'live' ? 'bg-green-50/50' : type === 'dead' ? 'bg-red-50/50' : 'bg-amber-50/50'
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,.06)]">
      <div className={`flex items-center justify-between px-3 py-[10px] border-b border-zinc-200 gap-2 ${headerBg}`}>
        <div className="flex items-center gap-[7px] text-[13px] font-bold text-zinc-800 flex-1 min-w-0">
          {type === 'live' && <CheckCircleIcon className={cn('w-[15px] h-[15px] flex-shrink-0', iconCls)} />}
          {type === 'dead' && <XCircleIcon className={cn('w-[15px] h-[15px] flex-shrink-0', iconCls)} />}
          {type === 'err' && <TriangleAlertIcon className={cn('w-[15px] h-[15px] flex-shrink-0', iconCls)} />}
          {title}
          <span className={cn('inline-flex items-center h-5 px-[7px] rounded-full text-[11px] font-bold', badgeCls)}>
            {count}
          </span>
        </div>
        <div className="flex gap-[5px] flex-shrink-0">
          <button
            onClick={onCopy}
            className="h-[29px] px-[9px] text-[12px] font-semibold rounded-md bg-white border border-zinc-200 text-zinc-600 inline-flex items-center gap-1 hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-800 active:scale-[.96] transition-all"
          >
            <CopyIcon className="w-3 h-3" />Copy
          </button>
          <button
            onClick={onExport}
            className="h-[29px] px-[9px] text-[12px] font-semibold rounded-md bg-white border border-zinc-200 text-zinc-600 inline-flex items-center gap-1 hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-800 active:scale-[.96] transition-all"
          >
            <DownloadIcon className="w-3 h-3" />Export
          </button>
        </div>
      </div>
      <div className="px-3 py-[11px] min-h-[56px]">
        {!value ? (
          <div className="text-center text-zinc-400 text-[12.5px] py-2 font-medium">No results yet</div>
        ) : (
          <textarea
            ref={textareaRef}
            readOnly
            value={value}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-[11px] py-[9px] text-[12.5px] text-zinc-700 font-mono leading-[1.9] resize-none outline-none focus:border-zinc-400 min-h-[52px] transition-colors"
            style={{ height: 'auto' }}
            onInput={e => {
              const el = e.currentTarget
              el.style.height = 'auto'
              el.style.height = Math.min(el.scrollHeight, 260) + 'px'
            }}
            rows={Math.min(value.split('\n').length + 1, 14)}
          />
        )}
      </div>
    </div>
  )
}

export default function CheckLiveUIDPage() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<Mode>('uid')
  const [loading, setLoading] = useState(false)
  const [liveArr, setLiveArr] = useState<UIDResult[]>([])
  const [deadArr, setDeadArr] = useState<UIDResult[]>([])
  const [errArr, setErrArr] = useState<UIDResult[]>([])

  const uids = input.split('\n').map(s => s.trim()).filter(Boolean)
  const count = uids.length

  async function handleCheck() {
    if (!uids.length) { toast.error('Please enter at least one UID'); return }
    if (uids.length > 50) { toast.error('Maximum 50 UIDs per batch'); return }

    setLoading(true)
    setLiveArr([]); setDeadArr([]); setErrArr([])

    try {
      const res = await fetch('/api/check-uid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uids }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Server error ${res.status}`)

      const results: UIDResult[] = []
      const live: UIDResult[] = []
      const dead: UIDResult[] = []
      const err: UIDResult[] = []

      const raw: { uid?: string; id?: string; live?: boolean | number | string; status?: string }[] =
        Array.isArray(data.results) ? data.results : []

      if (!raw.length) throw new Error('No results returned from server')

      raw.forEach(r => {
        const uid = String(r.uid ?? r.id ?? '').trim()
        if (!uid) return

        let isLive: boolean
        if (typeof r.live === 'boolean') {
          isLive = r.live
        } else if (typeof r.live === 'number') {
          isLive = r.live === 1
        } else {
          const s = String(r.live ?? r.status ?? '').toLowerCase().trim()
          const isDead = ['false','0','die','dead','inactive','not found'].includes(s)
          isLive = ['true','1','live','active'].includes(s)
          if (!isDead && !isLive) { err.push({ uid, status: s || 'unknown' }); return }
          if (isDead) { dead.push({ uid, status: 'dead' }); return }
        }

        if (isLive) live.push({ uid, status: 'live' })
        else dead.push({ uid, status: 'dead' })
      })

      setLiveArr(live); setDeadArr(dead); setErrArr(err)
      toast.success(`Done! ${live.length} live · ${dead.length} dead · ${err.length} error`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to check UIDs')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setInput(''); setLiveArr([]); setDeadArr([]); setErrArr([])
    toast.info('Reset!')
  }

  return (
    <main className="max-w-[720px] mx-auto px-4 pb-16 pt-5 sm:px-5 sm:pt-6 md:px-7 md:pt-7 lg:max-w-[840px] lg:px-10 lg:pt-8 xl:max-w-[960px] xl:px-14">
      <ToolHeader
        icon={<CheckUidIcon />}
        iconClass="g"
        name="Check Live UID Facebook"
        subtitle="Verify Facebook UID status — up to 50 per batch"
      />

      {/* Input card */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden mb-2.5 shadow-[0_1px_3px_rgba(0,0,0,.06)]">
        <div className="p-3.5">
          <label className="block text-[13px] font-bold text-zinc-700 mb-[7px]">
            Enter UID list <span className="text-zinc-400 font-medium">(one per line)</span>
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={'100012345678901\n100023456789012\n100034567890123'}
            rows={6}
            className="w-full min-h-[120px] border border-zinc-200 rounded-[10px] px-3 py-[11px] text-[13.5px] text-zinc-800 bg-white font-[family-name:var(--font-sans)] resize-y outline-none leading-[1.75] focus:border-zinc-600 focus:shadow-[0_0_0_3px_rgba(39,39,42,.08)] transition-all placeholder:text-zinc-400"
          />
          <div className={cn('text-right text-[11.5px] mt-1 font-medium', count > 50 ? 'text-red-500' : 'text-zinc-400')}>
            {count} / 50 UIDs
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mb-3.5">
        <button
          onClick={handleCheck}
          disabled={loading}
          className="flex-1 h-[42px] bg-zinc-900 text-white rounded-[10px] text-[14px] font-bold inline-flex items-center justify-center gap-[7px] border border-zinc-900 hover:bg-zinc-700 hover:border-zinc-700 active:scale-[.97] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? <><GeistSpinner /> Checking…</> : <><PlayIcon className="w-[13px] h-[13px]" />Check</>}
        </button>
        <button
          onClick={handleReset}
          className="h-[42px] px-[18px] bg-white text-zinc-600 rounded-[10px] text-[14px] font-bold inline-flex items-center gap-[7px] border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-800 active:scale-[.97] transition-all"
        >
          <RefreshIcon className="w-[13px] h-[13px]" />Reset
        </button>
      </div>

      {/* View mode tabs */}
      <div className="flex gap-[5px] mb-3 flex-wrap">
        {VIEW_MODES.map(v => (
          <button
            key={v.mode}
            onClick={() => setMode(v.mode)}
            className={cn(
              'h-[31px] px-[11px] text-[12px] font-semibold rounded-md border inline-flex items-center gap-[5px] transition-all active:scale-[.96]',
              mode === v.mode
                ? 'bg-zinc-900 border-zinc-900 text-white'
                : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 hover:bg-zinc-50'
            )}
          >
            <span className="hidden sm:block">{v.icon}</span>
            {v.label}
          </button>
        ))}
      </div>

      {/* Result Buckets */}
      <div className="flex flex-col gap-2 mb-[22px] lg:grid lg:grid-cols-3 lg:gap-2.5">
        <ResultBucket
          title="Live Account"
          type="live"
          count={liveArr.length}
          value={liveArr.length ? formatBucket(liveArr, mode) : ''}
          onCopy={() => { if (!liveArr.length) { toast.error('No live UIDs'); return } clip(formatBucket(liveArr, mode), 'Live UIDs copied') }}
          onExport={() => { if (!liveArr.length) { toast.error('No live UIDs'); return } saveFile(formatBucket(liveArr, mode), 'live-uids.txt') }}
        />
        <ResultBucket
          title="Dead Account"
          type="dead"
          count={deadArr.length}
          value={deadArr.length ? formatBucket(deadArr, mode) : ''}
          onCopy={() => { if (!deadArr.length) { toast.error('No dead UIDs'); return } clip(formatBucket(deadArr, mode), 'Dead UIDs copied') }}
          onExport={() => { if (!deadArr.length) { toast.error('No dead UIDs'); return } saveFile(formatBucket(deadArr, mode), 'dead-uids.txt') }}
        />
        <ResultBucket
          title="Error"
          type="err"
          count={errArr.length}
          value={errArr.length ? formatBucket(errArr, mode) : ''}
          onCopy={() => { if (!errArr.length) { toast.error('No error UIDs'); return } clip(formatBucket(errArr, mode), 'Error UIDs copied') }}
          onExport={() => { if (!errArr.length) { toast.error('No error UIDs'); return } saveFile(formatBucket(errArr, mode), 'error-uids.txt') }}
        />
      </div>

      {/* Info Tabs */}
      <InfoTabs
        steps={[
          { title: 'Enter UIDs', desc: 'Paste Facebook User IDs, one per line. Maximum 50 UIDs per batch.' },
          { title: 'Click Check', desc: 'Hit Check. All UIDs are verified in one request.' },
          { title: 'View Results', desc: 'Results appear in Live, Dead, and Error buckets. Toggle view modes for different formats.' },
          { title: 'Export', desc: 'Copy any bucket to clipboard or export as a .txt file.' },
        ]}
        about={
          <>
            <p>The <strong>Check Live UID Facebook</strong> tool lets you bulk-verify Facebook User IDs in one click. Paste up to 50 UIDs and instantly see which accounts are live, dead, or errored.</p>
            <p>Switch between UID-only, Full, Separated, and Compact view modes to get exactly the output format you need.</p>
          </>
        }
        faqs={[
          { q: 'What is a Facebook UID?', a: 'A unique numeric identifier for every Facebook account — usually 15–16 digits starting with "100".' },
          { q: 'How many UIDs can I check?', a: 'Up to 50 UIDs per batch. Enter one UID per line.' },
          { q: 'What do Live / Dead / Error mean?', a: 'Live = active account. Dead = deactivated or deleted. Error = check failed, try again.' },
        ]}
      />
    </main>
  )
}
