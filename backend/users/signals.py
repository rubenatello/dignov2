from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth.models import Group


@receiver(post_migrate)
def create_default_groups(sender, **kwargs):
    """Create default user groups after migrations are complete."""
    if sender.name == 'users':
        for role in ["subscriber", "writer", "editor"]:
            Group.objects.get_or_create(name=role)