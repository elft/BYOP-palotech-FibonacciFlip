import { useEffect, useMemo, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { getVoteSummary, roomApi } from '../api/room-api'
import { subscribeToRoomEvents } from '../api/room-events'
import type { Room, VoteValue } from '../api/room-types'
import { ParticipantList } from './ParticipantList'
import { VoteSummary } from './VoteSummary'
import { VotingCards } from './VotingCards'

type RoomDashboardProps = {
  roomId: string
}

type PendingAction = 'vote' | 'reveal' | 'reset' | null

function getRoomUserStorageKey(roomId: string) {
  return `fibonacci-flip:${roomId}:userName`
}

export function RoomDashboard({ roomId }: RoomDashboardProps) {
  const [room, setRoom] = useState<Room | null>(null)
  const [voteOptions, setVoteOptions] = useState<Array<VoteValue>>([])
  const [currentUserName, setCurrentUserName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    roomApi
      .getRoom(roomId)
      .then((snapshot) => {
        if (!isMounted) {
          return
        }

        setRoom(snapshot.room ?? null)
        setCurrentUserName(snapshot.currentUserName ?? sessionStorage.getItem(getRoomUserStorageKey(roomId)) ?? '')
        setVoteOptions(snapshot.voteOptions ?? [])
      })
      .catch(() => {
        if (isMounted) {
          setError('Could not load the room.')
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [roomId])

  useEffect(() => {
    return subscribeToRoomEvents(roomId, (event) => {
      if (event.type === 'connected') {
        return
      }

      if (event.type === 'room.updated' && event.room) {
        setRoom(event.room)
        return
      }

      void roomApi
        .getRoom(roomId)
        .then((snapshot) => {
          setRoom(snapshot.room ?? null)
          setCurrentUserName(snapshot.currentUserName ?? sessionStorage.getItem(getRoomUserStorageKey(roomId)) ?? '')
          setVoteOptions(snapshot.voteOptions ?? [])
        })
        .catch(() => {
          setError('Could not refresh the room after an event.')
        })
    })
  }, [roomId])

  const currentParticipant = room?.participants.find((participant) => participant.name === currentUserName) ?? null
  const selectedVote = currentParticipant?.vote ?? null
  const summary = useMemo(() => (room ? getVoteSummary(room) : null), [room])

  async function runAction(action: PendingAction, callback: () => Promise<void>) {
    setError(null)
    setPendingAction(action)

    try {
      await callback()
    } catch {
      setError('The API call failed.')
    } finally {
      setPendingAction(null)
    }
  }

  function handleVote(vote: VoteValue) {
    if (!currentUserName) {
      return
    }

    void runAction('vote', async () => {
      const response = await roomApi.castVote(roomId, currentUserName, vote)

      if (response.room) {
        setRoom(response.room)
      }
    })
  }

  function handleReveal() {
    void runAction('reveal', async () => {
      const response = await roomApi.revealVotes(roomId)

      if (response.room) {
        setRoom(response.room)
      }
    })
  }

  function handleReset() {
    void runAction('reset', async () => {
      const response = await roomApi.resetVotes(roomId)

      if (response.room) {
        setRoom(response.room)
      }
    })
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'grid', minHeight: '60vh', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!room || !summary) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'grey.50', minHeight: '100vh' }}>
        <Stack spacing={2} sx={{ maxWidth: 720, mx: 'auto' }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="overline" color="text.secondary">
              Room {roomId}
            </Typography>
            <Typography variant="h4" component="h1">
              Room data unavailable
            </Typography>
            <Typography color="text.secondary">
              The room API returned an empty response. The room UI will render once the API returns room data.
            </Typography>
          </Paper>

          {error ? <Alert severity="error">{error}</Alert> : null}
        </Stack>
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Stack spacing={3} sx={{ maxWidth: 1120, mx: 'auto' }}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="overline" color="text.secondary">
                Room {room.name}
              </Typography>
              <Typography variant="h4" component="h1">
                {room.name}
              </Typography>
              <Typography color="text.secondary">{room.currentStory}</Typography>
            </Box>
          </Stack>
        </Paper>

        {error ? <Alert severity="error">{error}</Alert> : null}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '320px 1fr 320px' },
            gap: 2,
          }}
        >
          <ParticipantList participants={room.participants} currentUserName={currentUserName} stage={room.stage} />
          <VotingCards
            options={voteOptions}
            selectedVote={selectedVote}
            disabled={room.stage === 'revealed'}
            isSubmitting={pendingAction === 'vote'}
            onVote={handleVote}
          />
          <VoteSummary
            summary={summary}
            revealed={room.stage === 'revealed'}
            isBusy={pendingAction === 'reveal' || pendingAction === 'reset'}
            onReveal={handleReveal}
            onReset={handleReset}
          />
        </Box>
      </Stack>
    </Box>
  )
}
