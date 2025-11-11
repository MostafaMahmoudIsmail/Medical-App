from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class DoctorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="doctor_profile")

    specialty = models.CharField(max_length=100)
    bio = models.TextField(blank=True)
    phone = models.CharField(max_length=20)
    years_of_experience = models.PositiveIntegerField(default=0)
    clinic_address = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Doctor Profile: {self.user.username}"


class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="patient_profile")

    phone = models.CharField(max_length=20)
    age = models.PositiveIntegerField(default=0)
    gender = models.CharField(
        max_length=10,
        choices=[("MALE", "Male"), ("FEMALE", "Female")],
        blank=True,
    )
    address = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Patient Profile: {self.user.username}"


class Specialty(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
