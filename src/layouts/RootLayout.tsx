import { Outlet } from 'react-router';
import { Container } from '@mui/material';

export function RootLayout() {
  return (
    <>
      <Container maxWidth="lg">
        <Outlet />
      </Container>
    </>
  );
}
