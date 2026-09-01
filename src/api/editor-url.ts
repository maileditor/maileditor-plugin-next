import 'server-only'

import { requirePluginEnv } from '@/api/plugin-env'
import { createHmac } from 'node:crypto'

const SIGNATURE_LIFETIME_SECONDS = 300

export function signIdentity(user: string, secret: string) {
  const expires = Math.floor(Date.now() / 1000) + SIGNATURE_LIFETIME_SECONDS
  const payload = `v1|${Buffer.byteLength(user)}:${user}|${expires}`
  const signature = createHmac('sha256', secret).update(payload).digest('hex')

  return { expires, signature }
}

export function buildEditorUrl(user: string, templateId?: number) {
  const env = requirePluginEnv()
  const { expires, signature } = signIdentity(user, env.pluginSecret)

  const params = new URLSearchParams({
    external_user_id: user,
    identity_expires: String(expires),
    identity_signature: signature,
    plugin_version: env.pluginVersion,
  })

  if (templateId !== undefined) {
    params.set('template_id', String(templateId))
  }

  return `${env.editorBaseUrl}/plugin-editor/v1/${env.pluginId}?${params}`
}
