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
import { useState } from 'react';
import { useRecipeCategories } from '@/hooks/useRecipeCategories';

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
  const [recipesAnchor, setRecipesAnchor] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
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
          >
            {categories.map((category) => (
              <MenuItem
                key={category.name}
                onClick={(event) => {
                  console.log('Clicked', category.name);
                  setRecipesAnchor(null);
                }}
              >
                {category.name.replace(/\b\w/g, (char) => char.toUpperCase())}
              </MenuItem>
            ))}
          </Menu>
          <Button color="primary">Login</Button>
          <Button variant="contained"> Sign up </Button>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}
