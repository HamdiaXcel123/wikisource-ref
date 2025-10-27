import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireVerifier?: boolean;
  excludeAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requireVerifier = false,
  excludeAdmin = false
}) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (requireVerifier && user.role !== 'verifier' && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (excludeAdmin && user.role === 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
