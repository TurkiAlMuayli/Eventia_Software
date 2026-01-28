from rest_framework import serializers
from .models import Organizer, Vendor, Attendee, Guest, Event, Feedback
from django.contrib.auth.hashers import make_password

# -----------------------------
# Organizer Serializer
# -----------------------------
class OrganizerSerializer(serializers.ModelSerializer):
    role = serializers.CharField(default='ORGANIZER', read_only=True)

    class Meta:
        model = Organizer
        fields = ['organizer_id', 'name', 'password', 'email', 'phone_number', 'profile_picture', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


# -----------------------------
# Vendor Serializer
# -----------------------------
class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = [
            'vendor_id', 'username', 'name', 'password', 'email', 'phone_number',
            'service_type', 'profile_picture', 'description'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


# -----------------------------
# Attendee Serializer
# -----------------------------
class AttendeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendee
        fields = [
            'attendee_id', 'username', 'name', 'password', 'email', 'phone_number',
            'gender', 'birthdate', 'preferences', 'profile_picture'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


# -----------------------------
# Guest Serializer
# -----------------------------
class GuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = ['guest_id', 'phone_number', 'email', 'session_duration']


# -----------------------------
# Event Serializer
# -----------------------------
class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'


# -----------------------------
# Feedback Serializer
# -----------------------------
class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['submission_date', 'comment', 'rating', 'attendee', 'event']

