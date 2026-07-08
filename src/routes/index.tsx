import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import AddIcon from '@mui/icons-material/Add'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import { green, yellow } from '@mui/material/colors'
import { roomApi } from '#/features/rooms/api/room-api'

export const Route = createFileRoute('/')({ component: Home })

function getRoomUserStorageKey(roomId: string) {
  return `fibonacci-flip:${roomId}:userName`
}

function Home() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [roomId, setRoomId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createRoom() {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await roomApi.createRoom(username, roomId)
      sessionStorage.setItem(getRoomUserStorageKey(roomId), response.currentUserName ?? username)

      await navigate({
        to: '/rooms/$roomId',
        params: { roomId },
      })
    } catch {
      setError('Could not create the room.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function joinRoom() {
    if (!username || !roomId) {
      setError('Enter a username and room id before joining.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await roomApi.joinRoom(username, roomId)
      sessionStorage.setItem(getRoomUserStorageKey(roomId), response.currentUserName ?? username)

      await navigate({
        to: '/rooms/$roomId',
        params: { roomId },
      })
    } catch {
      setError('Could not join the room.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Box
        sx={{
          p: 4,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 3,
          textAlign: 'center',
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Welcome Fibannoci Flipper
        </Typography>

        <Stack spacing={2}>
          {error ? <Alert severity="error">{error}</Alert> : null}

          <TextField
            label="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value.trim())}
            fullWidth
          />

          <TextField
            label="Room"
            value={roomId}
            onChange={(event) => setRoomId(event.target.value.trim())}
            fullWidth
          />

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<ArrowRightIcon sx={{ color: yellow[500] }} />}
              onClick={() => void joinRoom()}
              disabled={isSubmitting || !username || !roomId}
              fullWidth
            >
              Join Room
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              size="large"
              startIcon={<AddIcon sx={{ color: green[500] }} />}
              onClick={() => void createRoom()}
              disabled={isSubmitting || !username || !roomId}
              fullWidth
            >
              Create Room
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}
