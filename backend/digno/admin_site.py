"""
Configure Django admin site properties
"""
from django.contrib import admin
from django.contrib.admin.apps import AdminConfig

class DignoAdminConfig(AdminConfig):
    default_site = 'digno.admin_site.DignoAdminSite'


# Customize the default admin site
admin.site.site_header = "Digno Writer Dashboard"
admin.site.site_title = "Digno"
admin.site.index_title = "Welcome to your writing dashboard"