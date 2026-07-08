import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { VoteValue } from '../api/room-types'

type VotingCardsProps = {
  options: Array<VoteValue>
  selectedVote: VoteValue | null
  disabled: boolean
  isSubmitting: boolean
  onVote: (vote: VoteValue) => void
}

export function VotingCards({ options, selectedVote, disabled, isSubmitting, onVote }: VotingCardsProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Stack spacing={2}>
        <Stack spacing={0.5}>
          <Typography variant="h6">Voting Cards</Typography>
          <Typography variant="body2" color="text.secondary">
            Pick the estimate that best matches the story.
          </Typography>
        </Stack>

        <Stack
          direction="row"
          useFlexGap
          sx={{
            flexWrap: 'wrap',
            gap: 1,
            '& > button': {
              minWidth: 64,
              minHeight: 56,
              fontWeight: 700,
            },
          }}
        >
          {options.map((option) => (
            <Button
              key={option}
              variant={selectedVote === option ? 'contained' : 'outlined'}
              disabled={disabled || isSubmitting}
              onClick={() => onVote(option)}
            >
              {option}
            </Button>
          ))}
        </Stack>
      </Stack>
    </Paper>
  )
}
