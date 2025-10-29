import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const VISITORS_FILE = path.join(process.cwd(), 'visitor-data.json')
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Helper function to verify JWT token
async function verifyToken() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value
    
    if (!token) return false
    
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    return true
  } catch {
    return false
  }
}

export async function GET() {
  // Verify JWT token
  if (!(await verifyToken())) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    if (!fs.existsSync(VISITORS_FILE)) {
      return NextResponse.json({
        totalVisits: 0,
        visitors: []
      })
    }
    
    const data = JSON.parse(fs.readFileSync(VISITORS_FILE, 'utf-8'))
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to read visitor data' })
  }
}
