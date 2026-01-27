from rest_framework import serializers
from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from .models import OrganizerProfile, AttendeeProfile

User = get_user_model()

class OrganizerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizerProfile
        fields = ['organization_name', 'commercial_record', 'website_url', 'bank_account_iban']

class AttendeeProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendeeProfile
        fields = ['date_of_birth', 'gender']

class CustomUserSerializer(serializers.ModelSerializer):
    organizer_profile = OrganizerProfileSerializer(read_only=True)
    attendee_profile = AttendeeProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone_number', 'role', 'organizer_profile', 'attendee_profile']
        read_only_fields = ['id', 'role']

    def update(self, instance, validated_data):
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.save()
        return instance

    class CustomUserCreateSerializer(BaseUserCreateSerializer):
        class Meta(BaseUserCreateSerializer.Meta):
            model = User
            # We override the fields to ensure role and phone_number are accepted during signup
            fields = ('id', 'email', 'username', 'password', 'first_name', 'last_name', 'role', 'phone_number')