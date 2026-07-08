import { createFileRoute } from '@tanstack/react-router'
import { voteOptions } from '#/features/rooms/api/room-types'
import { getRoom } from '#/features/rooms/server/room-store'

export const Route = createFileRoute('/api/rooms/$roomId')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const room = getRoom(params.roomId)

        if (!room) {
          return Response.json({ error: 'Room not found.' }, { status: 404 })
        }

        return Response.json({ room, voteOptions })
      },
    },
  },
})
