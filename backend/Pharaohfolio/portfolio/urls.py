from django.urls import path
from . import views

urlpatterns = [
    path('my/get/', views.get_code, name='get_code'),      # GET
    path('save/', views.code_operation, name='code_operation'),  # POST (create or update)
]

