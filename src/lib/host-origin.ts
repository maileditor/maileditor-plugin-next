import { headers } from 'next/headers'

export async function getHostOrigin() {
  const headerList = await headers()
  const host = headerList.get('host') ?? ''

  if (!host) return ''

  const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1')
  const forwardedProto = headerList
    .get('x-forwarded-proto')
    ?.split(',')[0]
    ?.trim()

  return `${forwardedProto || (isLocal ? 'http' : 'https')}://${host}`
}
