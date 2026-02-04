from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import messages
from .forms import SignUpForm


# --- ATTENDEE VIEWS ---

def signup_attendee(request):
    """Handles signup for Attendees only (signup.html)"""
    if request.method == 'POST':
        # Create a copy of the POST data to modify it
        data = request.POST.copy()

        # 1. Force the role
        data['role'] = 'ATTENDEE'

        # 2. Combine Day/Month/Year into YYYY-MM-DD
        day = data.get('day')
        month = data.get('month')
        year = data.get('year')

        if day and month and year:
            data['date_of_birth'] = f"{year}-{month}-{day}"

        form = SignUpForm(data)
        if form.is_valid():
            user = form.save()
            # Login only if guest
            if not request.user.is_authenticated:
                login(request, user)
                messages.success(request, f"Welcome, {user.username}!")
            else:
                messages.info(request, f"Attendee {user.username} created.")
            return redirect('dashboard')
        else:
            # Pass the errors back to the template
            messages.error(request, "Please correct the errors below.")
    else:
        form = SignUpForm()

    return render(request, 'signup.html', {'form': form})


def login_attendee(request):
    """Handles login for Attendees (login.html)"""
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, "Invalid credentials.")
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})


# --- BUSINESS VIEWS ---

def signup_business(request):
    """Handles signup for Organizers & Vendors (signup-business.html)"""
    if request.method == 'POST':
        # The 'role' is coming from the hidden input in app.js (ORGANIZER or VENDOR)
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            if not request.user.is_authenticated:
                login(request, user)
                messages.success(request, f"Welcome, {user.username}!")
            else:
                messages.info(request, f"Business account {user.username} created.")
            return redirect('dashboard')
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = SignUpForm()

    return render(request, 'signup-business.html', {'form': form})


def login_business(request):
    """Handles login for Organizers & Vendors (login-business.html)"""
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, "Invalid business credentials.")
    else:
        form = AuthenticationForm()
    return render(request, 'login-business.html', {'form': form})


def dashboard_view(request):
    return render(request, 'index.html')