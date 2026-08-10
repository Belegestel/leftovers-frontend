import { styled } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Button,
  InputBase,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  Typography,
  Divider,
  Badge,
} from '@mui/material';
import logo from '@/assets/logo.svg';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { useRecipeCategories } from '@/hooks/useRecipeCategories';
import { removeToken } from '@/services/tokenService';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { NotificationCard } from '../notification/NotificationCard';
import { useNotifications } from '@/context/NotificationContext';

interface NavBarProps {
  authenticated: boolean;
  onLogout: () => void;
}

export function NavBar({ authenticated, onLogout }: NavBarProps) {
  const navigate = useNavigate();
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

  useEffect(() => {
    const query = searchParams.get('search') ?? '';
    if (query.trim()) {
      setSearchQuery(query.trim());
    }
  }, []);

  const handleSearch = () => {
    navigate(`/recipes?${searchParams.toString()}`);
  };
  const { notifications } = useNotifications();
  const unreadNotificationsCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            <Logo
              src={logo}
              alt="Leftovers logo"
              onClick={() => navigate('/')}
              sx={{ cursor: 'pointer' }}
            />
          </Box>
          <SearchBox>
            <SearchInput
              placeholder="Search"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                const newParams = {
                  ...searchParams,
                };
                if (event.target.value.trim()) {
                  newParams.delete('category');
                  newParams.delete('saved');
                }
                setSearchParams(newParams);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <IconButton size="small" onClick={handleSearch} aria-label="search">
              <SearchIcon fontSize="small" />
            </IconButton>
          </SearchBox>
        </Box>

        <Spacer />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {authenticated && (
            <Button
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate('/add-recipe')}
            >
              Add recipe
            </Button>
          )}
          <Button
            color="inherit"
            endIcon={<KeyboardArrowDownIcon />}
            onClick={(event) => setRecipesAnchor(event.currentTarget)}
          >
            Recipes
          </Button>
          <Menu
            anchorEl={recipesAnchor}
            open={Boolean(recipesAnchor)}
            onClose={() => setRecipesAnchor(null)}
            slotProps={{ paper: { sx: { width: 220 } } }}
          >
            {categories.map((category, index) => (
              <MenuItem
                key={category.name}
                onClick={() => {
                  navigate({
                    pathname: '/recipes',
                    search:
                      index == 0
                        ? ''
                        : `?category=${encodeURIComponent(category.name.trim())}`,
                  });
                  setRecipesAnchor(null);
                }}
                sx={{
                  borderTop: index != 0 ? '1px solid' : '0px solid',
                  borderColor: 'divider',
                }}
              >
                {`${category.emoji} ${category.name.replace(/\b\w/g, (char) => char.toUpperCase())}`}
              </MenuItem>
            ))}
          </Menu>
          {authenticated ? (
            <>
              <Button
                onClick={(event) => setNotificationsAnchor(event.currentTarget)}
                aria-label='notifications-button'
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
                    <Box key={index}>
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
                My account
              </Button>
              <Menu
                anchorEl={myAccountAnchor}
                open={Boolean(myAccountAnchor)}
                onClose={() => setMyAccountAnchor(null)}
              >
                <MenuItem
                  key="saved-recipes"
                  onClick={() => {
                    setMyAccountAnchor(null);
                    navigate('/saved');
                  }}
                >
                  Saved recipes
                </MenuItem>
                <MenuItem
                  key="my-recipes"
                  onClick={() => {
                    setMyAccountAnchor(null);
                    navigate('/my-recipes');
                  }}
                >
                  My recipes
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
                  Log out
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
                Log in
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
                Sign up
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
const SearchInput = styled(InputBase)({ flex: 1 });
const Spacer = styled(Box)({
  flexGrow: 1,
});
const Logo = styled('img')({
  height: 40,
  width: 'auto',
  display: 'block',
});
