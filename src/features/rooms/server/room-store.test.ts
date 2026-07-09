import { describe, expect, it } from 'vitest'
import type { Room } from '../api/room-types'
import { createRoom, getRoom, updateRoom } from './room-store'

const room: Room = {
    name: 'room-1',
    stage: 'voting',
    currentStory: '',
    participants: [
        { name: 'Alice', role: 'facilitator', status: 'connected', vote: null },
        { name: 'Bob', role: 'voter', status: 'connected', vote: null },
    ],
}

describe('room-store', () => {
    it('creates a room and retrieves it', () => {
        createRoom(room)
        const retrievedRoom = getRoom('room-1')
        expect(retrievedRoom).toEqual(room)
    })
    it('adds a participant to the room when they join', () => {
        createRoom(room);
        updateRoom('room-1', (room) => ({
            ...room,
            participants: [
                ...room.participants,
                { name: 'Charlie', role: 'voter', status: 'connected', vote: null },
            ],
        }))

        const updatedRoom = getRoom('room-1')

        expect(updatedRoom?.participants.map((participant) => participant.name)).toEqual(['Alice', 'Bob', 'Charlie'])
    })
})
