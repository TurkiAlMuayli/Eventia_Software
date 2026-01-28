class SignUpForm(forms.ModelForm):
    # ... existing fields ...
    role = forms.ChoiceField(choices=User.ROLE_CHOICES)

    # Extra fields
    organization_name = forms.CharField(required=False)
    service_type = forms.CharField(required=False)
    date_of_birth = forms.DateField(required=False, widget=forms.DateInput(attrs={'type': 'date'}))

    # ADD THIS LINE:
    gender = forms.ChoiceField(choices=[('M', 'Male'), ('F', 'Female')], required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'phone_number', 'role']

    # ... clean method stays the same ...

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
            role = self.cleaned_data.get('role')

            if role == 'ORGANIZER':
                OrganizerProfile.objects.create(
                    user=user,
                    organization_name=self.cleaned_data.get('organization_name')
                )
            elif role == 'VENDOR':
                VendorProfile.objects.create(
                    user=user,
                    service_type=self.cleaned_data.get('service_type'),
                    organization_name=self.cleaned_data.get('organization_name')
                )
            elif role == 'ATTENDEE':
                AttendeeProfile.objects.create(
                    user=user,
                    date_of_birth=self.cleaned_data.get('date_of_birth'),
                    # ADD THIS LINE TO SAVE IT:
                    gender=self.cleaned_data.get('gender')
                )
        return user