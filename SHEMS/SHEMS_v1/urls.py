from django.urls import path

from . import views

# urlpatterns = [
    # path("", views.index, name="index"),
# ]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (CustomerViewSet, ServiceLocationViewSet, 
                    CustomerServiceLocationViewSet, DeviceManagerViewSet, 
                    DataHistoryViewSet, EnergyPricesViewSet, 
                    ServiceLocationDeviceMappingViewSet)

router = DefaultRouter()
router.register(r'customers', CustomerViewSet)
router.register(r'servicelocations', ServiceLocationViewSet)
router.register(r'customerservicelocations', CustomerServiceLocationViewSet)
router.register(r'devicemanagers', DeviceManagerViewSet)
router.register(r'datahistories', DataHistoryViewSet)
router.register(r'energyprices', EnergyPricesViewSet)
router.register(r'servicelocationdevicemappings', ServiceLocationDeviceMappingViewSet)

urlpatterns = [
    path('', include(router.urls)),
]