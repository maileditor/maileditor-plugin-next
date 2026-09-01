import { getTemplate, getTemplateHtml } from '@/api/plugin-backend'
import { PluginApiError } from '@/api/plugin-response'
import { ApiError } from '@/components/api-error'
import { AppHeader } from '@/components/app-header'
import { CopyHtmlButton } from '@/components/copy-html-button'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/format-date'
import { parseTemplateId } from '@/lib/template-id'
import { PluginTemplate, TemplateHtml } from '@/types/plugin'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ user: string; templateId: string }>
}

export default async function Page({ params }: PageProps) {
  const { user, templateId } = await params
  const id = parseTemplateId(templateId)

  if (id === null) notFound()

  const userHref = `/${encodeURIComponent(user)}`

  let template: PluginTemplate | null = null
  let markup: TemplateHtml | null = null
  let error: unknown = null

  try {
    ;[template, markup] = await Promise.all([
      getTemplate(id),
      getTemplateHtml(id),
    ])
  } catch (caught) {
    error = caught
  }

  if (error instanceof PluginApiError && error.status === 404) notFound()
  if (template && template.external_user_id !== user) notFound()

  const rawHref = `${userHref}/${id}/raw`

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader
        backHref={userHref}
        backLabel="Templates"
        right={<span>{user}</span>}
      />

      <main className="mx-auto w-full max-w-4xl px-6 py-10">
        {error ? <ApiError error={error} /> : null}

        {template && markup ? (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold tracking-tight">
                  {template.name}
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Last saved {formatDate(template.updated_at)} · pulled back
                  from the{' '}
                  <span className="font-mono text-xs">{markup.source}</span>{' '}
                  copy
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button asChild size="sm">
                  <Link href={`${userHref}/${id}/edit`}>Edit</Link>
                </Button>
                <CopyHtmlButton rawHref={rawHref} />
                <Button asChild variant="outline" size="sm">
                  <a href={`${rawHref}?download=1`}>Download</a>
                </Button>
              </div>
            </div>

            {markup.source === 'draft' ? (
              <p className="text-muted-foreground mt-4 text-xs">
                This is the draft the editor last saved. It becomes the settled
                copy, with a refreshed thumbnail, once the background job runs.
              </p>
            ) : null}

            <iframe
              title="Template preview"
              src={rawHref}
              sandbox=""
              className="mt-6 h-[70vh] w-full rounded-lg border bg-white"
            />
          </>
        ) : null}
      </main>
    </div>
  )
}
