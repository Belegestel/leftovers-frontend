import { styled } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  Typography,
  Divider,
  Badge,
  Autocomplete,
  TextField,
} from '@mui/material';
import logo from '@/assets/logo.svg';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { useRecipeCategories } from '@/hooks/useRecipeCategories';
import { useRecipeSuggestions } from '@/hooks/useRecipeSuggestions';
import { removeToken } from '@/services/tokenService';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { NotificationCard } from '../notification/NotificationCard';
import { useNotifications } from '@/context/NotificationContext';
import { useTranslation } from 'react-i18next';
import { useLocalizedNavigate } from '@/hooks/useLocalizedNavigate';

interface NavBarProps {
  authenticated: boolean;
  onLogout: () => void;
}

export function NavBar({ authenticated, onLogout }: NavBarProps) {
  const navigate = useLocalizedNavigate();
  const location = useLocation();

  const [recipesAnchor, setRecipesAnchor] = useState<null | HTMLElement>(null);

  const [myAccountAnchor, setMyAccountAnchor] = useState<null | HTMLElement>(
    null
  );

  const [notificationsAnchor, setNotificationsAnchor] =
    useState<null | HTMLElement>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const { authChanged } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const { categories } = useRecipeCategories();

  const { suggestions, loading: suggestionsLoading } =
    useRecipeSuggestions(searchQuery);

  const { t } = useTranslation();

  const handleSearch = (query = searchQuery) => {
    if (!query.trim()) {
      return;
    }
    const newParams = new URLSearchParams(searchParams);
    newParams.set('search', query.trim());

    navigate(`/recipes?${newParams.toString()}`);
  };

  useEffect(() => {
    const query = searchParams.get('search') ?? '';

    if (query.trim()) {
      setSearchQuery(query.trim());
    }
  }, []);

  const { notifications } = useNotifications();
  const unreadNotificationsCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <StyledAppBar position="sticky">
      <Toolbar>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box>
            <Logo
              src={logo}
              alt={t('navbar.logo')}
              onClick={() => navigate('/')}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
                transition: 'transform 200ms ease-out',
              }}
            />
          </Box>

          <SearchBox>
            <Autocomplete
              freeSolo
              fullWidth
              options={suggestions.names}
              loading={suggestionsLoading}
              inputValue={searchQuery}
              onInputChange={(_, newValue) => {
                setSearchQuery(newValue);

                const newParams = new URLSearchParams(searchParams);

                if (newValue.trim()) {
                  newParams.delete('category');
                  newParams.delete('saved');
                }

                setSearchParams(newParams, { replace: true });
              }}
              filterOptions={(options) => options}
              onChange={(_, value) => {
                if (!value) {
                  return;
                }
                setSearchQuery(value);
                handleSearch(value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={t('navbar.searchPlaceholder')}
                  variant="standard"
                  fullWidth
                />
              )}
              sx={{
                flex: 1,
                '& .MuiInputBase-root': {
                  padding: 0,
                },
                '& .MuiInput-underline:before, & .MuiInput-underline:after': {
                  display: 'none',
                },
              }}
            />

            <IconButton
              size="small"
              onClick={() => handleSearch()}
              aria-label="search"
            >
              <SearchIcon fontSize="small" />
            </IconButton>
          </SearchBox>
        </Box>

        <Spacer />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {authenticated && (
            <Button
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate('/add-recipe')}
            >
              {t('navbar.add')}
            </Button>
          )}

          <Button
            color="inherit"
            endIcon={<KeyboardArrowDownIcon />}
            onClick={(event) => setRecipesAnchor(event.currentTarget)}
          >
            {t('navbar.recipes')}
          </Button>

          <Menu
            anchorEl={recipesAnchor}
            open={Boolean(recipesAnchor)}
            onClose={() => setRecipesAnchor(null)}
            slotProps={{
              paper: {
                sx: {
                  width: 220,
                },
              },
            }}
          >
            {categories.map((category, index) => (
              <MenuItem
                key={category.name}
                onClick={() => {
                  navigate({
                    pathname: '/recipes',
                    search:
                      index === 0
                        ? ''
                        : `?category=${encodeURIComponent(
                            category.name.trim()
                          )}`,
                  });

                  setRecipesAnchor(null);
                }}
                sx={{
                  borderTop: index !== 0 ? '1px solid' : '0px solid',
                  borderColor: 'divider',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateX(10px)',
                    },
                    transition: 'transform 200ms ease',
                  }}
                >
                  {`${category.emoji} ${category.name.replace(/\b\w/g, (char) => char.toUpperCase())}`}
                </Box>
              </MenuItem>
            ))}
          </Menu>

          {authenticated ? (
            <>
              <Button
                onClick={(event) => setNotificationsAnchor(event.currentTarget)}
                aria-label="notifications-button"
              >
                <Badge
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: 'notification.main',
                      color: 'background.default',
                    },
                  }}
                  badgeContent={unreadNotificationsCount}
                >
                  <NotificationsIcon />
                </Badge>
              </Button>
              <Popover
                anchorEl={notificationsAnchor}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={Boolean(notificationsAnchor)}
                onClose={() => setNotificationsAnchor(null)}
                slotProps={{
                  paper: {
                    sx: {
                      width: {
                        xs: 'calc(100vw - 32px)',
                        sm: 400,
                      },
                      maxWidth: '100vw',
                      maxHeight: 'min(70vh, 600px)',
                      minHeight: '100px',

                      display: 'flex',
                      flexDirection: 'column',
                    },
                  },
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ padding: '5px', textAlign: 'center' }}
                >
                  Notifications
                </Typography>
                <Divider />
                <Box
                  sx={{
                    overflowY: 'auto',
                    flex: 1,
                    px: 2,
                    pb: 2,
                  }}
                >
                  {notifications.map((notification, index) => (
                    <Box key={notification.id}>
                      {index != 0 && <Divider />}
                      <NotificationCard notification={notification} />
                    </Box>
                  ))}
                </Box>
              </Popover>
              <Button
                variant="contained"
                endIcon={<KeyboardArrowDownIcon />}
                onClick={(event) => setMyAccountAnchor(event.currentTarget)}
                sx={{ whiteSpace: 'nowrap' }}
              >
                {t('navbar.myAcc')}
              </Button>

              <Menu
                anchorEl={myAccountAnchor}
                open={Boolean(myAccountAnchor)}
                onClose={() => setMyAccountAnchor(null)}
                sx={{
                  '& .MuiMenuItem-root:hover .content': {
                    transform: 'translateX(10px)',
                  },
                  '& .MuiMenuItem-root .content': {
                    transition: 'transform 200ms ease',
                  },
                }}
              >
                <MenuItem
                  key="saved-recipes"
                  onClick={() => {
                    setMyAccountAnchor(null);
                    navigate('/saved');
                  }}
                >
                  <Box className="content">{t('navbar.saved')}</Box>
                </MenuItem>

                <MenuItem
                  key="my-recipes"
                  onClick={() => {
                    setMyAccountAnchor(null);
                    navigate('/my-recipes');
                  }}
                >
                  <Box className="content">{t('navbar.myRecipes')}</Box>
                </MenuItem>

                <MenuItem
                  key="log-out"
                  onClick={() => {
                    removeToken();
                    onLogout();
                    authChanged();
                    setMyAccountAnchor(null);
                  }}
                >
                  <Box className="content">{t('navbar.logout')}</Box>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                color="primary"
                onClick={() =>
                  navigate({
                    pathname: location.pathname,
                    search: '?login=true',
                  })
                }
              >
                {t('navbar.login')}
              </Button>

              <Button
                variant="contained"
                onClick={() =>
                  navigate({
                    pathname: location.pathname,
                    search: '?signup=true',
                  })
                }
                sx={{ whiteSpace: 'nowrap' }}
              >
                {t('navbar.signup')}
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: 'none',
}));

const SearchBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: 570,
  height: 40,
  padding: '0 16px',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
}));

const Spacer = styled(Box)({
  flexGrow: 1,
});

const Logo = styled('img')({
  height: 40,
  width: 'auto',
  display: 'block',
});
