from django.contrib import admin
from django.utils.html import format_html
from .models import Donation

@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ('get_donor_name', 'amount', 'is_recurring', 'status', 'created_date')
    list_filter = ('status', 'is_recurring', 'created_date')
    search_fields = ('email', 'first_name', 'last_name', 'user__username', 'user__email')
    ordering = ('-created_date',)
    date_hierarchy = 'created_date'
    
    fieldsets = (
        ('Donor Information', {
            'fields': ('user', 'email', 'first_name', 'last_name')
        }),
        ('Donation Details', {
            'fields': ('amount', 'is_recurring', 'message')
        }),
        ('Payment Information', {
            'fields': ('stripe_customer_id', 'stripe_subscription_id', 'stripe_payment_intent_id', 'status')
        }),
        ('Timestamps', {
            'fields': ('created_date', 'completed_date'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_date', 'stripe_customer_id', 'stripe_subscription_id', 'stripe_payment_intent_id')
    
    def get_donor_name(self, obj):
        return obj.get_donor_name()
    get_donor_name.short_description = 'Donor'
    get_donor_name.admin_order_field = 'user__username'
