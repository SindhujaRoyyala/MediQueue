import { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Chip, Button,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, CircularProgress, Alert
} from '@mui/material';
import axiosInstance from '../api/axiosInstance';
 
const statusColors = {
  Pending: 'warning',
  Confirmed: 'success',
  Cancelled: 'error',
  Completed: 'info'
};
 
const MyAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
 
  const fetchAppointments = async () => {
    try {
      const res = await axiosInstance.get('/appointments/my/');
      setAppointments(res.data);
    } catch {
      setMsg('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => { fetchAppointments(); }, []);
 
  const handleCancel = async (id) => {

    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await axiosInstance.patch(`/appointments/${id}/cancel/`);
      setMsg('Appointment cancelled successfully.');
      fetchAppointments();
    } catch {
      setMsg('Failed to cancel appointment.');
    }
  };
 
  if (loading) return (
    <Box display="flex" justifyContent="center" mt={10}>
      <CircularProgress />
    </Box>
  );
 
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        My Appointments
      </Typography>
 
      {msg && <Alert severity="info" sx={{ mb: 2 }} onClose={() => setMsg('')}>{msg}</Alert>}
 
      {appointments.length === 0 ? (
        <Alert severity="info">You have no appointments yet.</Alert>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: '#1565C0' }}>
              <TableRow>
                {['Doctor', 'Specialization', 'Date', 'Time', 'Reason', 'Status', 'Action'].map(h => (
                  <TableCell key={h} sx={{ color: 'white', fontWeight: 'bold' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appt) => (
                <TableRow key={appt.id} hover>
                  <TableCell>Dr. {appt.doctor_name}</TableCell>
                  <TableCell>{appt.doctor_specialization}</TableCell>
                  <TableCell>{appt.appointment_date}</TableCell>
                  <TableCell>{appt.appointment_time}</TableCell>
                  <TableCell>{appt.reason}</TableCell>
                  <TableCell>
                    <Chip
                      label={appt.status}
                      color={statusColors[appt.status] || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {appt.status === 'Pending' && (
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => handleCancel(appt.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};
 
export default MyAppointmentsPage;