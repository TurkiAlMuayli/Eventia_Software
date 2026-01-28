from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import OrganizerSignUpForm, VendorSignUpForm, AttendeeSignUpForm


# --------------------------
# HTML-Based Signup View
# --------------------------
def signup_view(request):
    if request.method == 'POST':
        # 1. Determine Role
        role = request.POST.get('role', 'attendee').lower()

        # 2. Select the correct form based on role
        if role == 'organizer':
            form = OrganizerSignUpForm(request.POST, request.FILES)
        elif role == 'vendor':
            form = VendorSignUpForm(request.POST, request.FILES)
        else:
            form = AttendeeSignUpForm(request.POST, request.FILES)

        # 3. Validate and Save
        if form.is_valid():
            form.save()
            messages.success(request, "Account created successfully! Please log in.")
            return redirect('login')  # Ensure you have a URL named 'login'
        else:
            # If invalid, reload page with errors
            messages.error(request, "Error creating account. Please check the form.")
            return render(request, 'signup.html', {'form': form, 'current_role': role})

    # GET Request (Show the page)
    return render(request, 'signup.html')


# --------------------------
# HTML-Based Login View (Simple Placeholder)
# --------------------------
def login_view(request):
    # You can expand this later using Django's AuthenticationForm if needed
    return render(request, 'login.html')