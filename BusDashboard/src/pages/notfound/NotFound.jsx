import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const Navigate = useNavigate()
  return (
    <Box
      sx={{
        display: 'grid',
        height: '100vh',
        placeContent: 'center',
        backgroundColor: 'background.default',
        px: 4,
      }}
    >
      <Box textAlign="center">
        <Typography
          variant="h1"
          sx={{
            fontWeight: 'bold',
            fontSize: '9rem',
            color: (theme) => theme.palette.mode === 'dark' ? 'grey.700' : 'grey.200',
          }}
        >
          404
        </Typography>

        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            letterSpacing: 'tight',
            color: (theme) => theme.palette.mode === 'dark' ? 'common.white' : 'grey.900',
          }}
        >
          Uh-oh!
        </Typography>

        <Typography
          sx={{
            mt: 4,
            color: (theme) => theme.palette.mode === 'dark' ? 'grey.400' : 'grey.500',
          }}
        >
          We can't find that page.
        </Typography>

        <Button
          onClick={()=>{Navigate('/')}}
          variant="contained"
          color="primary"
          sx={{
            mt: 4,
            px: 5,
            py: 1.5,
            fontSize: 'small',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            '&:focus': {
              outline: 'none',
              ring: 1,
              ringColor: 'primary.main',
            },
          }}
        >
          Go Back Home
        </Button>
      </Box>
    </Box>
  );
}

export default NotFound;
