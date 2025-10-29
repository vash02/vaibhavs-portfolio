import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const VISITORS_FILE = path.join(process.cwd(), 'visitor-data.json')
const API_KEY = process.env.VISITOR_DATA_API_KEY

// Initialize visitors file if it doesn't exist
if (!fs.existsSync(VISITORS_FILE)) {
  fs.writeFileSync(VISITORS_FILE, JSON.stringify({
    totalVisits: 0,
    visitors: []
  }))
}

// Helper function to verify API key
function verifyApiKey(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return false
  
  const [type, key] = authHeader.split(' ')
  return type === 'Bearer' && key === API_KEY
}

export async function POST(request: Request) {
  try {
    const data = JSON.parse(fs.readFileSync(VISITORS_FILE, 'utf-8'))
    const visitorInfo = {
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || 'unknown',
      referer: request.headers.get('referer') || 'direct',
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    }

    data.totalVisits += 1
    data.visitors.push(visitorInfo)
    
    // Keep only last 1000 visits to prevent file from growing too large
    if (data.visitors.length > 1000) {
      data.visitors = data.visitors.slice(-1000)
    }

    fs.writeFileSync(VISITORS_FILE, JSON.stringify(data, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error recording visitor:', error)
    return NextResponse.json({ success: false })
  }
}

// This endpoint is for your private use only
export async function GET(request: Request) {
  // Verify API key
  if (!verifyApiKey(request)) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const data = JSON.parse(fs.readFileSync(VISITORS_FILE, 'utf-8'))
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read visitor data' })
  }
} 