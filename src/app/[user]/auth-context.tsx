'use client'

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

interface EditorAuth {
  pluginId: string
  editorBaseUrl: string
  externalUserId: string
  identityExpires: number
  identitySignature: string
  pluginVersion: string
}

const EditorAuthContext = createContext<EditorAuth | null>(null)

export function EditorAuthProvider({
  user,
  children,
}: {
  user: string
  children: ReactNode
}) {
  const [auth, setAuth] = useState<EditorAuth | null>(null)

  useEffect(() => {
    async function authenticate() {
      const response = await fetch(`/api/auth?user=${encodeURIComponent(user)}`)
      setAuth((await response.json()) as EditorAuth)
    }

    void authenticate()
  }, [user])

  return (
    <EditorAuthContext.Provider value={auth}>
      {children}
    </EditorAuthContext.Provider>
  )
}

export function useEditorUrl(templateId?: number) {
  const auth = useContext(EditorAuthContext)

  if (!auth) return null

  const params = new URLSearchParams({
    external_user_id: auth.externalUserId,
    identity_expires: String(auth.identityExpires),
    identity_signature: auth.identitySignature,
    plugin_version: auth.pluginVersion,
  })

  if (templateId !== undefined) {
    params.set('template_id', String(templateId))
  }

  return `${auth.editorBaseUrl}/plugin-editor/v1/${auth.pluginId}?${params}`
}
