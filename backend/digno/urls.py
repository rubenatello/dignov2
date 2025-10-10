"""
URL configuration for digno project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .health import healthz

# Customize admin site
admin.site.site_header = "Digno Writer Dashboard"
admin.site.site_title = "Digno"
admin.site.index_title = "Welcome to your writing dashboard"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('healthz', healthz),
    path('api/', include('articles.urls')),
    path('api/', include('donations.urls')),
    path('api/', include('users.urls')),
    path('ckeditor/', include('ckeditor_uploader.urls')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
