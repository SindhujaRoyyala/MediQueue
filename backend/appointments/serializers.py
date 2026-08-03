from rest_framework import serializers
from .models import DoctorProfile, Appointment
from accounts.serializers import UserSerializer
 
 
class DoctorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
 
    class Meta:
        model = DoctorProfile
        fields = '__all__'
 
 
class DoctorCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorProfile
        fields = '__all__'
 
 
class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    doctor_specialization = serializers.SerializerMethodField()
 
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ('patient', 'created_at', 'updated_at')
 
    def get_patient_name(self, obj):
        return obj.patient.get_full_name() or obj.patient.username
 
    def get_doctor_name(self, obj):
        return obj.doctor.user.get_full_name() or obj.doctor.user.username
    
    def get_doctor_specialization(self, obj):
        return obj.doctor.specialization

