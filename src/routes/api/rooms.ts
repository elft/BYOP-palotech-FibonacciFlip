import { createFileRoute } from '@tanstack/react-router'
import { voteOptions } from '#/features/rooms/api/room-types'
import { createRoom } from '#/features/rooms/server/room-store'

export const Route = createFileRoute('/api/rooms')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json()
        const { roomId, userName } = body

        const room = createRoom({
          name: roomId,
          stage: 'voting',
          currentStory: '',
          participants: [
            {
              name: userName,
              role: 'facilitator',
              status: 'connected',
              vote: null,
            },
          ],
        })

        return Response.json({ roomId, room, currentUserName: userName, voteOptions })
      },
    },
  },
})
