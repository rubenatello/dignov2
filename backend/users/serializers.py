from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # include role so the frontend can filter/use it
        fields = ("id", "first_name", "last_name", "email", "role", "is_staff", "is_superuser", "username")


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("username", "email", "first_name", "last_name", "password", "password_confirm")

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password_confirm'):
            raise serializers.ValidationError({ 'password_confirm': 'Passwords do not match' })
        # Validate password with Django validators
        validate_password(attrs['password'])
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data.pop('password_confirm', None)
        user = User(**validated_data)
        # Ensure subscriber role by default
        if hasattr(user, 'role'):
            user.role = 'subscriber'
        user.set_password(password)
        user.save()
        return user