import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 2,
        px: 3,
        textAlign: 'center',
        backgroundColor: (theme) => theme.palette.grey[200],
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} FSAD Assignment, BITS.
      </Typography>
    </Box>
  );
}
