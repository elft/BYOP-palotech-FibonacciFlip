import type { RoomEvent } from './room-types'

type RoomEventHandler = (event: RoomEvent) => void

const roomEventNames = ['connected', 'room.updated', 'vote.cast', 'votes.revealed', 'votes.reset'] as const

export function subscribeToRoomEvents(roomId: string, handler: RoomEventHandler) {
  const source = new EventSource(`/api/rooms/${roomId}/events`)

  roomEventNames.forEach((eventName) => {
    source.addEventListener(eventName, (event) => {
      handler(JSON.parse(event.data) as RoomEvent)
    })
  })

  return () => {
    source.close()
  }
}
