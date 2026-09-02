import { AppHeader } from '@/components/app-header'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ user: string; templateId: string }>
}

export default async function Page({ params }: PageProps) {
  const { user, templateId } = await params

  if (!/^[1-9]\d*$/.test(templateId)) notFound()

  return (
    <div className="flex h-dvh flex-col">
      <AppHeader
        backHref={`/${encodeURIComponent(user)}`}
        backLabel="Templates"
        right={<span>Editing as {user}</span>}
      />
      <iframe
        title="MailEditor"
        src={`/api/editor-url?user=${encodeURIComponent(user)}&template_id=${templateId}`}
        allow="clipboard-write; fullscreen"
        className="min-h-0 w-full flex-1 border-0 bg-white"
      />
    </div>
  )
}
