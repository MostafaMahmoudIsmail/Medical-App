from rest_framework.routers import DefaultRouter
from .views import *
from django.urls import path

router = DefaultRouter()
router.register("admin/users", AdminUserViewSet, basename="admin-users")
router.register("admin/appointments", AdminAppointmentViewSet, basename="admin-appointments")
router.register("admin/specialties", SpecialtyViewSet, basename="specialties")

urlpatterns = router.urls



urlpatterns += [
    path("doctor/profile/", DoctorProfileView.as_view(), name="doctor-profile"),
    path("patient/profile/", PatientProfileView.as_view(), name="patient-profile"),
]
