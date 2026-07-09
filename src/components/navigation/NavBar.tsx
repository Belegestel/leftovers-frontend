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
import { isAuthenticated, removeToken } from '@/auth/authService';
import { useNavigate } from 'react-router';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: 'none',
  borderBottom: '1px solid #eeeeee',
}));

const SearchBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: 570,
  height: 40,
  padding: '0 16px',
  borderRadius: theme.shape.borderRadius,
  border: '2px solid #dddddd',
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

export function NavBar() {
  const navigate = useNavigate();
  const [recipesAnchor, setRecipesAnchor] = useState<null | HTMLElement>(null);
  const [myAccountAnchor, setMyAccountAnchor] = useState<null | HTMLElement>(
    null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => setAuthenticated(isAuthenticated()), []);

  const { categories } = useRecipeCategories();

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    console.log(`Searching: ${searchQuery}`);
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            <Logo src={logo} alt="Leftovers logo" />
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
                  console.log('Clicked', category.name);
                  setRecipesAnchor(null);
                }}
                sx={{
                  borderTop: index != 0 ? '2px solid' : '0px solid',
                  borderColor: '#cccccc',
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
                    console.log('Clicked saved recipes');
                    navigate('/saved');
                  }}
                >
                  Saved recipes
                </MenuItem>
                <MenuItem
                  key="my-recipes"
                  onClick={() => {
                    console.log('Clicked my recipes');
                    navigate('/my-recipes');
                  }}
                >
                  My recipes
                </MenuItem>
                <MenuItem
                  key="log-out"
                  onClick={() => {
                    removeToken();
                    setAuthenticated(false);
                    navigate('/');
                    setMyAccountAnchor(null);
                  }}
                >
                  Log out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="primary">Log in</Button>
              <Button variant="contained"> Sign up </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}
