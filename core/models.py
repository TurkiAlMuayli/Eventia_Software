from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('ORGANIZER', 'Organizer'),
        ('ATTENDEE', 'Attendee'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='ATTENDEE')
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)

    def __str__(self):
        return self.username

class OrganizerProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='organizer_profile')
    organization_name = models.CharField(max_length=100, blank=True)
    commercial_record = models.CharField(max_length=50, blank=True)
    website_url = models.URLField(max_length=200, blank=True)
    bank_account_iban = models.CharField(max_length=34, blank=True)

    def __str__(self):
        return f"{self.user.username} - Organizer"

class AttendeeProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='attendee_profile')
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, blank=True, choices=(('M', 'Male'), ('F', 'Female')))

    def __str__(self):
        return f"{self.user.username} - Attendee"