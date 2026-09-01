'use client'

import { Button } from '@/components/ui/button'
import { useRef, useState } from 'react'

interface CopyHtmlButtonProps {
  rawHref: string
}

export function CopyHtmlButton({ rawHref }: CopyHtmlButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const resetTimer = useRef<number | undefined>(undefined)

  function flash(next: 'copied' | 'failed') {
    setStatus(next)
    window.clearTimeout(resetTimer.current)
    resetTimer.current = window.setTimeout(() => setStatus('idle'), 2000)
  }

  async function handleCopy() {
    if (!navigator.clipboard) {
      flash('failed')
      return
    }

    try {
      const response = await fetch(rawHref)

      if (!response.ok) throw new Error(String(response.status))

      await navigator.clipboard.writeText(await response.text())
      flash('copied')
    } catch {
      flash('failed')
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {status === 'idle' ? 'Copy HTML' : null}
      {status === 'copied' ? 'Copied' : null}
      {status === 'failed' ? 'Copy failed' : null}
    </Button>
  )
}
