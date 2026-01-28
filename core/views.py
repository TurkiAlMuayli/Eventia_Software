from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password
from .models import Organizer, Vendor, Attendee
from .serializers import OrganizerSerializer, VendorSerializer, AttendeeSerializer

# --------------------------
# Role-based signup
# --------------------------
@api_view(['POST'])
def signup(request):
    role = request.data.get('role')
    serializer = None

    if role == 'ORGANIZER':
        serializer = OrganizerSerializer(data=request.data)
    elif role == 'VENDOR':
        serializer = VendorSerializer(data=request.data)
    elif role == 'ATTENDEE':
        serializer = AttendeeSerializer(data=request.data)
    else:
        return Response({"error": "Invalid role"}, status=400)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


# --------------------------
# Role-based login (email + password)
# --------------------------
@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = None
    role = None

    # Try Organizer
    try:
        user = Organizer.objects.get(email=email)
        role = 'ORGANIZER'
    except Organizer.DoesNotExist:
        pass

    # Try Vendor
    if not user:
        try:
            user = Vendor.objects.get(email=email)
            role = 'VENDOR'
        except Vendor.DoesNotExist:
            pass

    # Try Attendee
    if not user:
        try:
            user = Attendee.objects.get(email=email)
            role = 'ATTENDEE'
        except Attendee.DoesNotExist:
            return Response({"error": "Invalid email or password"}, status=400)

    # Verify password
    if not check_password(password, user.password):
        return Response({"error": "Invalid email or password"}, status=400)

    return Response({
        "message": "Login successful",
        "role": role,
        "email": user.email,
        "id": getattr(user, f"{role.lower()}_id")
    })


# --------------------------
# Profile update (GET / PATCH)
# --------------------------
@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    # Determine the user instance based on email
    email = request.data.get('email', None) or getattr(request.user, 'email', None)
    if not email:
        return Response({"error": "Email not provided"}, status=400)

    instance = None
    serializer_class = None

    # Check Organizer
    try:
        instance = Organizer.objects.get(email=email)
        serializer_class = OrganizerSerializer
    except Organizer.DoesNotExist:
        pass

    # Check Vendor
    if not instance:
        try:
            instance = Vendor.objects.get(email=email)
            serializer_class = VendorSerializer
        except Vendor.DoesNotExist:
            pass

    # Check Attendee
    if not instance:
        try:
            instance = Attendee.objects.get(email=email)
            serializer_class = AttendeeSerializer
        except Attendee.DoesNotExist:
            return Response({"error": "Profile not found"}, status=404)

    # Handle GET
    if request.method == 'GET':
        serializer = serializer_class(instance)
        return Response(serializer.data)

    # Handle PATCH
    elif request.method == 'PATCH':
        serializer = serializer_class(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    return Response(status=405)

