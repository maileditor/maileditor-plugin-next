import { NextRequest } from 'next/server'
import { createHmac } from 'node:crypto'

export function GET(request: NextRequest) {
  const user = request.nextUrl.searchParams.get('user')

  if (!user) {
    return new Response('Missing user query parameter', { status: 400 })
  }

  const expires = Math.floor(Date.now() / 1000) + 300
  const payload = `v1|${Buffer.byteLength(user)}:${user}|${expires}`
  const signature = createHmac(
    'sha256',
    process.env.MAILEDITOR_PLUGIN_SECRET ?? ''
  )
    .update(payload)
    .digest('hex')

  return Response.json({
    externalUserId: user,
    identityExpires: expires,
    identitySignature: signature,

    pluginId: process.env.MAILEDITOR_PLUGIN_ID,
    pluginVersion: process.env.MAILEDITOR_PLUGIN_VERSION,
    editorBaseUrl: process.env.MAILEDITOR_EDITOR_BASE_URL,
  })
}
