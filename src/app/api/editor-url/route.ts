import { NextRequest } from 'next/server'
import { createHmac } from 'node:crypto'

export function GET(request: NextRequest) {
  const user = request.nextUrl.searchParams.get('user')
  const templateId = request.nextUrl.searchParams.get('template_id')

  if (!user) {
    return new Response('Missing user query parameter', { status: 400 })
  }

  if (templateId !== null && !/^[1-9]\d*$/.test(templateId)) {
    return new Response('Invalid template_id query parameter', { status: 400 })
  }

  const expires = Math.floor(Date.now() / 1000) + 300
  const payload = `v1|${Buffer.byteLength(user)}:${user}|${expires}`
  const signature = createHmac(
    'sha256',
    process.env.MAILEDITOR_PLUGIN_SECRET ?? ''
  )
    .update(payload)
    .digest('hex')

  const params = new URLSearchParams({
    external_user_id: user,
    identity_expires: String(expires),
    identity_signature: signature,
    plugin_version: process.env.MAILEDITOR_PLUGIN_VERSION ?? '',
  })

  if (templateId !== null) {
    params.set('template_id', templateId)
  }

  return Response.redirect(
    `${process.env.MAILEDITOR_EDITOR_BASE_URL}/plugin-editor/v1/${process.env.MAILEDITOR_PLUGIN_ID}?${params}`
  )
}
