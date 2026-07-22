import { useEffect } from 'react';
import { Button } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getBrowserLanguage } from '@/utils/browserLanguage';
import { useSnackbar } from '@/components/common/SnackbarProvider';

const STORAGE_KEY = 'languageSuggestionDismissed';

export function useLanguageSuggestion() {
  const snackbar = useSnackbar();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const location = useLocation();
  const { lang } = useParams();

  useEffect(() => {
    const browserLanguage = getBrowserLanguage();

    if (!browserLanguage || !!lang) {
      return;
    }

    if (sessionStorage.getItem(STORAGE_KEY)) {
      return;
    }

    snackbar({
      message: t('language.switchPrompt', {
        language: browserLanguage.toUpperCase(),
      }),
      action: (
        <Button
          size="small"
          onClick={() => {
            sessionStorage.setItem(STORAGE_KEY, 'true');
            navigate(`${browserLanguage}${location.pathname}`)
          }}
        >
          {t('language.switch')}
        </Button>
      ),
    });
  }, [lang]);
}
