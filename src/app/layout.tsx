import '@/styles/index.css'

import { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { PropsWithChildren } from 'react'

export const metadata: Metadata = {
  title: 'Sendwell — MailEditor plugin host',
  description: 'Reference host integration for the MailEditor plugin',
}

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-dvh antialiased">
        <ThemeProvider attribute="class" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
