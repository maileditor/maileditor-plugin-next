'use server'

export async function getTemplates(user: string) {
  const session = await fetch(
    `${process.env.MAILEDITOR_API_BASE_URL}/public/plugin/v1/session`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plugin_id: process.env.MAILEDITOR_PLUGIN_ID,
        plugin_secret: process.env.MAILEDITOR_PLUGIN_SECRET,
        external_user_id: user,
      }),
      cache: 'no-store',
    }
  ).then((response) => response.json())

  const templates = await fetch(
    `${process.env.MAILEDITOR_API_BASE_URL}/public/plugin/v1/my-templates`,
    {
      headers: { Authorization: `Bearer ${session.result.token}` },
      cache: 'no-store',
    }
  ).then((response) => response.json())

  return templates.result.templates.data as {
    id: number
    name: string
    thumbnail: string | null
  }[]
}

export async function getEditorUrl(user: string, templateId: string) {
  return `${process.env.MAILEDITOR_EDITOR_BASE_URL}/plugin-editor/v1/${process.env.MAILEDITOR_PLUGIN_ID}?external_user_id=${user}&template_id=${templateId}`
}
