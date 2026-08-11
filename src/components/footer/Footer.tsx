import { Box, Link, Typography } from '@mui/material';
import instagramIcon from '@/assets/instagram.svg';
import facebookIcon from '@/assets/facebook.svg';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
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
            height: 24,
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
            height: 24,
            display: 'block',
          }}
        />
      </Link>

      <Typography variant="body2">contact@leftovers.com</Typography>

      <Box sx={{ height: 20, width: '1px', bgcolor: 'divider', mx: 1 }} />

      <Link href="/tos" underline="hover" color="text.primary">
        {t('footer.tos')}
      </Link>

      <Box sx={{ height: 20, width: '1px', bgcolor: 'divider', mx: 1 }} />

      <Link href="/privacy" underline="hover" color="text.primary">
        {t('footer.policy')}
      </Link>

      <Typography variant="body2" sx={{ ml: 'auto' }}>
        Powered by{' '}
        <Link href="https://example.com" color="inherit" underline="always">
          BotAI
        </Link>
      </Typography>
    </Box>
  );
}
