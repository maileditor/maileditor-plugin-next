import { PluginApiError } from '@/api/plugin-response'
import Link from 'next/link'

interface ApiErrorProps {
  error: unknown
}

export function ApiError({ error }: ApiErrorProps) {
  const apiError = error instanceof PluginApiError ? error : null
  const message =
    apiError?.message ??
    (error instanceof Error ? error.message : 'Something went wrong.')

  return (
    <div className="border-destructive/40 bg-destructive/5 rounded-lg border p-4 text-sm">
      <p className="font-medium">MailEditor did not answer as expected</p>
      <p className="text-muted-foreground mt-1">{message}</p>
      {apiError ? (
        <p className="text-muted-foreground mt-1 font-mono text-xs">
          {apiError.status}
          {apiError.code ? ` · ${apiError.code}` : ''}
        </p>
      ) : null}
      <Link href="/setup" className="mt-3 inline-block underline">
        Check the install
      </Link>
    </div>
  )
}
