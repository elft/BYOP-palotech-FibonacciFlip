import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { VoteSummary as VoteSummaryModel } from '../api/room-types'

type VoteSummaryProps = {
  summary: VoteSummaryModel
  revealed: boolean
  isBusy: boolean
  onReveal: () => void
  onReset: () => void
  onLeave: () => void
}

export function VoteSummary({ summary, revealed, isBusy, onReveal, onReset, onLeave }: VoteSummaryProps) {
  const progress = summary.eligibleVoters > 0 ? (summary.votesCast / summary.eligibleVoters) * 100 : 0

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Stack spacing={2}>
        <Stack spacing={0.5}>
          <Typography variant="h6">Vote Summary</Typography>
          <Typography variant="body2" color="text.secondary">
            {summary.votesCast} of {summary.eligibleVoters} voters have estimated.
          </Typography>
        </Stack>

        <LinearProgress variant="determinate" value={progress} />

        {revealed ? (
          <Stack spacing={1.5}>
            <Typography variant="body1">
              Average: <strong>{summary.average ?? 'N/A'}</strong>
            </Typography>

            {summary.distribution.map((item) => (
              <Stack key={item.value} spacing={0.5}>
                <Typography variant="body2">
                  {item.value}: {item.count} vote{item.count === 1 ? '' : 's'} ({item.percentage}%)
                </Typography>
                <LinearProgress variant="determinate" value={item.percentage} />
              </Stack>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Votes stay hidden until the facilitator reveals them.
          </Typography>
        )}

        <Stack direction="row" spacing={1}>
          <Button variant="contained" disabled={isBusy || revealed} onClick={onReveal}>
            Reveal
          </Button>
          <Button variant="outlined" disabled={isBusy} onClick={onReset}>
            Reset
          </Button>
          <Button color="error" variant="outlined" onClick={onLeave}>
            Leave Room
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}
