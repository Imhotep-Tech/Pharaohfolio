from django.urls import path
from . import views

urlpatterns = [
    path('my/get/', views.get_code, name='get_code'),
    path('save/', views.code_operation, name='code_operation'),
    path('csp-report/', views.csp_report, name='csp_report'),
    path('u/<str:username>/', views.public_portfolio, name='public_portfolio'),  # Public portfolio endpoint
]

