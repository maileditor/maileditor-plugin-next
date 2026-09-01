export class PluginApiError extends Error {
  status: number
  code: string | null

  constructor(status: number, code: string | null, message: string) {
    super(message)
    this.name = 'PluginApiError'
    this.status = status
    this.code = code
  }
}

export async function readPluginResponse<T>(response: Response): Promise<T> {
  const text = await response.text()
  let body: unknown = null

  try {
    body = JSON.parse(text)
  } catch {
    body = null
  }

  if (!response.ok) {
    const envelope = body as {
      message?: string
      result?: { error?: string }
    } | null

    throw new PluginApiError(
      response.status,
      envelope?.result?.error ?? null,
      envelope?.message ?? `${response.status} ${response.statusText}`
    )
  }

  if (body === null) {
    throw new PluginApiError(
      response.status,
      null,
      `${response.status} ${response.statusText}, but the body is not JSON. Check MAILEDITOR_API_BASE_URL.`
    )
  }

  return body as T
}
