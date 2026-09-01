export interface PluginEnvelope<T> {
  message: string
  result: T
}

export interface Paginated<T> {
  data: T[]
  meta: {
    current_page: number
    per_page: number
    total: number
  }
}

export interface PluginUser {
  external_user_id: string
  template_count: number
  first_template_at: string | null
  last_activity_at: string | null
}

export interface PluginTemplate {
  id: number
  name: string
  slug: string
  thumbnail: string | null
  external_user_id: string | null
  created_at: string
  updated_at: string
}

export interface TemplateHtml {
  template_id: number
  external_user_id: string | null
  source: 'draft' | 'media'
  html: string
}

export interface GalleryTemplate {
  id: number
  name: string
  slug: string
  description: string | null
  is_premium: boolean
  thumbnail: string | null
}

export interface PrebuiltHtml {
  source: string
  html: string
}

export interface PluginSession {
  token: string
  token_type: string
  expires_in: number
  expires_at: string
  mode: 'a' | 'b'
  tier: string
  origin: string | null
  plugin: {
    plugin_id: string
    name: string
    version: string
  }
}

export interface BootstrapQuota {
  feature: string
  name: string
  group: string
  kind: string
  is_enabled: boolean
  limit: string | null
  limit_value: number | null
  used: number
  remaining: number | null
  is_unlimited: boolean
  resets_at: string | null
}

export interface Bootstrap {
  plugin: {
    plugin_id: string
    name: string
    version: string
  }
  mode: 'a' | 'b'
  tier: string
  subscription: {
    plan: string
    status: string
    renews_at: string | null
  } | null
  features: string[]
  quotas: BootstrapQuota[]
  enforced: boolean
}
