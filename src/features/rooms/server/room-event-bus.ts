import type { RoomEvent } from '../api/room-types'

type RoomClient = {
  controller: ReadableStreamDefaultController<Uint8Array>
  heartbeat: ReturnType<typeof setInterval>
}

const encoder = new TextEncoder()
const clientsByRoom = new Map<string, Set<RoomClient>>()

function encodeEvent(event: RoomEvent) {
  return encoder.encode(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`)
}

function encodeHeartbeat() {
  return encoder.encode(': keep-alive\n\n')
}

export function publishRoomEvent(event: RoomEvent) {
  const clients = clientsByRoom.get(event.roomId)

  if (!clients) {
    return
  }

  clients.forEach((client) => {
    client.controller.enqueue(encodeEvent(event))
  })
}

export function openRoomEventStream(roomId: string, signal: AbortSignal) {
  return new ReadableStream({
    start(controller) {
      const client: RoomClient = {
        controller,
        heartbeat: setInterval(() => {
          controller.enqueue(encodeHeartbeat())
        }, 15000),
      }

      const clients = clientsByRoom.get(roomId) ?? new Set<RoomClient>()
      clients.add(client)
      clientsByRoom.set(roomId, clients)

      controller.enqueue(encodeEvent({ type: 'connected', roomId }))

      signal.addEventListener('abort', () => {
        clearInterval(client.heartbeat)
        clients.delete(client)

        if (clients.size === 0) {
          clientsByRoom.delete(roomId)
        }

        controller.close()
      })
    },
  })
}
