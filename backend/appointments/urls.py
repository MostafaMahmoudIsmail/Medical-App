from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register("availability", DoctorAvailabilityViewSet, basename="availability")
router.register("public-availability", PublicAvailabilityViewSet, basename="public-availability")  
router.register("appointments", AppointmentViewSet, basename="appointments")

urlpatterns = router.urls
