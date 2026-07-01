import { AuthView } from '@neondatabase/neon-js/auth/react/ui';
import { useParams } from 'react-router';

export default function Auth() {
  const { pathname } = useParams();
  return (
    <div className="min-h-screen flex items-baseline justify-center z-0 pt-20">
      <div className="flex items-center justify-center w-full">
        <AuthView pathname={pathname} />
      </div>
    </div>
  )
}
