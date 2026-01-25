from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import CustomUser
from .serializers import OrganizerProfileSerializer, AttendeeProfileSerializer


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user

    # Check if the user has an organizer profile
    if user.role == 'ORGANIZER' and hasattr(user, 'organizer_profile'):
        serializer = OrganizerProfileSerializer(user.organizer_profile, data=request.data, partial=True)

    # Check if the user has an attendee profile
    elif user.role == 'ATTENDEE' and hasattr(user, 'attendee_profile'):
        serializer = AttendeeProfileSerializer(user.attendee_profile, data=request.data, partial=True)

    else:
        return Response({"error": "No specific profile found for this role"}, status=400)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)