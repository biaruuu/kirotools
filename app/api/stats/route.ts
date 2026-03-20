import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { RequestCount } from '@/lib/models/RequestCount'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const tool = req.nextUrl.searchParams.get('tool')

    if (tool) {
      const doc = await RequestCount.findOne({ tool }).lean()
      return NextResponse.json({ count: (doc as any)?.count ?? 0 })
    }

    const all = await RequestCount.find({}).lean()
    const result: Record<string, number> = {}
    for (const d of all as any[]) result[d.tool] = d.count
    return NextResponse.json(result)
  } catch (err) {
    console.error('[stats GET]', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { tool } = await req.json()

    if (!tool || typeof tool !== 'string') {
      return NextResponse.json({ error: 'Invalid tool' }, { status: 400 })
    }

    const doc = await RequestCount.findOneAndUpdate(
      { tool },
      { $inc: { count: 1 }, $set: { updatedAt: new Date() } },
      { upsert: true, new: true }
    ).lean()

    return NextResponse.json({ count: (doc as any).count })
  } catch (err) {
    console.error('[stats POST]', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
