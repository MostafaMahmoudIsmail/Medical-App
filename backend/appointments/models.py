from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings
from profiles.models import DoctorProfile

class DoctorAvailability(models.Model):
    doctor = models.ForeignKey(
        DoctorProfile,
        on_delete=models.CASCADE,
        related_name="availabilities"
    )
    day = models.CharField(
        max_length=10,
        choices=[
            ("MON", "Monday"),
            ("TUE", "Tuesday"),
            ("WED", "Wednesday"),
            ("THU", "Thursday"),
            ("FRI", "Friday"),
            ("SAT", "Saturday"),
            ("SUN", "Sunday"),
        ],
    )
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        unique_together = ("doctor", "day", "start_time", "end_time")

    def __str__(self):
        return f"{self.doctor.user.username} - {self.day} ({self.start_time} to {self.end_time})"


from profiles.models import PatientProfile

class Appointment(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("CONFIRMED", "Confirmed"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
    ]

    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name="appointments")
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name="appointments")
    availability = models.ForeignKey("DoctorAvailability", on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")
    notes = models.TextField(blank=True)

    class Meta:
        unique_together = ("doctor", "patient", "date", "availability")

    def __str__(self):
        return f"{self.patient.user.username} -> {self.doctor.user.username} on {self.date}"
