from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from django.contrib.auth import get_user_model
from appointments.models import Appointment
from appointments.serializers import AppointmentSerializer
from .serializers import UserSerializer
from .permissions import IsAdminUser 
from .models import Specialty
from .serializers import SpecialtySerializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import DoctorProfileSerializer, PatientProfileSerializer
from .models import DoctorProfile, PatientProfile
from rest_framework.exceptions import PermissionDenied

User = get_user_model()

class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

class AdminAppointmentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Appointment.objects.all().select_related("doctor", "patient")
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]


class SpecialtyViewSet(viewsets.ModelViewSet):
    queryset = Specialty.objects.all()
    serializer_class = SpecialtySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]



class DoctorProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = DoctorProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return DoctorProfile.objects.get(user=self.request.user)

    def perform_update(self, serializer):
        if self.request.user.role != "DOCTOR":
            raise PermissionDenied("Only doctors can edit this profile.")
        serializer.save()



class PatientProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = PatientProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return PatientProfile.objects.get(user=self.request.user)

    def perform_update(self, serializer):
        if self.request.user.role != "PATIENT":
            raise PermissionDenied("Only patients can edit this profile.")
        serializer.save()

