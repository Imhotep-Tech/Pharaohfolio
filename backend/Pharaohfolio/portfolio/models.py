from django.db import models
from accounts.models import User

# Create your models here.
class Portfolio(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='portfolios')
    user_code = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Portfolio of {self.user.username} ({self.created_at.strftime('%Y-%m-%d')})"
    
    class Meta:
        verbose_name = "Portfolio"
        verbose_name_plural = "Portfolios"
        ordering = ['-created_at']
