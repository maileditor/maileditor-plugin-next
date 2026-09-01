export function formatDate(value: string | null) {
  if (!value) return '—'

  const zoneless = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(
    value
  )
  const parsed = new Date(zoneless ? `${value.replace(' ', 'T')}Z` : value)

  if (Number.isNaN(parsed.getTime())) return '—'

  return `${parsed.toISOString().slice(0, 16).replace('T', ' ')} UTC`
}
