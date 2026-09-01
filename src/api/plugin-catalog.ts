import 'server-only'

import { requirePluginEnv } from '@/api/plugin-env'
import { readPluginResponse } from '@/api/plugin-response'
import {
  createEmbedSession,
  embedHeaders,
  revokeSession,
} from '@/api/plugin-session'
import {
  GalleryTemplate,
  Paginated,
  PluginEnvelope,
  PluginTemplate,
  PrebuiltHtml,
} from '@/types/plugin'

async function listGallery(
  apiBaseUrl: string,
  requestHeaders: Record<string, string>
) {
  const response = await fetch(`${apiBaseUrl}/public/plugin/v1/templates`, {
    headers: requestHeaders,
    cache: 'no-store',
  })

  const body =
    await readPluginResponse<
      PluginEnvelope<{ templates: Paginated<GalleryTemplate> }>
    >(response)

  return body.result.templates.data
}

async function getPrebuiltHtml(
  apiBaseUrl: string,
  requestHeaders: Record<string, string>,
  id: number
) {
  const response = await fetch(
    `${apiBaseUrl}/public/plugin/v1/my-templates/${id}/html?type=prebuilt`,
    { headers: requestHeaders, cache: 'no-store' }
  )

  const body = await readPluginResponse<PrebuiltHtml>(response)

  return body.html
}

async function pickGalleryTemplate(
  apiBaseUrl: string,
  requestHeaders: Record<string, string>
) {
  const gallery = await listGallery(apiBaseUrl, requestHeaders)
  const entry = gallery.find((candidate) => !candidate.is_premium)

  if (!entry) {
    throw new Error('The gallery for this plugin has no free template to copy.')
  }

  const html = await getPrebuiltHtml(apiBaseUrl, requestHeaders, entry.id)

  return { name: entry.name, html }
}

export async function seedGalleryTemplate(hostOrigin: string, user: string) {
  const env = requirePluginEnv()
  const session = await createEmbedSession(hostOrigin, user)
  const requestHeaders = {
    ...embedHeaders(env, hostOrigin),
    Authorization: `Bearer ${session.token}`,
  }

  try {
    const picked = await pickGalleryTemplate(env.apiBaseUrl, requestHeaders)

    const response = await fetch(
      `${env.apiBaseUrl}/public/plugin/v1/my-templates`,
      {
        method: 'POST',
        headers: { ...requestHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: picked.name, html: picked.html }),
        cache: 'no-store',
      }
    )

    const created =
      await readPluginResponse<PluginEnvelope<{ template: PluginTemplate }>>(
        response
      )

    return created.result.template
  } finally {
    await revokeSession(session.token, hostOrigin)
  }
}
