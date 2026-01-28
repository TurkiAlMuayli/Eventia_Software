from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('ORGANIZER', 'Organizer'),
        ('VENDOR', 'Vendor'),
        ('ATTENDEE', 'Attendee'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='ATTENDEE')
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return self.username


# --- PROFILES ---
class OrganizerProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='organizer_profile')
    organization_name = models.CharField(max_length=100)

    def __str__(self):
        return self.organization_name


class VendorProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='vendor_profile')
    service_type = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.user.username


class AttendeeProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='attendee_profile')
    date_of_birth = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.user.username