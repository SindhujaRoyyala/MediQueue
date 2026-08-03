import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';
 
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
 
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }
 
  return user ? children : <Navigate to="/login" />;
};
 
export default PrivateRoute;
