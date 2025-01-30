"""
URL configuration for slate_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from authentication.views import forgot_password_view, get_students, login_view, AchievementViewSet, reset_password_view, signup_view

router = DefaultRouter()
router.register(r'student/achievements', AchievementViewSet, basename='achievement')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/login/', login_view, name='login'),
    path('api/', include(router.urls)),
    path('auth/signup/', signup_view, name='signup'),
    path('auth/students/', get_students, name='get_students'),
    path('auth/forgot-password/', forgot_password_view, name='forgot_password'),
    path('auth/reset-password/<str:token>/', reset_password_view, name='reset_password'),
]
