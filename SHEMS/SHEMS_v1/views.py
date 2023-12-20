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

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Customer  # Import the Customer model

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


