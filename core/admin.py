from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, OrganizerProfile, AttendeeProfile

# Register your CustomUser so you can see it in the admin panel
admin.site.register(CustomUser, UserAdmin)

# Register the profiles
admin.site.register(OrganizerProfile)
admin.site.register(AttendeeProfile)