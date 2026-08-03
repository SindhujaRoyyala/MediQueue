import { useState } from 'react';
import {
  Container, Box, TextField, Button, Typography,
  Alert, Paper, CircularProgress
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
 
const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
 
    try {
      const tokenRes = await axiosInstance.post('/accounts/login/', form);
      const tokens = tokenRes.data;
 
      // Temporarily set token to fetch profile
      localStorage.setItem('access_token', tokens.access);
      const profileRes = await axiosInstance.get('/accounts/profile/');
 
      login(profileRes.data, tokens);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <Container maxWidth="sm">

            </Button>
          </Box>
 
          <Typography align="center">
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#1565C0' }}>Register here</Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};
 
export default LoginPage;

