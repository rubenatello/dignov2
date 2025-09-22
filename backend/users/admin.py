from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'total_donated', 'created_date')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'created_date')
    search_fields = ('username', 'first_name', 'last_name', 'email')
    ordering = ('-created_date',)
    filter_horizontal = ('groups', 'user_permissions')
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Profile Information', {
            'fields': ('bio', 'profile_picture', 'total_donated')
        }),
    )
    
    readonly_fields = ('created_date', 'total_donated')
