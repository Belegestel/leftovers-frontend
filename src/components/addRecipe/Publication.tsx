import { useState } from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

interface PublicationProps {
  onBack: () => void;
  onSavePrivate: () => Promise<void>;
  onPublish: () => Promise<void>;
}

export function Publication({
  onBack,
  onSavePrivate,
  onPublish,
}: PublicationProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (action: () => Promise<void>) => {
    try {
      setLoading(true);
      setError(null);

      await action();
    } catch {
      setError('Something went wrong while saving the recipe.');
    } finally {
      setLoading(false);
    }
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
          disabled={loading}
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
            disabled={loading}
            onClick={() => handleAction(onSavePrivate)}
            sx={{
              borderColor: 'currentColor',
              border: '1px solid',
            }}
          >
            <LockIcon sx={{ fontSize: 20, mr: 1 }} />
            <Typography sx={{ fontWeight: 600 }}>
              {loading ? 'Saving...' : 'Save as private'}
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
            disabled={loading}
            onClick={() => handleAction(onPublish)}
          >
            <PublicIcon sx={{ mr: 1 }} />

            <Typography>
              {loading ? 'Publishing...' : 'Publish the recipe'}
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
            sx={{
              border: '1px solid',
              color: 'warning.main',
              borderColor: 'currentColor',
            }}
          >
            <DeleteForeverOutlinedIcon
              sx={{
                mr: 1,
                color: 'warning.main',
              }}
            />

            <Typography
              sx={{
                fontWeight: 500,
                color: 'warning.main',
              }}
            >
              Delete the recipe
            </Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
