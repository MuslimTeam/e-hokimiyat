import { NextResponse } from 'next/server'

// Performance monitoring middleware
export function middleware(request: Request) {
  const start = Date.now()
  
  const response = NextResponse.next()
  
  // Add performance headers
  response.headers.set('X-Response-Time', `${Date.now() - start}ms`)
  response.headers.set('Cache-Control', 'public, s-max-age=31536000, immutable')
  
  return response
}
