import { useState } from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { useSnackbar } from '../common/SnackbarProvider';
import { ConfirmModal } from '../common/ConfirmationModal';
import { useNavigate } from 'react-router-dom';

interface PublicationProps {
  onBack: () => void;
  onSave: (isPublic: boolean, isEdit?: boolean) => Promise<number>;
  onChangeVisibility: (recipeId: number, isPrivate: boolean) => Promise<void>;
  onRecipeDelete: (recipeId: number) => Promise<void>;
  editRecipeId?: number;
  isPublic?: boolean;
  isDirty?: boolean;
}

export function Publication({
  onBack,
  onSave,
  onChangeVisibility,
  onRecipeDelete,
  editRecipeId,
  isPublic,
  isDirty,
}: PublicationProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<'private' | 'public' | null>(
    isPublic === undefined ? null : isPublic === true ? 'public' : 'private'
  );
  const [recipeId, setRecipeId] = useState<number | null>(editRecipeId ?? null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const showSnackbar = useSnackbar();
  const navigate = useNavigate();

  const handleAction = async (
    isPrivate: boolean
  ) => {
    try {
      setLoading(true);
      setError(null);

      if (recipeId === null) {
        const recipe = await onSave(isPrivate);
        setRecipeId(recipe);
      } else {
        if (isDirty) {
          onSave(isPrivate, true);
        } else {
          await onChangeVisibility(recipeId, isPrivate);
        }
      }
    } catch {
      setError('Something went wrong while saving the recipe.');
    } finally {
      setLoading(false);
    }
    if (isPrivate) {
      setSaved('private');
      showSnackbar({
        message:
          '🔒 Your recipe has been saved as private. You can find it in your profile.',
      });
    } else {
      setSaved('public');
      showSnackbar({
        message: '👏 Congratulations! Your recipe has been published!',
      });
    }
  };

  const handleDelete = async () => {
    try {
      if (recipeId === null) {
        return;
      }
      setLoading(true);
      setError(null);

      await onRecipeDelete(recipeId);
    } catch {
      setError('Something went wrong while saving the recipe.');
    } finally {
      setLoading(false);
      setRecipeId(null);
      setSaved(null);
      setDeleteModalOpen(false);
      navigate('/');
    }
    showSnackbar({
      message: '🗑️ Your recipe has been deleted!',
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
        <Typography variant="h6">Publication</Typography>

        <Button
          variant="secondary"
          onClick={onBack}
          sx={{ border: '1px solid', borderColor: 'currentColor' }}
        >
          &lt; Back
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
              Save recipe as private
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Save your recipe to your account without making it visible to
              other users. You can publish it later at any time.
            </Typography>
          </Box>

          <Button
            variant="secondary"
            disabled={loading || (saved === 'private' && !isDirty)}
            onClick={() => handleAction(true)}
            sx={{
              borderColor: 'currentColor',
              border: '1px solid',
            }}
          >
            <LockIcon sx={{ fontSize: 20, mr: 1 }} />
            <Typography sx={{ fontWeight: 600 }}>
              {loading
                ? 'Saving...'
                : saved === 'private'
                  ? 'Recipe saved'
                  : 'Save as private'}
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
              Publish your recipe
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Publish your recipe so that it becomes visible to all users.
            </Typography>
          </Box>

          <Button
            variant="contained"
            disabled={loading || (saved === 'public' && !isDirty)}
            onClick={() => handleAction(false)}
          >
            <PublicIcon sx={{ mr: 1 }} />

            <Typography>
              {loading
                ? 'Publishing...'
                : saved === 'public'
                  ? 'Recipe published'
                  : 'Publish the recipe'}
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
              Delete your recipe
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Discard this draft and remove all entered information.
            </Typography>
          </Box>

          <Button
            variant="secondary"
            disabled={loading}
            onClick={() => setDeleteModalOpen(true)}
            sx={{
              border: '1px solid',
              color: 'warning.main',
              borderColor: 'currentColor',
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
              Delete the recipe
            </Typography>
          </Button>
        </Box>
      </Box>
      <ConfirmModal
        open={deleteModalOpen}
        title="Are you sure you want to delete the recipe?"
        message="If you want to delete it, press the delete button."
        confirmButton="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </Box>
  );
}
