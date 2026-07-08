import { Outlet } from 'react-router';
import { Container } from '@mui/material';
import { NavBar } from '@/components/navigation/NavBar';

export function RootLayout() {
  return (
    <>
      <NavBar />
      <Container maxWidth="lg">
        <Outlet />
      </Container>
    </>
  );
}
