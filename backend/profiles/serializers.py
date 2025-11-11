from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import DoctorProfile, PatientProfile 
from .models import Specialty

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "role",
            "is_active",
            "date_joined",
        ]
        read_only_fields = ["id", "date_joined"]


class SpecialtySerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialty
        fields = ["id", "name", "description"]



class DoctorProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = DoctorProfile
        fields = [
            "id",
            "username",
            "email",
            "specialty",
            "bio",
            "phone",
            "years_of_experience",
            "clinic_address",
        ]


class PatientProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = PatientProfile
        fields = [
            "id",
            "username",
            "email",
            "phone",
            "age",
            "gender",
            "address",
        ]
