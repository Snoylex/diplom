import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }: any) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/admin" />;

  if (!user.isAdmin) return <Navigate to="/" />;

  return children;
}