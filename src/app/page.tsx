import { listUsers } from '@/api/plugin-backend'
import { ApiError } from '@/components/api-error'
import { HOST_USERS } from '@/constants/host-users'
import { formatDate } from '@/lib/format-date'
import { PluginUser } from '@/types/plugin'
import Link from 'next/link'

export default async function Page() {
  let apiUsers: PluginUser[] = []
  let error: unknown = null

  try {
    apiUsers = await listUsers()
  } catch (caught) {
    error = caught
  }

  const byId = new Map(apiUsers.map((user) => [user.external_user_id, user]))
  const unknownToHost = apiUsers.filter(
    (user) =>
      !HOST_USERS.some((hostUser) => hostUser.id === user.external_user_id)
  )

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sendwell</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Your customers, and what they have built in the embedded editor.
          </p>
        </div>
        <Link href="/setup" className="text-sm underline">
          Setup
        </Link>
      </div>

      {error ? (
        <div className="mt-8">
          <ApiError error={error} />
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-2">
        {HOST_USERS.map((hostUser) => {
          const stats = byId.get(hostUser.id)

          return (
            <Link
              key={hostUser.id}
              href={`/${encodeURIComponent(hostUser.id)}`}
              className="hover:bg-accent flex items-center justify-between gap-4 rounded-lg border px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {hostUser.name}{' '}
                  <span className="text-muted-foreground font-normal">
                    · {hostUser.company}
                  </span>
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {hostUser.email}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm">
                  {stats?.template_count ?? 0} templates
                </p>
                <p className="text-muted-foreground text-xs">
                  Last saved {formatDate(stats?.last_activity_at ?? null)}
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      {unknownToHost.length > 0 ? (
        <div className="mt-10">
          <h2 className="text-sm font-medium">Also seen by the API</h2>
          <p className="text-muted-foreground mt-1 text-xs">
            End user ids this plugin holds templates for that are not in our own
            directory.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {unknownToHost.map((user) => (
              <Link
                key={user.external_user_id}
                href={`/${encodeURIComponent(user.external_user_id)}`}
                className="hover:bg-accent flex items-center justify-between gap-4 rounded-lg border border-dashed px-4 py-3"
              >
                <p className="truncate font-mono text-xs">
                  {user.external_user_id}
                </p>
                <p className="shrink-0 text-sm">
                  {user.template_count} templates
                </p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </main>
  )
}
