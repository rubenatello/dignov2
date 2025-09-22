from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from decimal import Decimal

class Donation(models.Model):
    """
    Model for tracking user donations and subscriptions.
    """
    DONATION_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    # User information (can be null for anonymous donations)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='donations'
    )
    
    # Contact information for anonymous donations
    email = models.EmailField()
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    
    # Donation details
    amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('1.00'))]
    )
    is_recurring = models.BooleanField(default=False)
    
    # Payment processing
    stripe_customer_id = models.CharField(max_length=100, blank=True)
    stripe_subscription_id = models.CharField(max_length=100, blank=True)
    stripe_payment_intent_id = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=DONATION_STATUS_CHOICES, default='pending')
    
    # Timestamps
    created_date = models.DateTimeField(auto_now_add=True)
    completed_date = models.DateTimeField(blank=True, null=True)
    
    # Optional message from donor
    message = models.TextField(max_length=500, blank=True)
    
    class Meta:
        ordering = ['-created_date']
        indexes = [
            models.Index(fields=['user', '-created_date']),
            models.Index(fields=['status', '-created_date']),
            models.Index(fields=['is_recurring', '-created_date']),
        ]
    
    def __str__(self):
        donor_name = self.get_donor_name()
        recurring_text = " (Recurring)" if self.is_recurring else ""
        return f"${self.amount} from {donor_name}{recurring_text}"
    
    def get_donor_name(self):
        if self.user:
            return self.user.get_full_name() or self.user.username
        return f"{self.first_name} {self.last_name}".strip() or self.email
    
    @property
    def is_anonymous(self):
        return self.user is None
