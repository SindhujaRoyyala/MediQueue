
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import DoctorProfile, Appointment
from .serializers import (
    DoctorProfileSerializer,
    DoctorCreateSerializer,
    AppointmentSerializer
)
 
 
class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'admin'
 
 
class IsDoctorUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'doctor'
 
 
# ── Doctor Views 
class DoctorListView(generics.ListAPIView):
    """Any logged-in user can view the list of doctors."""
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
 
 
class DoctorDetailView(generics.RetrieveAPIView):
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
 
 
class DoctorCreateView(generics.CreateAPIView):
    """Only admin can add a doctor."""
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorCreateSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
 
 
class DoctorUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """Only admin can edit or delete a doctor."""
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorCreateSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
 
 
# ── Appointment Views ─────────────────────────────────────────────────────────
 
class BookAppointmentView(generics.CreateAPIView):
    """Patient books an appointment."""
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
 
    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)
 
 
class MyAppointmentsView(generics.ListAPIView):
    """Patient views their own appointments."""
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
 
    def get_queryset(self):
        return Appointment.objects.filter(patient=self.request.user)
 
 
class CancelAppointmentView(APIView):
    """Patient cancels their own appointment."""
    permission_classes = [permissions.IsAuthenticated]
 
    def patch(self, request, pk):
        try:
            appt = Appointment.objects.get(pk=pk, patient=request.user)
            appt.status = 'Cancelled'
            appt.save()
            return Response({"message": "Appointment cancelled."})
        except Appointment.DoesNotExist:
            return Response(
                {"error": "Appointment not found."},
                status=status.HTTP_404_NOT_FOUND
            )
 
 
class DoctorAppointmentsView(generics.ListAPIView):
    """Doctor views appointments assigned to them."""
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsDoctorUser]
 
    def get_queryset(self):
        doctor_profile = self.request.user.doctor_profile
        return Appointment.objects.filter(doctor=doctor_profile)
 
 
class UpdateAppointmentStatusView(APIView):
    """Doctor or Admin updates appointment status."""
    permission_classes = [permissions.IsAuthenticated]
 
    def patch(self, request, pk):
        try:
            appt = Appointment.objects.get(pk=pk)
            new_status = request.data.get('status')
            if new_status not in ['Pending', 'Confirmed', 'Cancelled', 'Completed']:
                return Response(
                    {"error": "Invalid status."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            appt.status = new_status
            appt.notes = request.data.get('notes', appt.notes)
            appt.save()
            return Response(AppointmentSerializer(appt).data)
        except Appointment.DoesNotExist:
            return Response(
                {"error": "Not found."},
                status=status.HTTP_404_NOT_FOUND
            )
 
 
class AllAppointmentsView(generics.ListAPIView):
    """Admin views all appointments in the system."""
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    queryset = Appointment.objects.all()

