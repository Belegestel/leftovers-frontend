import { RegisterModal } from '@/components/auth/RegisterModal';
import { useLocalizedNavigate } from '@/hooks/useLocalizedNavigate';

export default function Register() {
  const navigate = useLocalizedNavigate();

  return (
    <RegisterModal 
      open 
      onClose={() => navigate('/')}
    />
  )
}
