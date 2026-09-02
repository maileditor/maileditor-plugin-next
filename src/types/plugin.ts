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
