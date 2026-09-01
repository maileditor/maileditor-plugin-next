'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="mx-auto w-full max-w-sm px-6 py-20">
      <h1 className="text-xl font-semibold tracking-tight">
        Something went wrong
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">{error.message}</p>
      {error.digest ? (
        <p className="text-muted-foreground mt-1 font-mono text-xs">
          {error.digest}
        </p>
      ) : null}
      <div className="mt-6 flex gap-2">
        <Button size="sm" onClick={reset}>
          Try again
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/setup">Check the install</Link>
        </Button>
      </div>
    </main>
  )
}
