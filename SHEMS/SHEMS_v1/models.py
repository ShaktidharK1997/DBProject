from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null = True)
    userid = models.AutoField(primary_key=True)
    firstname = models.CharField(max_length=25)
    lastname = models.CharField(max_length=25, blank=True, null=True)
    baline1 = models.CharField(max_length=45)
    baline2 = models.CharField(max_length=45)
    phonenumber = models.CharField(max_length=10)
    email = models.EmailField(max_length=45, blank=True, null=True)
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)

    
class ServiceLocation(models.Model):
    servicelocationid = models.CharField(max_length=20, primary_key=True)
    addressline1 = models.CharField(max_length=45)
    addressline2 = models.CharField(max_length=45, blank=True, null=True)
    city = models.CharField(max_length=45, blank=True, null=True)
    zipcode = models.IntegerField()
    takeover_date = models.DateField()
    sqft = models.FloatField()
    bedrooms = models.IntegerField()
    occupants = models.IntegerField()
    aptno = models.CharField(max_length=4, blank=True, null=True)

class CustomerServiceLocation(models.Model):
    userid = models.ForeignKey('Customer', on_delete=models.CASCADE)
    servicelocationid = models.ForeignKey('ServiceLocation', on_delete=models.CASCADE)
    active = models.BooleanField(default=True)

    class Meta:
        unique_together = [['userid', 'servicelocationid']]

class DeviceManager(models.Model):
    deviceid = models.CharField(max_length=20, primary_key=True)
    type = models.CharField(max_length=25)
    modelno = models.CharField(max_length=25)

class DataHistory(models.Model):
    deviceid = models.ForeignKey('DeviceManager', on_delete=models.CASCADE)
    timestamp = models.DateTimeField()
    event_label = models.CharField(max_length=45)
    event_value = models.FloatField()

    class Meta:
        unique_together = [['deviceid', 'timestamp']]


class EnergyPrices(models.Model):
    zipcode = models.IntegerField()
    timestamp = models.DateTimeField()
    price = models.CharField(max_length=45)

    class Meta:
        unique_together = [['zipcode', 'timestamp']]

class ServiceLocationDeviceMapping(models.Model):
    servicelocationid = models.ForeignKey('ServiceLocation', on_delete=models.CASCADE)
    deviceid = models.ForeignKey('DeviceManager', on_delete=models.CASCADE)
    active = models.BooleanField()

    class Meta:
        unique_together = [['servicelocationid', 'deviceid']]


