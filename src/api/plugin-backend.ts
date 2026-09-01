import 'server-only'

import { requirePluginEnv } from '@/api/plugin-env'
import { readPluginResponse } from '@/api/plugin-response'
import {
  Paginated,
  PluginEnvelope,
  PluginTemplate,
  PluginUser,
  TemplateHtml,
} from '@/types/plugin'

async function pluginFetch<T>(
  path: string,
  query: Record<string, string | number | undefined> = {}
): Promise<T> {
  const env = requirePluginEnv()
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') params.set(key, String(value))
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

  return readPluginResponse<T>(response)
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

export async function getTemplate(templateId: number) {
  const body = await pluginFetch<PluginEnvelope<{ template: PluginTemplate }>>(
    `/templates/${templateId}`
  )

  return body.result.template
}

export async function getTemplateHtml(templateId: number) {
  const body = await pluginFetch<PluginEnvelope<TemplateHtml>>(
    `/templates/${templateId}/html`
  )

  return body.result
}
