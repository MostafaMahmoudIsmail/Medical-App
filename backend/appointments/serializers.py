from rest_framework import serializers
from .models import DoctorAvailability
from .models import Appointment
from datetime import date
from rest_framework import serializers
from .models import Appointment

class DoctorAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorAvailability
        fields = ["id", "day", "start_time", "end_time"]



class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source="doctor.user.username", read_only=True)
    patient_name = serializers.CharField(source="patient.user.username", read_only=True)

    class Meta:
        model = Appointment
        fields = [
            "id",
            "doctor_name",
            "patient_name",
            "availability",
            "date",
            "status",
            "notes",
        ]
        extra_kwargs = {
            "status": {"required": False},
            "notes": {"required": False},
        }

    def validate(self, data):
        # أثناء التحديث (PATCH)، ما نتحققش من availability
        if self.instance:
            return data

        availability = data.get("availability")
        chosen_date = data.get("date")

        if not availability or not chosen_date:
            raise serializers.ValidationError("Availability and date are required.")

        from datetime import date
        if chosen_date < date.today():
            raise serializers.ValidationError("Cannot book a past date.")

        doctor = availability.doctor
        if Appointment.objects.filter(
            doctor=doctor, date=chosen_date, availability=availability
        ).exists():
            raise serializers.ValidationError("This slot is already booked.")

        return data

