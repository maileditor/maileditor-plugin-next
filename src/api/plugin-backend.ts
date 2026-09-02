import 'server-only'

import { requirePluginEnv } from '@/api/plugin-env'
import {
  Paginated,
  PluginEnvelope,
  PluginTemplate,
  PluginUser,
} from '@/types/plugin'

async function pluginFetch<T>(
  path: string,
  query: Record<string, string | number> = {}
): Promise<T> {
  const env = requirePluginEnv()
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(query)) {
    params.set(key, String(value))
  }

  const search = params.toString()
  const response = await fetch(
    `${env.apiBaseUrl}/plugin/v1/backend${path}${search ? `?${search}` : ''}`,
    {
      headers: {
        'X-Plugin-Id': env.pluginId,
        'X-Plugin-Secret': env.pluginSecret,
        Accept: 'application/json',
      },
      cache: 'no-store',
    }
  )

  const text = await response.text()
  let body: unknown = null

  try {
    body = JSON.parse(text)
  } catch {
    body = null
  }

  if (!response.ok) {
    const envelope = body as { message?: string } | null

    throw new Error(
      `MailEditor API ${response.status}: ${envelope?.message ?? response.statusText}`
    )
  }

  if (body === null) {
    throw new Error(
      `MailEditor API ${response.status}: body is not JSON. Check MAILEDITOR_API_BASE_URL.`
    )
  }

  return body as T
}

export async function listUsers(perPage = 100) {
  const body = await pluginFetch<
    PluginEnvelope<{ users: Paginated<PluginUser> }>
  >('/users', { per_page: perPage })

  return body.result.users.data
}

export async function listTemplates(externalUserId: string, perPage = 100) {
  const body = await pluginFetch<
    PluginEnvelope<{ templates: Paginated<PluginTemplate> }>
  >('/templates', { external_user_id: externalUserId, per_page: perPage })

  return body.result.templates.data
}
