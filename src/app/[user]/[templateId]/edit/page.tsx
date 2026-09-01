import { buildEditorUrl } from '@/api/editor-url'
import { AppHeader } from '@/components/app-header'
import { EditorFrame } from '@/components/editor-frame'
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
        backHref={`/${encodeURIComponent(user)}/${id}`}
        backLabel="Template"
        right={<span>Editing as {user}</span>}
      />
      <EditorFrame src={buildEditorUrl(user, id)} />
    </div>
  )
}
