from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Custom user model extending Django's AbstractUser.
    Adds fields for donation tracking and profile information.
    """
    bio = models.TextField(max_length=500, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    ROLE_CHOICES = [
        ("subscriber", "Subscriber"),
        ("writer", "Writer"),
        ("editor", "Editor"),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="subscriber", help_text="User role: subscriber, writer, or editor")
    total_donated = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.username
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username
