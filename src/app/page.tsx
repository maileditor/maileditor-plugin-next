import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-sm px-6 py-20">
      <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Pick a user to see their MailEditor templates.
      </p>

      <div className="mt-8 flex flex-col gap-2">
        {['alice', 'bob', 'carol'].map((user) => (
          <Button
            key={user}
            asChild
            variant="outline"
            className="h-11 justify-start capitalize"
          >
            <Link href={`/${user}`}>{user}</Link>
          </Button>
        ))}
      </div>
    </main>
  )
}
