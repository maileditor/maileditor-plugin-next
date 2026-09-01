import 'server-only'

const KEYS = [
  'MAILEDITOR_API_BASE_URL',
  'MAILEDITOR_EDITOR_BASE_URL',
  'MAILEDITOR_PLUGIN_ID',
  'MAILEDITOR_PLUGIN_SECRET',
  'MAILEDITOR_PLUGIN_VERSION',
] as const

export interface PluginEnv {
  apiBaseUrl: string
  editorBaseUrl: string
  pluginId: string
  pluginSecret: string
  pluginVersion: string
  missing: string[]
}

export function getPluginEnv(): PluginEnv {
  return {
    apiBaseUrl: (process.env.MAILEDITOR_API_BASE_URL ?? '').replace(/\/+$/, ''),
    editorBaseUrl: (process.env.MAILEDITOR_EDITOR_BASE_URL ?? '').replace(
      /\/+$/,
      ''
    ),
    pluginId: process.env.MAILEDITOR_PLUGIN_ID ?? '',
    pluginSecret: process.env.MAILEDITOR_PLUGIN_SECRET ?? '',
    pluginVersion: process.env.MAILEDITOR_PLUGIN_VERSION ?? '',
    missing: KEYS.filter((key) => !process.env[key]),
  }
}

export function requirePluginEnv(): PluginEnv {
  const env = getPluginEnv()

  if (env.missing.length > 0) {
    throw new Error(
      `Missing environment variables: ${env.missing.join(', ')}. See /setup.`
    )
  }

  return env
}
