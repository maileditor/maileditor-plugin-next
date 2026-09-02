import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const user = request.nextUrl.searchParams.get('user')

  if (!user) {
    return new Response('Missing user query parameter', { status: 400 })
  }

  const response = await fetch(
    `${process.env.MAILEDITOR_API_BASE_URL}/plugin/v1/backend/templates?external_user_id=${encodeURIComponent(user)}&per_page=100`,
    {
      headers: {
        'X-Plugin-Id': process.env.MAILEDITOR_PLUGIN_ID ?? '',
        'X-Plugin-Secret': process.env.MAILEDITOR_PLUGIN_SECRET ?? '',
        Accept: 'application/json',
      },
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    return new Response(`MailEditor API responded ${response.status}`, {
      status: 502,
    })
  }

  const body = (await response.json()) as {
    result: { templates: { data: unknown } }
  }

  return Response.json(body.result.templates.data)
}
