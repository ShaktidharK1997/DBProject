

# Register your models here.
from django.contrib import admin

from .models import Customer, ServiceLocation, CustomerServiceLocation
from .models import DeviceManager, DataHistory, EnergyPrices
from .models import ServiceLocationDeviceMapping

admin.site.register(Customer)
admin.site.register(ServiceLocation)
admin.site.register(CustomerServiceLocation)
admin.site.register(DeviceManager)
admin.site.register(DataHistory)
admin.site.register(EnergyPrices)
admin.site.register(ServiceLocationDeviceMapping)
