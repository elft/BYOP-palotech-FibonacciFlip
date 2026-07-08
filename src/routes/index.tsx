import { createFileRoute } from '@tanstack/react-router'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import AddIcon from '@mui/icons-material/Add'
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { green, yellow } from '@mui/material/colors'
export const Route = createFileRoute('/')({ component: Home })

function Home() {
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

        <Stack direction="row" spacing={2} >
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ArrowRightIcon sx={{ color: yellow[500] }}></ArrowRightIcon>}
            onClick={() => console.log('Join Room Clicked')}
            fullWidth
          >
            Join Room
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            size="large"
            startIcon={<AddIcon sx={{ color: green[500] }}></AddIcon>}
            onClick={() => console.log('Create Room Clicked')}
            fullWidth
          >
            Create Room
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
