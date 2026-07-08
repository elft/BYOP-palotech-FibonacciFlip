import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PersonIcon from '@mui/icons-material/Person'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { Participant, RoomStage } from '../api/room-types'

type ParticipantListProps = {
  participants: Array<Participant>
  currentUserName: string
  stage: RoomStage
}

export function ParticipantList({ participants, currentUserName, stage }: ParticipantListProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6">Participants</Typography>
          <Typography variant="body2" color="text.secondary">
            {participants.length} people in the room
          </Typography>
        </Box>

        <List disablePadding>
          {participants.map((participant) => {
            const hasVoted = participant.vote !== null
            const showVote = stage === 'revealed' && hasVoted

            return (
              <ListItem
                key={participant.name}
                disableGutters
                secondaryAction={
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    {showVote ? <Chip label={participant.vote} size="small" /> : null}
                    {hasVoted ? <CheckCircleIcon color="success" /> : <RadioButtonUncheckedIcon color="disabled" />}
                  </Stack>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: participant.role === 'facilitator' ? 'secondary.main' : 'primary.main' }}>
                    {participant.role === 'facilitator' ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <Typography component="span">{participant.name}</Typography>
                      {participant.name === currentUserName ? (
                        <Chip label="You" size="small" variant="outlined" />
                      ) : null}
                    </Stack>
                  }
                  secondary={`${participant.role} - ${participant.status}`}
                />
              </ListItem>
            )
          })}
        </List>
      </Stack>
    </Paper>
  )
}
