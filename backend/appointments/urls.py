from django.urls import path
from .views import (
    DoctorListView, DoctorDetailView, DoctorCreateView,
    DoctorUpdateDeleteView, BookAppointmentView,
    MyAppointmentsView, CancelAppointmentView,
    DoctorAppointmentsView, UpdateAppointmentStatusView,
    AllAppointmentsView
)
 
urlpatterns = [
    # Doctor URLs
    path('doctors/', DoctorListView.as_view(), name='doctor-list'),
    path('doctors/<int:pk>/', DoctorDetailView.as_view(), name='doctor-detail'),
    path('doctors/create/', DoctorCreateView.as_view(), name='doctor-create'),
    path('doctors/<int:pk>/edit/', DoctorUpdateDeleteView.as_view(), name='doctor-edit'),
# Appointment URLs
    path('appointments/book/', BookAppointmentView.as_view(), name='book-appointment'),
    path('appointments/my/', MyAppointmentsView.as_view(), name='my-appointments'),
    path('appointments/<int:pk>/cancel/', CancelAppointmentView.as_view(), name='cancel'),
    path('appointments/doctor/', DoctorAppointmentsView.as_view(), name='doctor-appts'),
    path('appointments/<int:pk>/status/', UpdateAppointmentStatusView.as_view(), name='update-status'),
    path('appointments/all/', AllAppointmentsView.as_view(), name='all-appointments'),
]
