import { NextRequest, NextResponse } from 'next/server'

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
      return NextResponse.json({ error: 'A Facebook post URL is required' }, { status: 400 })
    }

    const response = await fetchWithRetry(
      'https://id.traodoisub.com/api.php',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `link=${encodeURIComponent(url.trim())}`,
        signal: AbortSignal.timeout(10000),
      }
    )

    const data = await response.json() as { id?: string }
    const postId = data?.id || null

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID not found. The post may be private or the URL is unsupported.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ postId })
  } catch (err: unknown) {
    console.error('Find-post-id error:', err instanceof Error ? err.message : err)
    const message = err instanceof Error ? err.message : 'Failed to find Post ID'
    const status = message.includes('429') ? 429 : 500
    return NextResponse.json(
      { error: status === 429 ? 'Rate limited. Please wait a moment and try again.' : message },
      { status }
    )
  }
}
