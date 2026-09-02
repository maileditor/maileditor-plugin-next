import { buildEditorUrl } from '@/api/editor-url'
import { AppHeader } from '@/components/app-header'
import { parseTemplateId } from '@/lib/template-id'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ user: string; templateId: string }>
}

export default async function Page({ params }: PageProps) {
  const { user, templateId } = await params
  const id = parseTemplateId(templateId)

  if (id === null) notFound()

  return (
    <div className="flex h-dvh flex-col">
      <AppHeader
        backHref={`/${encodeURIComponent(user)}`}
        backLabel="Templates"
        right={<span>Editing as {user}</span>}
      />
      <iframe
        title="MailEditor"
        src={buildEditorUrl(user, id)}
        allow="clipboard-write; fullscreen"
        className="min-h-0 w-full flex-1 border-0 bg-white"
      />
    </div>
  )
}
