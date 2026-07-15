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
import { useState } from 'react';
import { useRecipeCategories } from '@/hooks/useRecipeCategories';
import { removeToken } from '@/services/tokenService';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

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
  const [searchQuery, setSearchQuery] = useState('');
  const { authChanged } = useAuth();

  const { categories } = useRecipeCategories();

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      return;
    }
  };

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
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <IconButton size="small" onClick={handleSearch}>
              <SearchIcon fontSize="small" />
            </IconButton>
          </SearchBox>
        </Box>

        <Spacer />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {authenticated && (
            <Button color="primary" startIcon={<AddIcon />}>
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
                  setRecipesAnchor(null);
                }}
                sx={{
                  borderTop: index != 0 ? '1px solid' : '0px solid',
                  borderColor: 'divider',
                }}
              >
                {category.name.replace(/\b\w/g, (char) => char.toUpperCase())}
              </MenuItem>
            ))}
          </Menu>
          {authenticated ? (
            <>
              <Button
                variant="contained"
                endIcon={<KeyboardArrowDownIcon />}
                onClick={(event) => setMyAccountAnchor(event.currentTarget)}
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
                    navigate('/saved');
                  }}
                >
                  Saved recipes
                </MenuItem>
                <MenuItem
                  key="my-recipes"
                  onClick={() => {
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
                    // navigate('/');
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
