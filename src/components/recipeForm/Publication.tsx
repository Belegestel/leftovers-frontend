import { useState } from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { useSnackbar } from '../common/SnackbarProvider';
import { ConfirmModal } from '../common/ConfirmationModal';
import { useTranslation } from 'react-i18next';
import { useLocalizedNavigate } from '@/hooks/useLocalizedNavigate';
import type { Recipe } from '@/types/recipe';

interface PublicationProps {
  onBack: () => void;
  onSavePrivate: () => Promise<Recipe>;
  onPublish: () => Promise<Recipe>;
  onEdit: (recipeId: number, isPrivate: boolean) => Promise<void>;
  onChangeVisibility: (recipeId: number, isPrivate: boolean) => Promise<void>;
  onRecipeDelete: (recipeId: number) => Promise<void>;
  recipeId?: number;
  isPublic?: boolean;
  isDirty?: boolean;
}

export function Publication({
  onBack,
  onSavePrivate,
  onPublish,
  onEdit,
  onChangeVisibility,
  onRecipeDelete,
  recipeId,
  isPublic,
  isDirty,
}: PublicationProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const showSnackbar = useSnackbar();
  const navigate = useLocalizedNavigate();

  const saved = isPublic === undefined ? null : isPublic ? 'public' : 'private';

  const { t } = useTranslation();

  const handleAction = async (
    action: () => Promise<Recipe>,
    editAction: (recipeId: number, isPrivate: boolean) => Promise<void>,
    visibilityAction: (recipeId: number, isPrivate: boolean) => Promise<void>,
    isPrivate: boolean
  ) => {
    try {
      setLoading(true);
      setError(null);

      if (recipeId === undefined || isDirty) {
        if (recipeId === undefined) {
          await action();
        } else {
          await editAction(recipeId, isPrivate);
        }
      } else {
        await visibilityAction(recipeId, isPrivate);
      }
      if (isPrivate) {
        showSnackbar({
          message: `🔒 ${t('addRecipe.snackbar.savedPrivate')}`,
        });
      } else {
        showSnackbar({
          message: `👏 ${t('addRecipe.snackbar.savedPublic')}`,
        });
      }
      if (isPrivate) {
        showSnackbar({
          message:
            '🔒 Your recipe has been saved as private. You can find it in your profile.',
        });
      } else {
        showSnackbar({
          message: '👏 Congratulations! Your recipe has been published!',
        });
      }
    } catch {
      setError(t('addRecipe.pages.publication.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (recipeId === undefined) {
        return;
      }

      setLoading(true);
      setError(null);

      await onRecipeDelete(recipeId);
      navigate('/');
      showSnackbar({
        message: '🗑️ Your recipe has been deleted!',
      });
    } catch {
      setError(t('addRecipe.pages.publication.error'));
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
    }

    showSnackbar({
      message: `🗑️ ${t('addRecipe.snackbar.deleted')}`,
    });
  };

  return (
    <Box
      sx={{
        mt: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h6">
          {t('addRecipe.pages.publication.title')}
        </Typography>

        <Button
          variant="secondary"
          onClick={onBack}
          sx={{ border: '1px solid', borderColor: 'currentColor' }}
        >
          &lt; {t('addRecipe.back')}
        </Button>
      </Box>

      {error && (
        <Typography
          color="error"
          sx={{
            mb: 2,
          }}
        >
          {error}
        </Typography>
      )}

      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 3,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 500, fontSize: 20 }}>
              {t('addRecipe.pages.publication.savePrivateTitle')}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {t('addRecipe.pages.publication.savePrivateDesc')}
            </Typography>
          </Box>

          <Button
            variant="secondary"
            disabled={loading || (saved === 'private' && !(isDirty ?? false))}
            onClick={() =>
              handleAction(onSavePrivate, onEdit, onChangeVisibility, true)
            }
            sx={{
              borderColor: 'currentColor',
              border: '1px solid',
              '&:hover svg': { transform: 'rotate(15deg)' },
              '& svg': { transition: 'transform 200ms ease-out' },
            }}
          >
            <LockIcon sx={{ fontSize: 20, mr: 1 }} />
            <Typography sx={{ fontWeight: 600 }}>
              {loading
                ? t('addRecipe.pages.publication.buttons.saving')
                : saved === 'private' && !(isDirty ?? false)
                  ? t('addRecipe.pages.publication.buttons.savedPrivate')
                  : t('addRecipe.pages.publication.buttons.toSavePrivate')}
            </Typography>
          </Button>
        </Box>

        <Divider />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 3,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 500, fontSize: 20 }}>
              {t('addRecipe.pages.publication.publishTitle')}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {t('addRecipe.pages.publication.publishDesc')}
            </Typography>
          </Box>

          <Button
            variant="contained"
            disabled={loading || (saved === 'public' && !isDirty)}
            onClick={() =>
              handleAction(onPublish, onEdit, onChangeVisibility, false)
            }
            sx={{
              '&:hover svg': { transform: 'rotate(15deg)' },
              '& svg': { transition: 'transform 200ms ease-out' },
            }}
          >
            <PublicIcon sx={{ mr: 1 }} />

            <Typography>
              {loading
                ? t('addRecipe.pages.publication.buttons.publishing')
                : saved === 'public' && !isDirty
                  ? t('addRecipe.pages.publication.buttons.published')
                  : t('addRecipe.pages.publication.buttons.toPublish')}
            </Typography>
          </Button>
        </Box>

        <Divider />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 3,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 500, fontSize: 20 }}>
              {t('addRecipe.pages.publication.deleteTitle')}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {t('addRecipe.pages.publication.deleteDesc')}
            </Typography>
          </Box>

          <Button
            variant="secondary"
            disabled={loading || recipeId === null}
            onClick={() => setDeleteModalOpen(true)}
            sx={{
              border: '1px solid',
              color: 'warning.main',
              borderColor: 'currentColor',
              '&:hover svg': { transform: 'rotate(15deg)' },
              '& svg': { transition: 'transform 200ms ease-out' },
            }}
          >
            <DeleteForeverOutlinedIcon
              sx={{
                mr: 1,
              }}
            />

            <Typography
              sx={{
                fontWeight: 500,
              }}
            >
              {t('addRecipe.pages.publication.buttons.toDelete')}
            </Typography>
          </Button>
        </Box>
      </Box>

      <ConfirmModal
        open={deleteModalOpen}
        title={t('addRecipe.pages.publication.deleteModal.title')}
        message={t('addRecipe.pages.publication.deleteModal.message')}
        confirmButton={t(
          'addRecipe.pages.publication.deleteModal.confirmButton'
        )}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </Box>
  );
}
