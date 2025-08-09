from django.urls import path
from .auth import login, register, logout, google_auth, forget_password, profile

urlpatterns = [
    # Authentication endpoints
    path('login/', login.login_view, name='login'),
    path('register/', register.register_view, name='register'),
    path('logout/', logout.logout_view, name='logout'),
    path('verify-email/', register.verify_email, name='verify_email'),
    
    # Password reset endpoints
    path('password-reset/request/', forget_password.password_reset_request, name='password_reset_request'),
    path('password-reset/confirm/', forget_password.password_reset_confirm, name='password_reset_confirm'),
    path('password-reset/validate/', forget_password.password_reset_validate, name='password_reset_validate'),
    
    # Google OAuth endpoints
    path('google/login-url/', google_auth.google_login_url, name='google_login_url'),
    path('google/auth/', google_auth.google_auth, name='google_auth'),
    path('google/callback/', google_auth.google_callback, name='google_callback'),
    
    # Profile management endpoints
    path('profile/', profile.get_profile, name='get_profile'),
    path('profile/update/', profile.update_profile, name='update_profile'),
    path('profile/change-password/', profile.change_password, name='change_password'),
    path('profile/verify-email-change/', profile.verify_email_change, name='verify_email_change'),
]
