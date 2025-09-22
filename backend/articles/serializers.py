from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Article

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name', 'bio', 'is_staff']

class ArticleListSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    tags_list = serializers.ReadOnlyField()
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'summary', 'author', 'featured_image',
            'published_date', 'view_count', 'tags_list', 'meta_description'
        ]

class ArticleDetailSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    tags_list = serializers.ReadOnlyField()
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'content', 'summary', 'author', 'featured_image',
            'published_date', 'created_date', 'updated_date', 'view_count', 'tags_list', 'meta_description'
        ]

class ArticleCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = [
            'title', 'content', 'summary', 'featured_image', 'is_published', 'tags', 'meta_description'
        ]
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)