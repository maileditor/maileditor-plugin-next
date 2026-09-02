'use client'

import { AppHeader } from '@/components/app-header'
import { HOST_USERS } from '@/constants/host-users'
import { use } from 'react'
import { useEditorUrl } from '../auth-context'

interface PageProps {
  params: Promise<{ user: string }>
}

export default function Page({ params }: PageProps) {
  const { user } = use(params)
  const editorUrl = useEditorUrl()
  const hostUser = HOST_USERS.find((candidate) => candidate.id === user)

  return (
    <div className="flex h-dvh flex-col">
      <AppHeader
        backHref={`/${encodeURIComponent(user)}`}
        backLabel="Templates"
        right={<span>New template for {hostUser?.name ?? user}</span>}
      />
      <iframe
        src={editorUrl}
        allow="clipboard-write; fullscreen"
        className="min-h-0 w-full flex-1 border-0 bg-white"
      />
    </div>
  )
}
