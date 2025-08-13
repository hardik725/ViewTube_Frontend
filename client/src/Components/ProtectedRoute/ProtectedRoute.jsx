import { useAuth } from '../AuthProvider/AuthProvider';
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({children}) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/user" replace />;
}

export default ProtectedRoute;