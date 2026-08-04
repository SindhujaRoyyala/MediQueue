import { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent,
  CardActions, Button, Chip, Box, CircularProgress, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
 
const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axiosInstance.get('/doctors/');
        setDoctors(res.data);
      } catch {
        setError('Failed to load doctors. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);
 
  if (loading) return (
    <Box display="flex" justifyContent="center" mt={10}>
      <CircularProgress size={60} />
    </Box>
  );
 
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Our Doctors
      </Typography>
 
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
 
      <Grid container spacing={3}>
        {doctors.map((doctor) => (
          <Grid item xs={12} sm={6} md={4} key={doctor.id}>
            <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  Dr. {doctor.user.first_name} {doctor.user.last_name}
                </Typography>
                <Chip
                  label={doctor.specialization}
                  color="primary"
                  size="small"
                  sx={{ mt: 1, mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Experience: {doctor.experience_years} years
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fee: Rs. {doctor.consultation_fee}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Available: {doctor.available_days}
                </Typography>
                {doctor.bio && (
                  <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                    {doctor.bio}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate(`/book/${doctor.id}`)}
                >
                  Book Appointment
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
 
export default DoctorsPage;
