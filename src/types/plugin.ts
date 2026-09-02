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
