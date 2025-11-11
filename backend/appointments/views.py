from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from django.core.mail import send_mail
from med_core.settings import DEFAULT_FROM_EMAIL 
from profiles.models import DoctorProfile
from .models import DoctorAvailability
from .serializers import DoctorAvailabilitySerializer
from .permissions import IsDoctorUser

from .models import Appointment
from profiles.models import PatientProfile
from .serializers import AppointmentSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from profiles.models import PatientProfile, DoctorProfile
from .models import Appointment
from .serializers import AppointmentSerializer


class DoctorAvailabilityViewSet(viewsets.ModelViewSet):
    serializer_class = DoctorAvailabilitySerializer
    permission_classes = [permissions.IsAuthenticated, IsDoctorUser]

    def get_queryset(self):
        doctor_profile = DoctorProfile.objects.get(user=self.request.user)
        return DoctorAvailability.objects.filter(doctor=doctor_profile)

    def perform_create(self, serializer):
        doctor_profile = DoctorProfile.objects.get(user=self.request.user)
        serializer.save(doctor=doctor_profile)


class PublicAvailabilityViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = DoctorAvailabilitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = DoctorAvailability.objects.all()
        doctor_id = self.request.query_params.get("doctor")
        if doctor_id:
            qs = qs.filter(doctor_id=doctor_id)  
        return qs
    


class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "DOCTOR":
            return Appointment.objects.filter(doctor__user=user)
        elif user.role == "PATIENT":
            return Appointment.objects.filter(patient__user=user)
        elif user.role == "ADMIN":
            return Appointment.objects.all()
        return Appointment.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != "PATIENT":
            raise permissions.PermissionDenied("Only patients can book appointments.")
        patient = PatientProfile.objects.get(user=user)
        availability = serializer.validated_data["availability"]
        doctor = availability.doctor
        serializer.save(patient=patient, doctor=doctor)

    def perform_update(self, serializer):
        instance = serializer.save()

        if instance.status in ["CONFIRMED", "CANCELLED", "COMPLETED"]:
            subject = ""
            message = ""

            if instance.status == "CONFIRMED":
                subject = "Your Appointment is Confirmed"
                message = (
                    f"Hello {instance.patient.user.username},\n\n"
                    f"Your appointment with Dr. {instance.doctor.user.username} on {instance.date} "
                    f"has been confirmed.\n\nThank you!"
                )
            elif instance.status == "CANCELLED":
                subject = "Your Appointment has been Cancelled"
                message = (
                    f"Dear {instance.patient.user.username},\n\n"
                    f"Your appointment with Dr. {instance.doctor.user.username} scheduled on {instance.date} was cancelled.\n\n"
                    f"Notes: {instance.notes or 'No additional notes.'}\n\nBest regards."
                )
            elif instance.status == "COMPLETED":
                subject = "Your Appointment is Completed"
                message = (
                    f"Hello {instance.patient.user.username},\n\n"
                    f"Your appointment with Dr. {instance.doctor.user.username} on {instance.date} has been marked as completed.\n\nThank you!"
                )

            if subject and message and instance.patient.user.email:
                send_mail(
                    subject,
                    message,
                    DEFAULT_FROM_EMAIL,
                    [instance.patient.user.email],
                    fail_silently=False, 
                )
