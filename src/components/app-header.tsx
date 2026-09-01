import Link from 'next/link'
import { ReactNode } from 'react'

interface AppHeaderProps {
  backHref: string
  backLabel: string
  right?: ReactNode
}

export function AppHeader({ backHref, backLabel, right }: AppHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b px-6">
      <Link href={backHref} className="text-sm hover:underline">
        ← {backLabel}
      </Link>
      {right ? (
        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          {right}
        </div>
      ) : null}
    </header>
  )
}
