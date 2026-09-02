'use client'

import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HOST_USERS } from '@/constants/host-users'
import { formatDate } from '@/lib/format-date'
import { PluginTemplate } from '@/types/plugin'
import Link from 'next/link'
import { use, useEffect, useState } from 'react'

interface PageProps {
  params: Promise<{ user: string }>
}

export default function Page({ params }: PageProps) {
  const { user } = use(params)
  const [templates, setTemplates] = useState<PluginTemplate[] | null>(null)

  useEffect(() => {
    async function load() {
      const response = await fetch(
        `/api/templates?user=${encodeURIComponent(user)}`
      )
      setTemplates((await response.json()) as PluginTemplate[])
    }

    void load()
  }, [user])

  const hostUser = HOST_USERS.find((candidate) => candidate.id === user)
  const userHref = `/${encodeURIComponent(user)}`

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader
        backHref="/"
        backLabel="Users"
        right={<span>{hostUser?.name ?? user}</span>}
      />

      <main className="mx-auto w-full max-w-4xl px-6 py-10">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold tracking-tight">Templates</h1>
          <Button asChild size="sm">
            <Link href={`${userHref}/new`}>New template</Link>
          </Button>
        </div>

        {templates?.length === 0 ? (
          <p className="text-muted-foreground mt-10 text-sm">
            Nothing here yet. Start with New template.
          </p>
        ) : null}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(templates ?? []).map((template) => (
            <Link key={template.id} href={`${userHref}/${template.id}/edit`}>
              <Card className="gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md">
                <div className="bg-muted aspect-[16/10]">
                  {template.thumbnail ? (
                    <img
                      src={template.thumbnail}
                      alt=""
                      className="h-full w-full object-cover object-top"
                    />
                  ) : null}
                </div>
                <div className="border-t px-4 py-3">
                  <p className="truncate text-sm font-medium">
                    {template.name}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {formatDate(template.updated_at)}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
