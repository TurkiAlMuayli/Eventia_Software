from django.urls import path
from . import views

urlpatterns = [
    # 1. Add this Empty Path for the Homepage
    path('', views.dashboard_view, name='home'),

    # Dashboard
    path('dashboard/', views.dashboard_view, name='dashboard'),

    # Attendee Routes
    path('signup/', views.signup_attendee, name='signup_attendee'),
    path('login/', views.login_attendee, name='login_attendee'),

    # Business Routes
    path('signup/business/', views.signup_business, name='signup_business'),
    path('login/business/', views.login_business, name='login_business'),
]