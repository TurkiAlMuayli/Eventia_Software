from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, OrganizerProfile, VendorProfile, AttendeeProfile, Event

# 1. Custom User Admin (The Hub)
class CustomUserAdmin(UserAdmin):
    # Added phone_number and role to the list view
    list_display = ('username', 'email', 'role', 'phone_number', 'is_staff')

    # This allows you to edit these fields in the admin form
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role', 'phone_number')}),
    )

# 2. Organizer Admin
class OrganizerProfileAdmin(admin.ModelAdmin):
    list_display = ('organization_name', 'get_username', 'get_email', 'get_phone')
    search_fields = ('organization_name', 'user__username')

    # Helper functions to fetch data from the User table
    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = 'Username'

    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = 'Email'

    def get_phone(self, obj):
        return obj.user.phone_number
    get_phone.short_description = 'Phone Number'

# 3. Vendor Admin
class VendorProfileAdmin(admin.ModelAdmin):
    list_display = ('organization_name', 'service_type', 'get_username', 'get_email', 'get_phone')
    list_filter = ('service_type',) # Adds a sidebar filter
    search_fields = ('organization_name', 'user__username')

    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = 'Username'

    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = 'Email'

    def get_phone(self, obj):
        return obj.user.phone_number
    get_phone.short_description = 'Phone Number'

# 4. Attendee Admin
class AttendeeProfileAdmin(admin.ModelAdmin):
    list_display = ('get_username', 'gender', 'date_of_birth', 'get_email', 'get_phone')
    list_filter = ('gender',)

    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = 'Username'

    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = 'Email'

    def get_phone(self, obj):
        return obj.user.phone_number
    get_phone.short_description = 'Phone Number'

# 5. Event Admin (The Big One)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'organizer', 'status', 'category', 'capacity', 'date', 'time', 'approval', 'ticket_price')
    list_filter = ('status', 'approval', 'category', 'date') # Sidebar filters
    search_fields = ('title', 'category')
    list_editable = ('status', 'approval') # Lets you change status directly from the list!

# --- Registration ---
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(OrganizerProfile, OrganizerProfileAdmin)
admin.site.register(VendorProfile, VendorProfileAdmin)
admin.site.register(AttendeeProfile, AttendeeProfileAdmin)
admin.site.register(Event, EventAdmin)