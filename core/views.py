from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import OrganizerProfileSerializer, AttendeeProfileSerializer


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user

    instance = None
    SerializerClass = None

    if user.role == 'ORGANIZER' and hasattr(user, 'organizer_profile'):
        instance = user.organizer_profile
        SerializerClass = OrganizerProfileSerializer
    elif user.role == 'ATTENDEE' and hasattr(user, 'attendee_profile'):
        instance = user.attendee_profile
        SerializerClass = AttendeeProfileSerializer
    else:
        return Response({"error": "No specific profile found for this role"}, status=400)

    if request.method == 'GET':
        serializer = SerializerClass(instance)
        return Response(serializer.data)

    elif request.method == 'PATCH':
        serializer = SerializerClass(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    return Response(status=405)