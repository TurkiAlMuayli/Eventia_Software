from rest_framework import serializers
from .models import Event, User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'phone_number']

class EventSerializer(serializers.ModelSerializer):
    organizer_name = serializers.CharField(source='organizer.organization_name', read_only=True)

    class Meta:
        model = Event
        fields = ['id', 'title', 'date', 'location', 'status', 'organizer_name']