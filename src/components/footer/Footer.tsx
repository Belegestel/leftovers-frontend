import { Box, Link, Typography } from '@mui/material';
import instagramIcon from '@/assets/instagram.svg';
import facebookIcon from '@/assets/facebook.svg';

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: 3,
        py: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Link href="https://www.instagram.com/" aria-label="Instagram">
        <Box
          component="img"
          src={instagramIcon}
          alt="Instagram"
          sx={{
            width: 24,
            heigh: 24,
            display: 'block',
          }}
        />
      </Link>

      <Link href="https://www.facebook.com/" aria-label="Facebook">
        <Box
          component="img"
          src={facebookIcon}
          alt="Facebook"
          sx={{
            width: 24,
            heigh: 24,
            display: 'block',
          }}
        />
      </Link>

      <Typography variant="body2">contact@leftovers.com</Typography>

      <Box sx={{height:20,width:'1px',bgcolor:'#888888',mx:1}}/>

      <Link href='/tos' underline='hover' color='text.primary'>Terms of Service</Link>

      <Box sx={{height:20,width:'1px',bgcolor:'#888888',mx:1}}/>

      <Link href='/privacy' underline='hover' color='text.primary'>Privacy Policy</Link>
    </Box>
  );
}
