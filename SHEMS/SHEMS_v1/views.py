from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse

from rest_framework import viewsets
from .models import Customer, ServiceLocation, CustomerServiceLocation, DeviceManager, DataHistory, EnergyPrices, ServiceLocationDeviceMapping
from .serializers import (CustomerSerializer, ServiceLocationSerializer, 
                          CustomerServiceLocationSerializer, DeviceManagerSerializer, 
                          DataHistorySerializer, EnergyPricesSerializer, 
                          ServiceLocationDeviceMappingSerializer)
                          
# views.py
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Customer  # Import the Customer model
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import ServiceLocation, DataHistory, ServiceLocationDeviceMapping, DeviceManager
from .serializers import ServiceLocationEnergyUsageSerializer
from django.db.models import Sum
from django.db import models
from django.db.models.functions import TruncDay

    


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `userid` query parameter in the URL.
        """
        queryset = Customer.objects.all()
        user = self.request.query_params.get('user')
        userid = self.request.query_params.get('userid')
        if user is not None:
            queryset = queryset.filter(user=user)
        if userid is not None:
            queryset = queryset.filter(userid=userid)
        return queryset

class ServiceLocationViewSet(viewsets.ModelViewSet):
    queryset = ServiceLocation.objects.all()
    serializer_class = ServiceLocationSerializer
    
    def get_queryset(self):
        queryset = ServiceLocation.objects.all()
        userid = self.request.query_params.get('userid')

        servicelocationid = self.request.query_params.get('servicelocationid')

        if userid is not None:
            customer_service_locations = CustomerServiceLocation.objects.filter(userid__userid=userid)
            service_location_ids = customer_service_locations.values_list('servicelocationid', flat=True)
            queryset = ServiceLocation.objects.filter(servicelocationid__in=service_location_ids)
            return queryset
        
        if servicelocationid is not None:
            queryset = queryset.filter(servicelocationid=servicelocationid)
            return queryset

        else:
            # If no userid is provided, return an empty queryset or handle as needed
            return ServiceLocation.objects.none()

class CustomerServiceLocationViewSet(viewsets.ModelViewSet):
    queryset = CustomerServiceLocation.objects.all()
    serializer_class = CustomerServiceLocationSerializer


class DeviceManagerViewSet(viewsets.ModelViewSet):
    queryset = DeviceManager.objects.all()
    serializer_class = DeviceManagerSerializer
    def get_queryset(self):
        servicelocationid = self.request.query_params.get('servicelocationid')
        deviceid = self.request.query_params.get('deviceid')

        if servicelocationid is not None:
            devices = ServiceLocationDeviceMapping.objects.filter(servicelocationid = servicelocationid)
            device_ids = devices.values_list('deviceid', flat=True)
            queryset = DeviceManager.objects.filter(deviceid__in = device_ids)
            return queryset
        
        if deviceid is not None:
            queryset = DeviceManager.objects.filter(deviceid = deviceid)
            return queryset
    
        else:
            # If no userid is provided, return an empty queryset or handle as needed
            return ServiceLocation.objects.none()
        
# class graph1(viewsets.ModelViewSet):
#     def query_set(self):
#          service_locations = CustomerServiceLocation.objects.filter(
#             userid=userid, 
#             active=True
#         ).values_list('servicelocationid', flat=True)
        
#         # Count the number of active devices at the user's service locations
#          device_count = ServiceLocationDeviceMapping.objects.filter(servicelocationid__in=service_locations,active=True
#         ).distinct().count()
         
    
        

        

class DataHistoryViewSet(viewsets.ModelViewSet):
    queryset = DataHistory.objects.all()
    serializer_class = DataHistorySerializer

class EnergyPricesViewSet(viewsets.ModelViewSet):
    queryset = EnergyPrices.objects.all()
    serializer_class = EnergyPricesSerializer

class ServiceLocationDeviceMappingViewSet(viewsets.ModelViewSet):
    queryset = ServiceLocationDeviceMapping.objects.all()
    serializer_class = ServiceLocationDeviceMappingSerializer



class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, "userid" : user.id}, status=status.HTTP_200_OK)
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)



class EnergyUsageView(APIView):
    def get(self, request, *args, **kwargs):
        # You may want to filter by date or other parameters, which you can get from request.query_params

        # Aggregate energy usage per service location
        userid = request.query_params.get('userid')
        service_locations = CustomerServiceLocation.objects.filter(
            userid=userid
        ).values_list('servicelocationid', flat=True)

        energy_per_location = ServiceLocationDeviceMapping.objects.filter(
            servicelocationid__in=service_locations,
            active=True
        ).values('servicelocationid') \
        .annotate(energy_used=Sum('deviceid__datahistory__event_value',
                                  filter=models.Q(deviceid__datahistory__event_label='energy use'))) \
        .order_by('servicelocationid')
        
        # Serialize the data
        location_serializer = ServiceLocationEnergyUsageSerializer(energy_per_location, many=True)

        # Calculate total energy usage across all service locations
        total_energy = sum(item['energy_used'] for item in energy_per_location if item['energy_used'] is not None)
        
        return Response({
            'energy_per_location': location_serializer.data,
            'total_energy_usage': total_energy
        })

from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum
from .models import DeviceManager, DataHistory, CustomerServiceLocation, ServiceLocationDeviceMapping
from .serializers import DeviceTypeEnergyUsageSerializer

class DeviceTypeEnergyUsageView(APIView):
    def get(self, request, *args, **kwargs):
        userid = request.query_params.get('userid')

        if not userid:
            return Response({'error': 'User ID is required'}, status=400)

        try:
            userid = int(userid)
        except ValueError:
            return Response({'error': 'Invalid User ID'}, status=400)

        # Get service locations for the user
        service_locations = CustomerServiceLocation.objects.filter(
            userid=userid
        ).values_list('servicelocationid', flat=True)

        # Get devices for these service locations
        devices = ServiceLocationDeviceMapping.objects.filter(
            servicelocationid__in=service_locations,
            active=True
        ).values_list('deviceid', flat=True)

        # Aggregate energy usage per device type
        energy_per_device_type = DataHistory.objects.filter(
            deviceid__in=devices,
            event_label='energy use'
        ).values('deviceid__type') \
        .annotate(energy_used=Sum('event_value')) \
        .order_by('deviceid__type')

        # Adjust the queryset to map 'deviceid__type' to 'type'
        energy_per_device_type = [
            {'type': entry['deviceid__type'], 'energy_used': entry['energy_used']}
            for entry in energy_per_device_type
        ]

        # Serialize the data
        type_serializer = DeviceTypeEnergyUsageSerializer(energy_per_device_type, many=True)


        # Calculate total energy usage
        total_energy = sum(item['energy_used'] for item in energy_per_device_type if item['energy_used'] is not None)
        
        return Response({
            'energy_per_device_type': type_serializer.data,
            'total_energy_usage': total_energy
        })





class RegisterView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")
        firstname = request.data.get("firstname")
        lastname = request.data.get("lastname")
        baline1 = request.data.get("baline1")
        baline2 = request.data.get("baline2")
        phonenumber = request.data.get("phonenumber")
        profile_photo = request.FILES.get("profile_photo")
    
        if not username or not password:
            return Response({'error': 'Both username and password are required'},
                            status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'},
                            status=status.HTTP_400_BAD_REQUEST)
        
        # Create a User instance
        user = User.objects.create_user(username=username, password=password)
        user.first_name = firstname
        user.last_name = lastname
        user.save()
        
        # Create a Customer instance and link it to the User
        customer = Customer.objects.create(
            user=user,
            firstname=firstname,
            lastname=lastname,
            baline1=baline1,
            baline2=baline2,
            phonenumber=phonenumber,
            profile_photo=profile_photo
        )
        
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    
from django.db.models import Sum
from django.http import JsonResponse
from .models import DataHistory
import datetime



class EnergyUsageOverTimeView(APIView):
    def get(self, request, *args, **kwargs):
        userid = request.query_params.get('userid')

        if not userid:
            return Response({'error': 'User ID is required'}, status=400)

        try:
            userid = int(userid)
        except ValueError:
            return Response({'error': 'Invalid User ID'}, status=400)

        # Get service locations for the user
        service_locations = CustomerServiceLocation.objects.filter(
            userid=userid
        ).values_list('servicelocationid', flat=True)

        # Get active devices from these service locations
        devices = ServiceLocationDeviceMapping.objects.filter(
            servicelocationid__in=service_locations,
            active=True
        ).values_list('deviceid', flat=True)

        # Now, use these device IDs to filter DataHistory
        energy_usage = DataHistory.objects.filter(
            deviceid__in=devices
        ).annotate(date=TruncDay('timestamp')) \
        .values('date') \
        .annotate(total_energy=Sum('event_value')) \
        .order_by('date')

        energy_usage_data = [{'timestamp': entry['date'], 'total_energy': entry['total_energy']} for entry in energy_usage]

        return Response({'energy_over_time': energy_usage_data})
                         
from .models import EnergyPrices
from django.db.models import Avg

    
class EnergyPricesByZipcodeView(APIView):
    def get(self, request, *args, **kwargs):
        # Make sure the 'price' field in EnergyPrices is a numeric type (like DecimalField or FloatField)
        price_data = EnergyPrices.objects.values('zipcode').annotate(average_price=Avg('price'))
        prices_by_zipcode = [{'zipcode': entry['zipcode'], 'average_price': entry['average_price']} for entry in price_data]

        return Response({'prices_by_zipcode': prices_by_zipcode})
        






