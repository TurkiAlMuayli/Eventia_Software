from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
    # BackEnd & APIs Side
    path('admin/', admin.site.urls),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),

    # FrontEnd Side
    # index.html - home page
    path('', TemplateView.as_view(template_name='index.html'), name='home'),

    # login.html - /login/
    path('login/', TemplateView.as_view(template_name='login.html'), name='login'),

    # signup.html - /signup/
    path('signup/', TemplateView.as_view(template_name='signup.html'), name='signup'),
]