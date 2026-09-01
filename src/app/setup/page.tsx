import { listUsers } from '@/api/plugin-backend'
import { getPluginEnv } from '@/api/plugin-env'
import { PluginApiError } from '@/api/plugin-response'
import {
  createEmbedSession,
  getBootstrap,
  revokeSession,
} from '@/api/plugin-session'
import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { getHostOrigin } from '@/lib/host-origin'
import { Bootstrap, PluginSession } from '@/types/plugin'
import Link from 'next/link'
import { ReactNode } from 'react'

const DIAGNOSTIC_USER = 'setup-check'

interface PageProps {
  searchParams: Promise<{ check?: string | string[] }>
}

function describe(error: unknown) {
  if (error instanceof PluginApiError) {
    return `${error.status}${error.code ? ` ${error.code}` : ''} — ${error.message}`
  }

  return error instanceof Error ? error.message : String(error)
}

function Check({
  status,
  title,
  children,
}: {
  status: 'ok' | 'failed' | 'skipped'
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <span
          className={
            status === 'ok'
              ? 'size-2 shrink-0 rounded-full bg-emerald-500'
              : status === 'failed'
                ? 'bg-destructive size-2 shrink-0 rounded-full'
                : 'bg-muted-foreground/40 size-2 shrink-0 rounded-full'
          }
        />
        <h2 className="text-sm font-medium">{title}</h2>
      </div>
      <div className="text-muted-foreground mt-2 space-y-1 text-sm">
        {children}
      </div>
    </section>
  )
}

export default async function Page({ searchParams }: PageProps) {
  const env = getPluginEnv()
  const { check } = await searchParams
  const hostOrigin = await getHostOrigin()

  const hasEnv = env.missing.length === 0

  let credentialsError: unknown = null

  if (hasEnv) {
    try {
      await listUsers(1)
    } catch (error) {
      credentialsError = error
    }
  }

  const runEmbedCheck = check === 'embed' && hasEnv && hostOrigin !== ''

  let session: PluginSession | null = null
  let bootstrap: Bootstrap | null = null
  let embedError: unknown = null

  if (runEmbedCheck) {
    try {
      session = await createEmbedSession(hostOrigin, DIAGNOSTIC_USER)
      bootstrap = await getBootstrap(session.token, hostOrigin)
    } catch (error) {
      embedError = error
    } finally {
      if (session) await revokeSession(session.token, hostOrigin)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader backHref="/" backLabel="Users" right={<span>Setup</span>} />

      <main className="mx-auto w-full max-w-2xl px-6 py-10">
        <h1 className="text-xl font-semibold tracking-tight">
          Is this install working?
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Three checks, in the order they fail.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Check status={hasEnv ? 'ok' : 'failed'} title="Configuration">
            {hasEnv ? (
              <>
                <p>
                  Plugin id{' '}
                  <span className="font-mono text-xs">{env.pluginId}</span>
                </p>
                <p>
                  Plugin secret <span className="font-mono text-xs">set</span>,
                  version{' '}
                  <span className="font-mono text-xs">{env.pluginVersion}</span>
                </p>
                <p>
                  API{' '}
                  <span className="font-mono text-xs">{env.apiBaseUrl}</span>
                </p>
                <p>
                  Editor{' '}
                  <span className="font-mono text-xs">{env.editorBaseUrl}</span>
                </p>
                <p>
                  This app{' '}
                  <span className="font-mono text-xs">{hostOrigin}</span>
                </p>
              </>
            ) : (
              <p>Missing: {env.missing.join(', ')}. Set them in .env.local.</p>
            )}
          </Check>

          <Check
            status={!hasEnv ? 'skipped' : credentialsError ? 'failed' : 'ok'}
            title="Backend credentials"
          >
            {!hasEnv ? <p>Skipped.</p> : null}
            {hasEnv && credentialsError === null ? (
              <p>
                The plugin id and secret are accepted by the server-to-server
                read API.
              </p>
            ) : null}
            {credentialsError ? <p>{describe(credentialsError)}</p> : null}
          </Check>

          <Check
            status={!runEmbedCheck ? 'skipped' : bootstrap ? 'ok' : 'failed'}
            title="Embedded session"
          >
            <p>
              Mints a session exactly the way the editor does, declaring{' '}
              <span className="font-mono text-xs">{hostOrigin}</span> as the
              embedding page. This is the check that catches an origin missing
              from the plugin&apos;s allowlist and a signature the plugin will
              not accept.
            </p>
            {!runEmbedCheck ? (
              <>
                <p>
                  Not run. It spends one of the 10 mints per minute the plugin
                  is allowed, so it only runs when you ask.
                </p>
                {hasEnv && hostOrigin ? (
                  <Button asChild size="sm" className="mt-2">
                    <Link href="/setup?check=embed">Run this check</Link>
                  </Button>
                ) : null}
              </>
            ) : null}
            {embedError ? <p>{describe(embedError)}</p> : null}
            {bootstrap ? (
              <>
                <p>
                  Tier{' '}
                  <span className="font-mono text-xs">{bootstrap.tier}</span>,
                  plan{' '}
                  <span className="font-mono text-xs">
                    {bootstrap.subscription?.plan ?? 'none'}
                  </span>
                  , usage limits{' '}
                  <span className="font-mono text-xs">
                    {bootstrap.enforced ? 'enforced' : 'not enforced'}
                  </span>
                </p>
                <p>
                  Domain verification has not shipped, so every domain stays
                  unverified and every session is capped at the development
                  tier.
                </p>
              </>
            ) : null}
          </Check>
        </div>

        {bootstrap && bootstrap.quotas.length > 0 ? (
          <div className="mt-8">
            <h2 className="text-sm font-medium">Allowances</h2>
            <div className="mt-3 flex flex-col gap-2">
              {bootstrap.quotas.map((quota) => (
                <div
                  key={quota.feature}
                  className="flex items-center justify-between gap-4 rounded-lg border px-4 py-2 text-sm"
                >
                  <span>{quota.name}</span>
                  <span className="text-muted-foreground font-mono text-xs">
                    {quota.used} / {quota.is_unlimited ? '∞' : quota.limit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )
}
