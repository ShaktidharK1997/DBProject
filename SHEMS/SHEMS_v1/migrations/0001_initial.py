# Generated by Django 4.2.7 on 2023-12-05 00:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('userid', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('firstname', models.CharField(max_length=25)),
                ('lastname', models.CharField(blank=True, max_length=25, null=True)),
                ('baline1', models.CharField(max_length=45)),
                ('baline2', models.CharField(max_length=45)),
                ('phonenumber', models.CharField(max_length=10)),
                ('email', models.EmailField(blank=True, max_length=45, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='DeviceManager',
            fields=[
                ('deviceid', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('type', models.CharField(max_length=25)),
                ('modelno', models.CharField(max_length=25)),
            ],
        ),
        migrations.CreateModel(
            name='ServiceLocation',
            fields=[
                ('servicelocationid', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('addressline1', models.CharField(max_length=45)),
                ('addressline2', models.CharField(blank=True, max_length=45, null=True)),
                ('city', models.CharField(blank=True, max_length=45, null=True)),
                ('zipcode', models.IntegerField()),
                ('takeover_date', models.DateField()),
                ('sqft', models.FloatField()),
                ('bedrooms', models.IntegerField()),
                ('occupants', models.IntegerField()),
                ('aptno', models.CharField(blank=True, max_length=4, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='EnergyPrices',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('zipcode', models.IntegerField()),
                ('timestamp', models.DateTimeField()),
                ('price', models.CharField(max_length=45)),
            ],
            options={
                'unique_together': {('zipcode', 'timestamp')},
            },
        ),
        migrations.CreateModel(
            name='ServiceLocationDeviceMapping',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField()),
                ('deviceid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='SHEMS_v1.devicemanager')),
                ('servicelocationid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='SHEMS_v1.servicelocation')),
            ],
            options={
                'unique_together': {('servicelocationid', 'deviceid')},
            },
        ),
        migrations.CreateModel(
            name='DataHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField()),
                ('event_label', models.CharField(max_length=45)),
                ('event_value', models.FloatField()),
                ('deviceid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='SHEMS_v1.devicemanager')),
            ],
            options={
                'unique_together': {('deviceid', 'timestamp')},
            },
        ),
        migrations.CreateModel(
            name='CustomerServiceLocation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True)),
                ('servicelocationid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='SHEMS_v1.servicelocation')),
                ('userid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='SHEMS_v1.customer')),
            ],
            options={
                'unique_together': {('userid', 'servicelocationid')},
            },
        ),
    ]
