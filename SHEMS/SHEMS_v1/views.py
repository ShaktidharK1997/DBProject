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

class ServiceLocationViewSet(viewsets.ModelViewSet):
    queryset = ServiceLocation.objects.all()
    serializer_class = ServiceLocationSerializer

class CustomerServiceLocationViewSet(viewsets.ModelViewSet):
    queryset = CustomerServiceLocation.objects.all()
    serializer_class = CustomerServiceLocationSerializer

class DeviceManagerViewSet(viewsets.ModelViewSet):
    queryset = DeviceManager.objects.all()
    serializer_class = DeviceManagerSerializer

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
            return Response({"token": token.key}, status=status.HTTP_200_OK)
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
        profile_photo = request.data.get("profile_photo")
    
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
        
        customer.save()
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })


