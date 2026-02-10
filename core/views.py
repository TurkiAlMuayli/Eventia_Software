from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import SignUpForm
from .models import Event, OrganizerProfile


# --- HELPER: ROLE BASED REDIRECT ---
def redirect_based_on_role(user):
    if user.role == 'ORGANIZER':
        return redirect('organizer_dashboard')
    elif user.role == 'SCEGA_ADMIN':
        return redirect('scega_dashboard')
    elif user.role == 'VENDOR':
        return redirect('dashboard')  # or vendor_dashboard if you make one
    else:
        return redirect('dashboard')  # Attendees go to standard dashboard


# --- ATTENDEE VIEWS ---

def signup_attendee(request):
    if request.method == 'POST':
        data = request.POST.copy()
        data['role'] = 'ATTENDEE'
        # Date logic...
        day = data.get('day')
        month = data.get('month')
        year = data.get('year')
        if day and month and year:
            data['date_of_birth'] = f"{year}-{month}-{day}"

        form = SignUpForm(data)
        if form.is_valid():
            user = form.save()
            if not request.user.is_authenticated:
                login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = SignUpForm()
    return render(request, 'signup.html', {'form': form})


def login_attendee(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('dashboard')
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})


# --- BUSINESS VIEWS (Organizer, Vendor, SCEGA) ---

def signup_business(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            if not request.user.is_authenticated:
                login(request, user)
            return redirect_based_on_role(user)
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = SignUpForm()
    return render(request, 'signup-business.html', {'form': form})


def login_business(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect_based_on_role(user)
        else:
            messages.error(request, "Invalid credentials.")
    else:
        form = AuthenticationForm()
    return render(request, 'login-business.html', {'form': form})


# --- DASHBOARDS ---

@login_required
def dashboard_view(request):
    """General Dashboard for Attendees"""
    return render(request, 'index.html')


@login_required
def organizer_dashboard(request):
    # Security: Only allow Organizers
    if request.user.role != 'ORGANIZER':
        return redirect('home')

    # Get the profile
    try:
        organizer_profile = request.user.organizer_profile
    except OrganizerProfile.DoesNotExist:
        # Handle edge case where profile is missing
        return redirect('home')

    # Handle Create Event
    if request.method == 'POST':
        title = request.POST.get('title')
        category = request.POST.get('category')
        date = request.POST.get('date')
        time = request.POST.get('time')
        location = request.POST.get('location')
        description = request.POST.get('description')

        # Create Event (Default approval is PENDING)
        Event.objects.create(
            organizer=organizer_profile,
            title=title,
            category=category,
            date=date,
            time=time,
            location=location,
            description=description,
            status='UPCOMING'
        )
        messages.success(request, "Event created! Waiting for SCEGA approval.")
        return redirect('organizer_dashboard')

    # Fetch events for this organizer
    my_events = Event.objects.filter(organizer=organizer_profile).order_by('-date')

    return render(request, 'organizer-dashboard.html', {
        'events': my_events
    })


@login_required
def scega_dashboard(request):
    # Security: Only allow SCEGA Admin
    if request.user.role != 'SCEGA_ADMIN':
        return redirect('home')

    # Handle Approval/Rejection
    if request.method == 'POST':
        event_id = request.POST.get('event_id')
        action = request.POST.get('action')

        event = get_object_or_404(Event, id=event_id)

        if action == 'approve':
            event.approval = 'APPROVED'
            event.status = 'UPCOMING'
        elif action == 'reject':
            event.approval = 'REJECTED'
            event.status = 'CANCELLED'  # Or keep as upcoming but rejected

        event.save()
        return redirect('scega_dashboard')

    # Fetch Lists
    pending_events = Event.objects.filter(approval='PENDING').order_by('date')
    history_events = Event.objects.exclude(approval='PENDING').order_by('-date')

    return render(request, 'scega-dashboard.html', {
        'pending_events': pending_events,
        'history_events': history_events
    })


# Add a simple login_view for your new URL entry if needed
def login_view(request):
    return login_business(request)