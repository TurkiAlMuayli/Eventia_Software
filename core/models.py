from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    class Roles(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        ORGANIZER = "ORGANIZER", "Organizer"
        VENDOR = "VENDOR", "Vendor"
        ATTENDEE = "ATTENDEE", "Attendee"

    role = models.CharField(max_length=50, choices=Roles.choices, default=Roles.ATTENDEE)
    phone_number = models.CharField(max_length=15, blank=True, null=True)


class OrganizerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='organizer_profile')
    organization_name = models.CharField(max_length=100)
    license_number = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.organization_name


class VendorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='vendor_profile')
    business_name = models.CharField(max_length=100)
    business_type = models.CharField(max_length=100)

    def __str__(self):
        return self.business_name


class Event(models.Model):
    class Status(models.TextChoices):
        DRAFT = "Draft", "Draft"
        PLANNING = "Planning", "Planning"
        ACTIVE = "Active", "Active"
        COMPLETED = "Completed", "Completed"

    organizer = models.ForeignKey(OrganizerProfile, on_delete=models.CASCADE, related_name='events')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    date = models.DateTimeField()
    location = models.CharField(max_length=200)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class VendorApplication(models.Model):
    class AppStatus(models.TextChoices):
        PENDING = "Processing", "Processing"
        APPROVED = "Approved", "Approved"
        REJECTED = "Rejected", "Rejected"

    vendor = models.ForeignKey(VendorProfile, on_delete=models.CASCADE, related_name='applications')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='vendor_applications')
    booth_location = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=AppStatus.choices, default=AppStatus.PENDING)
    submission_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.vendor.business_name} - {self.event.title}"