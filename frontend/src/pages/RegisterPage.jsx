import { useState } from 'react';
import {
  Container, Box, TextField, Button, Typography,
  Alert, Paper, MenuItem, CircularProgress
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
 
const RegisterPage = () => {
  const [form, setForm] = useState({
    username: '', email: '', password: '', password2: '',
    first_name: '', last_name: '', phone: '', role: 'patient'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
 
    if (form.password !== form.password2) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }
 
    try {
      await axiosInstance.post('/accounts/register/', form);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const data = err.response?.data;
      const msg = data
        ? Object.values(data).flat().join(' ')
        : 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <Container maxWidth="sm">
      <Box mt={4} mb={4}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" align="center" gutterBottom color="primary" fontWeight="bold">
            Create Account
          </Typography>
{error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
 
          <Box component="form" onSubmit={handleSubmit}>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <TextField label="First Name" name="first_name"
                value={form.first_name} onChange={handleChange} fullWidth />
              <TextField label="Last Name" name="last_name"
                value={form.last_name} onChange={handleChange} fullWidth />
            </Box>
            <TextField fullWidth label="Username" name="username"
              value={form.username} onChange={handleChange} margin="normal" required />
            <TextField fullWidth label="Email" name="email" type="email"
              value={form.email} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Phone" name="phone"
              value={form.phone} onChange={handleChange} margin="normal" />
            <TextField fullWidth select label="Register As" name="role"
              value={form.role} onChange={handleChange} margin="normal">
              <MenuItem value="patient">Patient</MenuItem>
              <MenuItem value="doctor">Doctor</MenuItem>
            </TextField>
            <TextField fullWidth label="Password" name="password" type="password"
              value={form.password} onChange={handleChange} margin="normal" required />
            <TextField fullWidth label="Confirm Password" name="password2" type="password"
              value={form.password2} onChange={handleChange} margin="normal" required />
            <Button type="submit" fullWidth variant="contained" size="large"
              sx={{ mt: 3, mb: 2 }} disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </Button>
          </Box>
 
          <Typography align="center">
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#1565C0' }}>Login here</Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};
 
export default RegisterPage;


