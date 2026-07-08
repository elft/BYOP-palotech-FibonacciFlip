export type VoteValue = '0' | '1' | '2' | '3' | '5' | '8' | '13' | '21' | '?' | 'coffee'

export type ParticipantRole = 'facilitator' | 'voter'

export type ParticipantStatus = 'connected' | 'idle'

export type RoomStage = 'voting' | 'revealed'

export type Participant = {
  name: string
  role: ParticipantRole
  status: ParticipantStatus
  vote: VoteValue | null
}

export type Room = {
  name: string
  stage: RoomStage
  currentStory: string
  participants: Array<Participant>
}

export const voteOptions: Array<VoteValue> = ['0', '1', '2', '3', '5', '8', '13', '21', '?', 'coffee']

export type RoomSnapshot = {
  room: Room
  currentUserName: string
  voteOptions: Array<VoteValue>
}

export type VoteDistributionItem = {
  value: VoteValue
  count: number
  percentage: number
}

export type VoteSummary = {
  votesCast: number
  eligibleVoters: number
  average: number | null
  distribution: Array<VoteDistributionItem>
}

export type RoomEvent =
  | {
      type: 'connected'
      roomId: string
    }
  | {
      type: 'room.updated'
      roomId: string
      room?: Room
    }
  | {
      type: 'vote.cast'
      roomId: string
      participantName?: string
    }
  | {
      type: 'votes.revealed'
      roomId: string
    }
  | {
      type: 'votes.reset'
      roomId: string
    }
