from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # include role so the frontend can filter/use it
        fields = ("id", "first_name", "last_name", "email", "role", "is_staff", "is_superuser", "username")


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)