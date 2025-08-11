from django.contrib import admin
from .models import Portfolio

@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'updated_at')
    search_fields = ('user__username', 'user__email')
    list_filter = ('created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
