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
} from '@mui/material';
import logo from '@/assets/logo.svg';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { useRecipeCategories } from '@/hooks/useRecipeCategories';
import { removeToken } from '@/services/tokenService';
import {
  useLocation,
  useNavigate,
  useLocation,
  useSearchParams,
} from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
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
  const [searchQuery, setSearchQuery] = useState('');
  const { authChanged } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const { categories } = useRecipeCategories();

  const { t } = useTranslation();

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      return;
    }
    navigate(`/recipes?${searchParams.toString()}`);
  };

  useEffect(() => {
    const query = searchParams.get('search') ?? '';
    if (query.trim()) {
      setSearchQuery(query.trim());
    }
  }, []);

  return (
    <StyledAppBar position="sticky">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            <Logo
              src={logo}
              alt={t('navbar.logo')}
              onClick={() => navigate('/')}
              sx={{ cursor: 'pointer' }}
            />
          </Box>
          <SearchBox>
            <SearchInput
              placeholder={t('navbar.searchPlaceholder')}
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
              >
                <MenuItem
                  key="saved-recipes"
                  onClick={() => {
                    setMyAccountAnchor(null);
                    navigate('/saved');
                  }}
                >
                  {t('navbar.saved')}
                </MenuItem>
                <MenuItem
                  key="my-recipes"
                  onClick={() => {
                    setMyAccountAnchor(null);
                    navigate('/my-recipes');
                  }}
                >
                  {t('navbar.myRecipes')}
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
                  {t('navbar.logout')}
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
const SearchInput = styled(InputBase)({ flex: 1 });
const Spacer = styled(Box)({
  flexGrow: 1,
});
const Logo = styled('img')({
  height: 40,
  width: 'auto',
  display: 'block',
});
