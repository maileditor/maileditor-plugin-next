import { getTemplate, getTemplateHtml } from '@/api/plugin-backend'
import { PluginApiError } from '@/api/plugin-response'
import { parseTemplateId } from '@/lib/template-id'
import { NextRequest } from 'next/server'

interface RouteContext {
  params: Promise<{ user: string; templateId: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { user, templateId } = await context.params
  const id = parseTemplateId(templateId)

  if (id === null) {
    return new Response('Not found', { status: 404 })
  }

  try {
    const [template, markup] = await Promise.all([
      getTemplate(id),
      getTemplateHtml(id),
    ])

    if (template.external_user_id !== user) {
      return new Response('Not found', { status: 404 })
    }

    const isDownload = request.nextUrl.searchParams.get('download') === '1'
    const headers = new Headers({
      'Content-Type': 'text/html; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy':
        "sandbox; default-src 'none'; img-src * data:; font-src * data:; style-src * 'unsafe-inline'; frame-ancestors 'self'",
      'Cache-Control': 'no-store',
    })

    if (isDownload) {
      headers.set(
        'Content-Disposition',
        `attachment; filename="template-${id}.html"`
      )
    }

    return new Response(markup.html, { headers })
  } catch (error) {
    if (error instanceof PluginApiError && error.status === 404) {
      return new Response('Not found', { status: 404 })
    }

    return new Response('Unable to load template markup', { status: 502 })
  }
}
