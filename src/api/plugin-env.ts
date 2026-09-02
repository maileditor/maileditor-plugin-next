import 'server-only'

export interface PluginEnv {
  apiBaseUrl: string
  editorBaseUrl: string
  pluginId: string
  pluginSecret: string
  pluginVersion: string
}

export function requirePluginEnv(): PluginEnv {
  const {
    MAILEDITOR_API_BASE_URL,
    MAILEDITOR_EDITOR_BASE_URL,
    MAILEDITOR_PLUGIN_ID,
    MAILEDITOR_PLUGIN_SECRET,
    MAILEDITOR_PLUGIN_VERSION,
  } = process.env

  if (
    !MAILEDITOR_API_BASE_URL ||
    !MAILEDITOR_EDITOR_BASE_URL ||
    !MAILEDITOR_PLUGIN_ID ||
    !MAILEDITOR_PLUGIN_SECRET ||
    !MAILEDITOR_PLUGIN_VERSION
  ) {
    throw new Error('Missing MAILEDITOR_* environment variables in .env.local')
  }

  return {
    apiBaseUrl: MAILEDITOR_API_BASE_URL.replace(/\/+$/, ''),
    editorBaseUrl: MAILEDITOR_EDITOR_BASE_URL.replace(/\/+$/, ''),
    pluginId: MAILEDITOR_PLUGIN_ID,
    pluginSecret: MAILEDITOR_PLUGIN_SECRET,
    pluginVersion: MAILEDITOR_PLUGIN_VERSION,
  }
}
