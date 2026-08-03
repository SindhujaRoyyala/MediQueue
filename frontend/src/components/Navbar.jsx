import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
 
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
 
  const handleLogout = async () => {
    const refresh = localStorage.getItem('refresh_token');
    try {
      await axiosInstance.post('/accounts/logout/', { refresh });
    } catch (e) {
      // ignore error, still logout
    }
    logout();
    navigate('/login');
  };
 
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1565C0' }}>
    <Toolbar>
        <LocalHospitalIcon sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Hospital Appointment System
        </Typography>
 
        {user ? (
          <Box display="flex" gap={2} alignItems="center">
            <Button color="inherit" component={Link} to="/">Dashboard</Button>
            <Button color="inherit" component={Link} to="/doctors">Doctors</Button>
            <Button color="inherit" component={Link} to="/my-appointments">My Appointments</Button>
            {user.role === 'admin' && (
              <Button color="inherit" component={Link} to="/admin">Admin</Button>
            )}
            <Typography variant="body2" sx={{ mx: 1 }}>
                              Hi, {user.first_name || user.username}
            </Typography>
            <Button
              color="inherit"
              variant="outlined"
              onClick={handleLogout}
              size="small"
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box display="flex" gap={1}>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" variant="outlined" component={Link} to="/register">
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};
 
export default Navbar;


