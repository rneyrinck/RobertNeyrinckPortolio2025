import { type QuorumLoopEvent } from './types'

/**
 * Reads a fetch Response body as a stream of Server-Sent Events (manual
 * parsing — we use fetch + POST rather than the native EventSource API,
 * which only supports GET) and invokes `onEvent` for each parsed event.
 */
export async function consumeQuorumLoopStream(
  response: Response,
  onEvent: (event: QuorumLoopEvent) => void,
) {
  if (!response.body) return

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    let boundary = buffer.indexOf('\n\n')
    while (boundary !== -1) {
      const rawEvent = buffer.slice(0, boundary)
      buffer = buffer.slice(boundary + 2)

      const line = rawEvent.split('\n').find((l) => l.startsWith('data: '))
      if (line) {
        try {
          const parsed = JSON.parse(
            line.slice('data: '.length),
          ) as QuorumLoopEvent
          onEvent(parsed)
        } catch {
          // ignore malformed event
        }
      }
      boundary = buffer.indexOf('\n\n')
    }
  }
}
