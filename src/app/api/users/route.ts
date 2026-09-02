export async function GET() {
  const response = await fetch(
    `${process.env.MAILEDITOR_API_BASE_URL}/plugin/v1/backend/users?per_page=100`,
    {
      headers: {
        'X-Plugin-Id': process.env.MAILEDITOR_PLUGIN_ID ?? '',
        'X-Plugin-Secret': process.env.MAILEDITOR_PLUGIN_SECRET ?? '',
        Accept: 'application/json',
      },
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    return new Response(`MailEditor API responded ${response.status}`, {
      status: 502,
    })
  }

  const body = (await response.json()) as {
    result: { users: { data: unknown } }
  }

  return Response.json(body.result.users.data)
}
