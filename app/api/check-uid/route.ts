import { NextRequest, NextResponse } from 'next/server'

const HITOOLS_HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
  Accept: '*/*',
  Origin: 'https://hitools.pro',
  Referer: 'https://hitools.pro/check-live-uid',
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3,
  delay = 2000
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, options)
    if (res.status !== 429 || i === retries - 1) return res
    console.log(`  ⏳ Rate limited (429). Retrying in ${delay}ms... (${i + 1}/${retries})`)
    await new Promise(r => setTimeout(r, delay))
    delay = Math.floor(delay * 1.5)
  }
  throw new Error('Max retries exceeded')
}

export async function POST(req: NextRequest) {
  try {
    const { uids } = await req.json()
    if (!uids || !Array.isArray(uids) || uids.length === 0) {
      return NextResponse.json({ error: 'uids array is required' }, { status: 400 })
    }
    if (uids.length > 50) {
      return NextResponse.json({ error: 'Maximum 50 UIDs per request' }, { status: 400 })
    }

    const response = await fetchWithRetry(
      'https://hitools.pro/api/check-uid-facebook',
      {
        method: 'POST',
        headers: HITOOLS_HEADERS,
        body: JSON.stringify({ uids: uids.map(String) }),
        signal: AbortSignal.timeout(30000),
      }
    )

    const text = await response.text()
    let results: unknown[] = []

    try {
      const parsed = JSON.parse(text)
      if (Array.isArray(parsed)) results = parsed
      else results = [parsed]
    } catch {
      // NDJSON (newline-delimited JSON)
      const lines = text.split('\n').filter(l => l.trim())
      results = lines.map(line => JSON.parse(line))
    }

    return NextResponse.json({ results })
  } catch (err: unknown) {
    console.error('Check-uid error:', err instanceof Error ? err.message : err)
    const message = err instanceof Error ? err.message : 'Failed to check UIDs'
    const status = message.includes('429') ? 429 : 500
    return NextResponse.json(
      { error: status === 429 ? 'Rate limited. Please wait a moment and try again.' : message },
      { status }
    )
  }
}
