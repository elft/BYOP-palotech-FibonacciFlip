import { createFileRoute } from '@tanstack/react-router'
import { voteOptions, type VoteValue } from '#/features/rooms/api/room-types'
import { publishRoomEvent } from '#/features/rooms/server/room-event-bus'
import { updateRoom } from '#/features/rooms/server/room-store'

export const Route = createFileRoute('/api/rooms/$roomId/votes')({
  server: {
    handlers: {
      POST: async ({ params, request }) => {
        const body = await request.json()
        const participantName = String(body.participantName ?? '').trim()
        const vote = body.vote as VoteValue

        if (!participantName || !voteOptions.includes(vote)) {
          return Response.json({ error: 'Participant name and valid vote are required.' }, { status: 400 })
        }

        let participantFound = false
        const room = updateRoom(params.roomId, (existingRoom) => ({
          ...existingRoom,
          participants: existingRoom.participants.map((participant) => {
            if (participant.name !== participantName) {
              return participant
            }

            participantFound = true
            return { ...participant, vote }
          }),
        }))

        if (!room) {
          return Response.json({ error: 'Room not found.' }, { status: 404 })
        }

        if (!participantFound) {
          return Response.json({ error: 'Participant not found.' }, { status: 404 })
        }

        publishRoomEvent({ type: 'vote.cast', roomId: params.roomId, participantName })

        return Response.json({ room })
      },
    },
  },
})
