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

    def _is_editor_or_superuser(self, user):
        # Check both role and group membership
        return (
            user.is_superuser or
            getattr(user, 'role', None) == 'editor' or
            user.groups.filter(name='editor').exists()
        )

    def has_module_permission(self, request):
        return self._is_editor_or_superuser(request.user)

    def has_view_permission(self, request, obj=None):
        return self._is_editor_or_superuser(request.user)

    def has_change_permission(self, request, obj=None):
        return self._is_editor_or_superuser(request.user)

    def has_add_permission(self, request):
        return self._is_editor_or_superuser(request.user)

    def has_delete_permission(self, request, obj=None):
        return self._is_editor_or_superuser(request.user)
