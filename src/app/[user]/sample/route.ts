import { seedGalleryTemplate } from '@/api/plugin-catalog'
import { getHostOrigin } from '@/lib/host-origin'
import { NextRequest, NextResponse } from 'next/server'

interface RouteContext {
  params: Promise<{ user: string }>
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { user } = await context.params
  const hostOrigin = await getHostOrigin()

  await seedGalleryTemplate(hostOrigin, user)

  return NextResponse.redirect(
    new URL(`/${encodeURIComponent(user)}`, request.url),
    303
  )
}
