from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from profiles.models import DoctorProfile
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from .models import User     
from .serializers import RegisterSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class DoctorListView(ListAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(role="DOCTOR", is_active=True)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        data = []
        for user in queryset:  
            profile = DoctorProfile.objects.filter(user=user).first()
            data.append({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "profile_id": profile.id if profile else None,
            })

        return Response(data)
