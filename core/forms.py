from django import forms
from django.contrib.auth import get_user_model
from .models import OrganizerProfile, VendorProfile, AttendeeProfile

User = get_user_model()


class SignUpForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    confirm_password = forms.CharField(widget=forms.PasswordInput)
    role = forms.ChoiceField(choices=User.ROLE_CHOICES)

    # --- NEW FIELDS ---
    first_name = forms.CharField(required=False)
    last_name = forms.CharField(required=False)
    gender = forms.ChoiceField(choices=[('M', 'Male'), ('F', 'Female')], required=False)

    # Extra fields for profiles
    organization_name = forms.CharField(required=False)
    service_type = forms.CharField(required=False)
    date_of_birth = forms.DateField(required=False, widget=forms.DateInput(attrs={'type': 'date'}))

    class Meta:
        model = User
        # Added first_name and last_name to the list
        fields = ['username', 'email', 'password', 'phone_number', 'role', 'first_name', 'last_name']

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")
        role = cleaned_data.get("role")

        if password != confirm_password:
            raise forms.ValidationError("Passwords do not match")

        # Role validation
        if role == 'ORGANIZER' and not cleaned_data.get('organization_name'):
            self.add_error('organization_name', 'Organization Name is required for Organizers.')

        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])

        # Explicitly save the names to the User model
        user.first_name = self.cleaned_data.get("first_name", "")
        user.last_name = self.cleaned_data.get("last_name", "")

        if commit:
            user.save()
            role = self.cleaned_data.get('role')

            # Create specific profile
            if role == 'ORGANIZER':
                OrganizerProfile.objects.create(
                    user=user,
                    organization_name=self.cleaned_data.get('organization_name')
                )
            elif role == 'VENDOR':
                VendorProfile.objects.create(
                    user=user,
                    service_type=self.cleaned_data.get('service_type'),
                    organization_name=self.cleaned_data.get('organization_name')  # Ensure vendors get org name too
                )
            elif role == 'ATTENDEE':
                AttendeeProfile.objects.create(
                    user=user,
                    date_of_birth=self.cleaned_data.get('date_of_birth'),
                    gender=self.cleaned_data.get('gender')  # Saving gender to profile
                )
        return user