from django.contrib.auth.models import AbstractUser
from django.db import models
 
 
class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='patient'
    )
    phone = models.CharField(max_length=15, blank=True, null=True)
 
    def __str__(self):
        return f"{self.username} ({self.role})"
 
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
