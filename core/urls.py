from django.urls import path, include
from . import views

urlpatterns = [
    # 1. Authentication API (Login, Signup, Reset Password) - Handled by Djoser
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),

    # 2. Your Custom Profile API
    path('profile/update/', views.update_profile, name='update-profile'),
]