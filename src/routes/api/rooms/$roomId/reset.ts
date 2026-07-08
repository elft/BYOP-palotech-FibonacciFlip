import { createFileRoute } from '@tanstack/react-router'
import { publishRoomEvent } from '#/features/rooms/server/room-event-bus'
import { updateRoom } from '#/features/rooms/server/room-store'

export const Route = createFileRoute('/api/rooms/$roomId/reset')({
  server: {
    handlers: {
      POST: async ({ params }) => {
        const room = updateRoom(params.roomId, (existingRoom) => ({
          ...existingRoom,
          stage: 'voting',
          participants: existingRoom.participants.map((participant) => ({
            ...participant,
            vote: null,
          })),
        }))

        if (!room) {
          return Response.json({ error: 'Room not found.' }, { status: 404 })
        }

        publishRoomEvent({ type: 'votes.reset', roomId: params.roomId })

        return Response.json({ room })
      },
    },
  },
})
