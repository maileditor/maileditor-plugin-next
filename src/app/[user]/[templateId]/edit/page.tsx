'use client'

import { AppHeader } from '@/components/app-header'
import { use } from 'react'
import { useEditorUrl } from '../../auth-context'

interface PageProps {
  params: Promise<{ user: string; templateId: string }>
}

export default function Page({ params }: PageProps) {
  const { user, templateId } = use(params)
  const editorUrl = useEditorUrl(Number(templateId))

  return (
    <div className="flex h-dvh flex-col">
      <AppHeader
        backHref={`/${encodeURIComponent(user)}`}
        backLabel="Templates"
        right={<span>Editing as {user}</span>}
      />
      <iframe
        src={editorUrl}
        allow="clipboard-write; fullscreen"
        className="min-h-0 w-full flex-1 border-0 bg-white"
      />
    </div>
  )
}
