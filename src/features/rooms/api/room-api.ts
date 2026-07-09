import type { Room, RoomSnapshot, VoteSummary, VoteValue } from './room-types'

export type CreateRoomResponse = {
  roomId?: string
  room?: Room
  currentUserName?: string
  voteOptions?: Array<VoteValue>
}

export type RoomMutationResponse = {
  room?: Room
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}

export function getVoteSummary(sourceRoom: Room): VoteSummary {
  const voters = sourceRoom.participants.filter((participant) => participant.role === 'voter')
  const castVotes = voters
    .map((participant) => participant.vote)
    .filter((vote): vote is VoteValue => vote !== null)

  const numericVotes = castVotes.map(Number).filter((vote) => Number.isFinite(vote))
  const average =
    numericVotes.length > 0
      ? Math.round((numericVotes.reduce((total, vote) => total + vote, 0) / numericVotes.length) * 10) / 10
      : null

  const counts = castVotes.reduce<Map<VoteValue, number>>((nextCounts, vote) => {
    nextCounts.set(vote, (nextCounts.get(vote) ?? 0) + 1)
    return nextCounts
  }, new Map())

  return {
    votesCast: castVotes.length,
    eligibleVoters: voters.length,
    average,
    distribution: Array.from(counts.entries()).map(([value, count]) => ({
      value,
      count,
      percentage: castVotes.length > 0 ? Math.round((count / castVotes.length) * 100) : 0,
    })),
  }
}

export const roomApi = {
  createRoom(userName: string, roomId: string) {
    return requestJson<CreateRoomResponse>('/api/rooms', {
      method: 'POST',
      body: JSON.stringify({ userName, roomId }),
    })
  },

  getRoom(roomId: string) {
    return requestJson<Partial<RoomSnapshot>>(`/api/rooms/${roomId}`)
  },

  joinRoom(userName: string, roomId: string) {
    return requestJson<Partial<RoomSnapshot>>(`/api/rooms/${roomId}/join`, {
      method: 'POST',
      body: JSON.stringify({ userName }),
    })
  },

  castVote(roomId: string, participantName: string, vote: VoteValue) {
    return requestJson<RoomMutationResponse>(`/api/rooms/${roomId}/votes`, {
      method: 'POST',
      body: JSON.stringify({ participantName, vote }),
    })
  },

  revealVotes(roomId: string) {
    return requestJson<RoomMutationResponse>(`/api/rooms/${roomId}/reveal`, {
      method: 'POST',
      body: JSON.stringify({}),
    })
  },

  resetVotes(roomId: string) {
    return requestJson<RoomMutationResponse>(`/api/rooms/${roomId}/reset`, {
      method: 'POST',
      body: JSON.stringify({}),
    })
  },

  leaveRoom(roomId: string, participantName: string) {
    return requestJson<RoomMutationResponse>(`/api/rooms/${roomId}/leave`, {
      method: 'POST',
      body: JSON.stringify({ participantName }),
    })
  }
}
