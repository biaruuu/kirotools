import { NextRequest, NextResponse } from 'next/server'

const HITOOLS_HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
  Accept: '*/*',
  Origin: 'https://hitools.pro',
  Referer: 'https://hitools.pro/find-facebook-id',
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
    const { url } = await req.json()
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'A Facebook URL is required' }, { status: 400 })
    }

    const response = await fetchWithRetry(
      'https://hitools.pro/api/find-facebook-id',
      {
        method: 'POST',
        headers: HITOOLS_HEADERS,
        body: JSON.stringify({ url: url.trim() }),
        signal: AbortSignal.timeout(15000),
      }
    )

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (err: unknown) {
    console.error('Find-id error:', err instanceof Error ? err.message : err)
    const message = err instanceof Error ? err.message : 'Failed to find Facebook ID'
    const status = message.includes('429') ? 429 : 500
    return NextResponse.json(
      { error: status === 429 ? 'Rate limited. Please wait a moment and try again.' : message },
      { status }
    )
  }
}
