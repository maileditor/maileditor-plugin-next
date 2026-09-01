import 'server-only'

import { signIdentity } from '@/api/editor-url'
import { PluginEnv, requirePluginEnv } from '@/api/plugin-env'
import { readPluginResponse } from '@/api/plugin-response'
import { Bootstrap, PluginEnvelope, PluginSession } from '@/types/plugin'

export function embedHeaders(env: PluginEnv, hostOrigin: string) {
  return {
    Origin: env.editorBaseUrl,
    'MailEditor-Origin': hostOrigin,
    Accept: 'application/json',
  }
}

export async function createEmbedSession(hostOrigin: string, user: string) {
  const env = requirePluginEnv()
  const { expires, signature } = signIdentity(user, env.pluginSecret)

  const response = await fetch(`${env.apiBaseUrl}/public/plugin/v1/session`, {
    method: 'POST',
    headers: {
      ...embedHeaders(env, hostOrigin),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      plugin_id: env.pluginId,
      external_user_id: user,
      identity_expires: expires,
      identity_signature: signature,
      plugin_version: env.pluginVersion,
    }),
    cache: 'no-store',
  })

  const body = await readPluginResponse<PluginEnvelope<PluginSession>>(response)

  return body.result
}

export async function getBootstrap(token: string, hostOrigin: string) {
  const env = requirePluginEnv()

  const response = await fetch(`${env.apiBaseUrl}/public/plugin/v1/bootstrap`, {
    headers: {
      ...embedHeaders(env, hostOrigin),
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  })

  const body =
    await readPluginResponse<PluginEnvelope<{ bootstrap: Bootstrap }>>(response)

  return body.result.bootstrap
}

export async function revokeSession(token: string, hostOrigin: string) {
  const env = requirePluginEnv()

  await fetch(`${env.apiBaseUrl}/public/plugin/v1/session`, {
    method: 'DELETE',
    headers: {
      ...embedHeaders(env, hostOrigin),
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  }).catch(() => undefined)
}
