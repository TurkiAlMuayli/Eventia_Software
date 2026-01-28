from django import forms
from django.core.validators import RegexValidator
from django.contrib.auth.hashers import make_password
from .models import Organizer, Vendor, Attendee, Guest

# Strict email validator
strict_email_validator = RegexValidator(
    regex=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$',
    message="Enter a valid email address"
)


# -----------------------------
# Organizer Signup Form
# -----------------------------
class OrganizerSignUpForm(forms.ModelForm):
    password1 = forms.CharField(widget=forms.PasswordInput, label="Password")
    password2 = forms.CharField(widget=forms.PasswordInput, label="Confirm Password")
    email = forms.EmailField(validators=[strict_email_validator])

    class Meta:
        model = Organizer
        fields = ['name', 'email', 'password1', 'password2', 'phone_number', 'profile_picture']

    def clean_password2(self):
        pw1 = self.cleaned_data.get('password1')
        pw2 = self.cleaned_data.get('password2')
        if pw1 != pw2:
            raise forms.ValidationError("Passwords do not match")
        return pw2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.password = make_password(self.cleaned_data['password1'])
        if commit:
            user.save()
        return user


# -----------------------------
# Vendor Signup Form
# -----------------------------
class VendorSignUpForm(forms.ModelForm):
    password1 = forms.CharField(widget=forms.PasswordInput, label="Password")
    password2 = forms.CharField(widget=forms.PasswordInput, label="Confirm Password")
    email = forms.EmailField(validators=[strict_email_validator])

    class Meta:
        model = Vendor
        fields = ['name', 'email', 'password1', 'password2', 'phone_number', 'service_type', 'profile_picture',
                  'description']

    def clean_password2(self):
        pw1 = self.cleaned_data.get('password1')
        pw2 = self.cleaned_data.get('password2')
        if pw1 != pw2:
            raise forms.ValidationError("Passwords do not match")
        return pw2

    def save(self, commit=True):
        vendor = super().save(commit=False)
        vendor.password = make_password(self.cleaned_data['password1'])
        if commit:
            vendor.save()
        return vendor


# -----------------------------
# Attendee Signup Form
# -----------------------------
class AttendeeSignUpForm(forms.ModelForm):
    password1 = forms.CharField(widget=forms.PasswordInput, label="Password")
    password2 = forms.CharField(widget=forms.PasswordInput, label="Confirm Password")
    email = forms.EmailField(validators=[strict_email_validator])

    class Meta:
        model = Attendee
        fields = ['username', 'name', 'email', 'phone_number', 'password1', 'password2', 'gender', 'birthdate',
                  'preferences', 'profile_picture']

    def clean_password2(self):
        pw1 = self.cleaned_data.get('password1')
        pw2 = self.cleaned_data.get('password2')
        if pw1 != pw2:
            raise forms.ValidationError("Passwords do not match")
        return pw2

    def save(self, commit=True):
        attendee = super().save(commit=False)
        attendee.password = make_password(self.cleaned_data['password1'])
        if commit:
            attendee.save()
        return attendee


# -----------------------------
# Guest Form
# -----------------------------
class GuestForm(forms.ModelForm):
    email = forms.EmailField(required=False, validators=[strict_email_validator])

    class Meta:
        model = Guest
        fields = ['email', 'phone_number']
