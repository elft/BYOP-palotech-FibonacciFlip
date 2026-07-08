import { createFileRoute } from '@tanstack/react-router'
import { openRoomEventStream } from '#/features/rooms/server/room-event-bus'

export const Route = createFileRoute('/api/rooms/$roomId/events')({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const stream = openRoomEventStream(params.roomId, request.signal)

        return new Response(stream, {
          headers: {
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
            'Content-Type': 'text/event-stream',
          },
        })
      },
    },
  },
})
