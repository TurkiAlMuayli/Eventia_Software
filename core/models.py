from django.db import models

# --------------------------
# Organizer
# --------------------------
class Organizer(models.Model):
    organizer_id = models.AutoField(primary_key=True)
    #username = models.CharField(max_length=150, unique=True)
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=128)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    profile_picture = models.ImageField(upload_to='organizers/', blank=True, null=True)

    def __str__(self):
        return f"{self.name} - Organizer"


# --------------------------
# Vendor
# --------------------------
class Vendor(models.Model):
    vendor_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=150, unique=True)
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=128)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    service_type = models.CharField(max_length=100)
    profile_picture = models.ImageField(upload_to='vendors/', blank=True, null=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} - Vendor"


# --------------------------
# Attendee
# --------------------------
class Attendee(models.Model):
    attendee_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    gender = models.CharField(max_length=10, choices=(('M', 'Male'), ('F', 'Female')), blank=True)
    birthdate = models.DateField(null=True, blank=True)
    preferences = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='attendees/', blank=True, null=True)

    def __str__(self):
        return f"{self.name} - Attendee"


# --------------------------
# Guest
# --------------------------
class Guest(models.Model):
    guest_id = models.AutoField(primary_key=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    session_duration = models.DurationField(null=True, blank=True)

    def __str__(self):
        return f"Guest {self.guest_id}"


# --------------------------
# Event
# --------------------------
class Event(models.Model):
    STATUS_CHOICES = (('UPCOMING', 'Upcoming'), ('COMPLETED', 'Completed'), ('CANCELLED', 'Cancelled'))
    APPROVAL_CHOICES = (('APPROVED', 'Approved'), ('PENDING', 'Pending'), ('REJECTED', 'Rejected'))

    event_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='UPCOMING')
    category = models.CharField(max_length=100)
    capacity = models.PositiveIntegerField()
    age_restriction = models.PositiveIntegerField(null=True, blank=True)
    date = models.DateField()
    time = models.TimeField()
    approval = models.CharField(max_length=20, choices=APPROVAL_CHOICES, default='PENDING')
    location = models.CharField(max_length=200)
    ticket_price = models.DecimalField(max_digits=10, decimal_places=2)
    banner = models.ImageField(upload_to='events/', blank=True, null=True)

    def __str__(self):
        return f"{self.title} ({self.status})"


# --------------------------
# Report
# --------------------------
class Report(models.Model):
    report_id = models.AutoField(primary_key=True)
    attendee_count = models.PositiveIntegerField()
    generated_date = models.DateField()
    vendor_count = models.PositiveIntegerField()
    total_tickets_sold = models.PositiveIntegerField()
    revenue = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"Report {self.report_id} - {self.generated_date}"


# --------------------------
# Feedback
# --------------------------
class Feedback(models.Model):
    submission_date = models.DateField(auto_now_add=True)
    comment = models.TextField()
    rating = models.PositiveSmallIntegerField()  # e.g., 1-5 stars

    # Optional: link feedback to attendee and event
    attendee = models.ForeignKey(Attendee, on_delete=models.SET_NULL, null=True, blank=True, related_name='feedbacks')
    event = models.ForeignKey(Event, on_delete=models.SET_NULL, null=True, blank=True, related_name='feedbacks')

    def __str__(self):
        return f"Feedback by {self.attendee} on {self.event} - {self.rating}"
