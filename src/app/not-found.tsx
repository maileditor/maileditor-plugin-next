import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-sm px-6 py-20">
      <h1 className="text-xl font-semibold tracking-tight">Not found</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        That template does not exist, or it belongs to another user.
      </p>
      <Button asChild size="sm" className="mt-6">
        <Link href="/">Back to users</Link>
      </Button>
    </main>
  )
}
