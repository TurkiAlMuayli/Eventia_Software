from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, OrganizerProfile, VendorProfile, Event, VendorApplication

admin.site.register(User, UserAdmin)

admin.site.register(OrganizerProfile)
admin.site.register(VendorProfile)
admin.site.register(Event)
admin.site.register(VendorApplication)