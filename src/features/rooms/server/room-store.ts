import type { Room } from '../api/room-types'

const rooms = new Map<string, Room>()

export function createRoom(room: Room) {
  rooms.set(room.name, room)
  return room
}

export function getRoom(roomId: string) {
  return rooms.get(roomId) ?? null
}

export function updateRoom(roomId: string, updater: (room: Room) => Room) {
  const room = rooms.get(roomId)

  if (!room) {
    return null
  }

  const nextRoom = updater(room)
  rooms.set(roomId, nextRoom)
  return nextRoom
}