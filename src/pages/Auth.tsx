import { AuthView } from '@neondatabase/neon-js/auth/react/ui';
import { Navigate, useParams } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const { pathname } = useParams();
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/habit" replace />
  }
  return (
    <div className="min-h-screen flex items-baseline justify-center z-0 pt-20">
      <div className="flex items-center justify-center w-full">
        <AuthView pathname={pathname} />
      </div>
    </div>
  )
}
