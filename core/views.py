from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from .forms import SignUpForm
from .models import Event
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from .serializers import EventSerializer, UserSerializer

def signup_view(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect_based_on_role(user)
    else:
        form = SignUpForm()
    return render(request, 'core/signup.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect_based_on_role(user)
    else:
        form = AuthenticationForm()
    return render(request, 'core/login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('login')

def redirect_based_on_role(user):
    if user.role == 'ORGANIZER':
        return redirect('organizer_dashboard')
    elif user.role == 'VENDOR':
        return redirect('vendor_dashboard')
    else:
        return redirect('attendee_dashboard')

@login_required
def organizer_dashboard(request):
    if request.user.role != 'ORGANIZER':
        return redirect('login')
    return render(request, 'core/organizer_dashboard.html')

@login_required
def vendor_dashboard(request):
    if request.user.role != 'VENDOR':
        return redirect('login')
    return render(request, 'core/vendor_dashboard.html')


@login_required
def attendee_dashboard(request):
    return render(request, 'core/attendee_dashboard.html')

@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'username': user.username,
            'role': user.role,
            'message': 'Login Successful'
        })
    return Response({'error': 'Invalid Credentials'}, status=400)


# ب. عرض وإضافة الفعاليات (JSON)
class EventListAPI(generics.ListCreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]  # لازم يكون معه توكن عشان يشوف البيانات

    def get_queryset(self):
        user = self.request.user
        # المنظم يشوف فعالياته فقط
        if user.role == 'ORGANIZER':
            return Event.objects.filter(organizer__user=user)
        # الباقين يشوفون الفعاليات النشطة فقط
        return Event.objects.filter(status='Active')

    def perform_create(self, serializer):
        # عند إنشاء فعالية جديدة، اربطها تلقائياً بالمنظم الحالي
        if self.request.user.role == 'ORGANIZER':
            serializer.save(organizer=self.request.user.organizer_profile)
        else:
            # لو حاول شخص غير منظم يسوي فعالية
            raise serializers.ValidationError("Only Organizers can create events.")