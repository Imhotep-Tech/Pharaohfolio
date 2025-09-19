from django.db import models
from accounts.models import User

# Create your models here.
class Portfolio(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='portfolios')
    user_code = models.TextField()
    sanitization_log = models.JSONField(default=list, blank=True, help_text="Log of what was removed during sanitization")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Portfolio of {self.user.username} ({self.created_at.strftime('%Y-%m-%d')})"
    
    def add_sanitization_log(self, action, details):
        """Add entry to sanitization log"""
        if not self.sanitization_log:
            self.sanitization_log = []
        self.sanitization_log.append({
            'action': action,
            'details': details,
            'timestamp': self.updated_at.isoformat()
        })
        self.save(update_fields=['sanitization_log'])
    
    def get_sanitization_summary(self):
        """Get a user-friendly summary of what was removed"""
        if not self.sanitization_log:
            return "No changes made to your code."
        
        summary = []
        for entry in self.sanitization_log:
            if entry['action'] == 'removed_dangerous_attributes':
                summary.append(f"Removed {len(entry['details'])} potentially dangerous attributes")
            elif entry['action'] == 'removed_images':
                summary.append(f"Removed {len(entry['details'])} images from non-allowed sources")
            elif entry['action'] == 'removed_scripts':
                summary.append(f"Removed {len(entry['details'])} script elements")
            elif entry['action'] == 'removed_navigation':
                summary.append(f"Removed {len(entry['details'])} navigation elements")
        
        return "; ".join(summary) if summary else "Code was cleaned for security."
    
    class Meta:
        verbose_name = "Portfolio"
        verbose_name_plural = "Portfolios"
        ordering = ['-created_at']
