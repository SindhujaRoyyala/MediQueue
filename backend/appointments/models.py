from django.db import models
from accounts.models import CustomUser
 
 
class DoctorProfile(models.Model):
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='doctor_profile'
    )
    specialization = models.CharField(max_length=100)
    experience_years = models.PositiveIntegerField(default=0)
    consultation_fee = models.DecimalField(
        max_digits=8, decimal_places=2, default=0.00
    )
    available_days = models.CharField(
        max_length=100,
        default='Mon,Tue,Wed,Thu,Fri'
    )
    bio = models.TextField(blank=True, null=True)
 
    def __str__(self):
        return f"Dr. {self.user.get_full_name()} - {self.specialization}"
 
 
class Appointment(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Cancelled', 'Cancelled'),
        ('Completed', 'Completed'),
    ]
    patient = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='patient_appointments'
    )
    doctor = models.ForeignKey(
        DoctorProfile,
        on_delete=models.CASCADE,
        related_name='doctor_appointments'
    )
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    reason = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Pending'
    )
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    def __str__(self):
        return (
            f"Appointment: {self.patient.username} "
            f"with Dr. {self.doctor.user.username} "
            f"on {self.appointment_date}"
        )
 
    class Meta:
        ordering = ['-appointment_date', '-appointment_time']
