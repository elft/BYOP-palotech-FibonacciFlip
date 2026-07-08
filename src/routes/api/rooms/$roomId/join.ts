import { createFileRoute } from '@tanstack/react-router'
import { voteOptions } from '#/features/rooms/api/room-types'
import { publishRoomEvent } from '#/features/rooms/server/room-event-bus'
import { updateRoom } from '#/features/rooms/server/room-store'

export const Route = createFileRoute('/api/rooms/$roomId/join')({
  server: {
    handlers: {
      POST: async ({ params, request }) => {
        const body = await request.json()
        const userName = String(body.userName ?? '').trim()

        if (!userName) {
          return Response.json({ error: 'Username is required.' }, { status: 400 })
        }

        const room = updateRoom(params.roomId, (existingRoom) => ({
          ...existingRoom,
          participants: existingRoom.participants.some((participant) => participant.name === userName)
            ? existingRoom.participants.map((participant) =>
                participant.name === userName ? { ...participant, status: 'connected' } : participant,
              )
            : [
                ...existingRoom.participants,
                {
                  name: userName,
                  role: 'voter',
                  status: 'connected',
                  vote: null,
                },
              ],
        }))

        if (!room) {
          return Response.json({ error: 'Room not found.' }, { status: 404 })
        }

        publishRoomEvent({ type: 'room.updated', roomId: params.roomId, room })

        return Response.json({ room, currentUserName: userName, voteOptions })
      },
    },
  },
})
