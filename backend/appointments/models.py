from django.db import models
from accounts.models import CustomUser
class Hospital(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    image = models.ImageField(upload_to='hospital_images/', blank=True, null=True)

    def __str__(self):
        return self.name
class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
 
 
class DoctorProfile(models.Model):
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='doctor_profile'
    )

    # NEW FIELDS
    hospital = models.ForeignKey(
        Hospital,
        on_delete=models.CASCADE,
        related_name='doctors',
        null=True,
        blank=True
    )

    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    qualification = models.CharField(
        max_length=150,
        blank=True,
        null=True
    )

    specialization = models.CharField(max_length=100)

    experience_years = models.PositiveIntegerField(default=0)

    consultation_fee = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0.00
    )

    available_days = models.CharField(
        max_length=100,
        default='Mon,Tue,Wed,Thu,Fri'
    )

    languages = models.CharField(
        max_length=150,
        blank=True,
        null=True
    )

    photo = models.ImageField(
        upload_to='doctor_photos/',
        blank=True,
        null=True
    )

    rating = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        default=0.0
    )

    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Dr. {self.user.get_full_name()} - {self.specialization}"
class AppointmentSlot(models.Model):
    doctor = models.ForeignKey(
        DoctorProfile,
        on_delete=models.CASCADE,
        related_name='slots'
    )
    date = models.DateField()
    time = models.TimeField()
    is_booked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.doctor.user.get_full_name()} - {self.date} {self.time}"
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
    slot = models.ForeignKey(
    AppointmentSlot,
    on_delete=models.CASCADE,
    related_name='appointments'
)
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
        f"{self.patient.username} booked "
        f"Dr. {self.doctor.user.get_full_name()} "
        f"on {self.slot.date} at {self.slot.time}"
    )
    class Meta:
       ordering = ['-created_at']
