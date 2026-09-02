'use client'

import { HOST_USERS } from '@/constants/host-users'
import { formatDate } from '@/lib/format-date'
import { PluginUser } from '@/types/plugin'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Page() {
  const [apiUsers, setApiUsers] = useState<PluginUser[] | null>(null)

  useEffect(() => {
    async function load() {
      const response = await fetch('/api/users')
      setApiUsers((await response.json()) as PluginUser[])
    }

    void load()
  }, [])

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Sendwell</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Your customers, and what they have built in the embedded editor.
      </p>

      <div className="mt-8 flex flex-col gap-2">
        {HOST_USERS.map((hostUser) => {
          const stats = apiUsers?.find(
            (user) => user.external_user_id === hostUser.id
          )

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
                  {apiUsers === null
                    ? '…'
                    : `${stats?.template_count ?? 0} templates`}
                </p>
                <p className="text-muted-foreground text-xs">
                  Last saved {formatDate(stats?.last_activity_at ?? null)}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
