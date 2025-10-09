
import logging
from rest_framework import permissions

logger = logging.getLogger("digno.articles.permissions")

class IsWriterOrEditorOrReadOnly(permissions.BasePermission):
    """
    Custom permission: Only writers, editors, or superusers can create/update/delete.
    Subscribers and anonymous users can only read.
    """
    def has_permission(self, request, view):
        logger.debug(f"[DEBUG] User: {getattr(request.user, 'username', None)}, Authenticated: {request.user.is_authenticated}, Superuser: {getattr(request.user, 'is_superuser', None)}, Role: {getattr(request.user, 'role', None)}")
        if request.method in permissions.SAFE_METHODS:
            return True
        user = request.user
        if not user or not user.is_authenticated:
            return False
        # Superusers always allowed
        if getattr(user, 'is_superuser', False):
            return True
        # DELETE is restricted to editors or staff (superusers handled above)
        if request.method == 'DELETE':
            return getattr(user, 'role', None) == 'editor' or getattr(user, 'is_staff', False)
        # Other unsafe methods allowed for writers and editors
        return getattr(user, 'role', None) in ("writer", "editor")
