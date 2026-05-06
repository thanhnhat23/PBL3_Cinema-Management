import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Get language from cookie
  const cookieLang = request.cookies.get('i18next')?.value
  
  // If no cookie, try to detect from Accept-Language header
  if (!cookieLang) {
    const acceptLang = request.headers.get('accept-language')
    if (acceptLang) {
      // Simple parse for first language (e.g., "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7" -> "vi")
      const detectedLang = acceptLang.split(',')[0].split('-')[0]
      const supportedLangs = ['vi', 'ja', 'en']
      const lang = supportedLangs.includes(detectedLang) ? detectedLang : 'vi'
      
      // Set the cookie so the server knows the language on subsequent requests
      response.cookies.set('i18next', lang, { path: '/' })
    }
  }
  
  return response
}

export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // - public folder
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
