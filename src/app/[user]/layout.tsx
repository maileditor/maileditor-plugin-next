import { ReactNode } from 'react'
import { EditorAuthProvider } from './auth-context'

interface LayoutProps {
  params: Promise<{ user: string }>
  children: ReactNode
}

export default async function Layout({ params, children }: LayoutProps) {
  const { user } = await params

  return <EditorAuthProvider user={user}>{children}</EditorAuthProvider>
}
