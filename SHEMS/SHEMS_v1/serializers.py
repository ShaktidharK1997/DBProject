from django.contrib.auth.models import Group, User
from rest_framework import serializers

from .models import Customer, ServiceLocation, CustomerServiceLocation, DeviceManager, DataHistory, EnergyPrices, ServiceLocationDeviceMapping

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class ServiceLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceLocation
        fields = '__all__'

class CustomerServiceLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerServiceLocation
        fields = '__all__'

class DeviceManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceManager
        fields = '__all__'

class DataHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DataHistory
        fields = '__all__'

class EnergyPricesSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnergyPrices
        fields = '__all__'

class ServiceLocationDeviceMappingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceLocationDeviceMapping
        fields = '__all__'
    
class ServiceLocationEnergyUsageSerializer(serializers.ModelSerializer):
    energy_used = serializers.FloatField()

    class Meta:
        model = ServiceLocation
        fields = ('servicelocationid', 'energy_used')

class DeviceTypeEnergyUsageSerializer(serializers.ModelSerializer):
    energy_used = serializers.FloatField()

    class Meta:
        model = DeviceManager
        fields = ('type', 'energy_used')
