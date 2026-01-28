from django import forms
from django.contrib.auth import get_user_model
from .models import OrganizerProfile, VendorProfile, AttendeeProfile

User = get_user_model()


class SignUpForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    confirm_password = forms.CharField(widget=forms.PasswordInput)
    role = forms.ChoiceField(choices=User.ROLE_CHOICES)

    # Extra fields for profiles
    organization_name = forms.CharField(required=False)
    service_type = forms.CharField(required=False)
    date_of_birth = forms.DateField(required=False, widget=forms.DateInput(attrs={'type': 'date'}))

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'phone_number', 'role']

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
                    service_type=self.cleaned_data.get('service_type')
                )
            elif role == 'ATTENDEE':
                AttendeeProfile.objects.create(
                    user=user,
                    date_of_birth=self.cleaned_data.get('date_of_birth')
                )
        return user