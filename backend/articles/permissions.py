from rest_framework import permissions

class IsWriterOrEditorOrReadOnly(permissions.BasePermission):
    """
    Custom permission: Only writers, editors, or superusers can create/update/delete.
    Subscribers and anonymous users can only read.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if user.is_superuser:
            return True
        return getattr(user, 'role', None) in ("writer", "editor")
