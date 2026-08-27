import { getEditorUrl, getTemplates } from '@/app/actions'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ user: string }>
  searchParams: Promise<{ templateId?: string }>
}

export default async function Page({ params, searchParams }: PageProps) {
  const { user } = await params
  const { templateId } = await searchParams

  const templates = templateId ? [] : await getTemplates(user)

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-6">
        <Link href={templateId ? `/${user}` : '/'} className="text-sm">
          ← {templateId ? 'Templates' : 'Users'}
        </Link>

        <span className="text-muted-foreground text-sm">
          Signed in as{' '}
          <span className="text-foreground capitalize">{user}</span>
        </span>
      </header>

      {templateId ? (
        <iframe
          title="MailEditor"
          src={await getEditorUrl(user, templateId)}
          className="min-h-0 flex-1 border-0 bg-white"
        />
      ) : (
        <main className="mx-auto w-full max-w-4xl overflow-y-auto px-6 py-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Link
                key={template.id}
                href={`/${user}?templateId=${template.id}`}
              >
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
                  <p className="truncate border-t px-4 py-3 text-sm font-medium">
                    {template.name}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </main>
      )}
    </div>
  )
}
