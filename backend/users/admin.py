from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_staff', 'total_donated', 'created_date')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active', 'created_date')
    search_fields = ('username', 'first_name', 'last_name', 'email')
    ordering = ('-created_date',)
    filter_horizontal = ('groups', 'user_permissions')

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Profile Information', {
            'fields': ('bio', 'profile_picture', 'role', 'total_donated')
        }),
    )

    readonly_fields = ('created_date', 'total_donated')

    def has_module_permission(self, request):
        # Only editors (superusers) can see the user admin
        return request.user.is_superuser or getattr(request.user, 'role', None) == 'editor'

    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser or getattr(request.user, 'role', None) == 'editor'

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser or getattr(request.user, 'role', None) == 'editor'

    def has_add_permission(self, request):
        return request.user.is_superuser or getattr(request.user, 'role', None) == 'editor'

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser or getattr(request.user, 'role', None) == 'editor'
