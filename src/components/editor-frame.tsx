interface EditorFrameProps {
  src: string
}

export function EditorFrame({ src }: EditorFrameProps) {
  return (
    <iframe
      title="MailEditor"
      src={src}
      allow="clipboard-write; fullscreen"
      className="min-h-0 w-full flex-1 border-0 bg-white"
    />
  )
}
