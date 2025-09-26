from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Article, Image

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name', 'bio', 'is_staff']

class ImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    formatted_caption = serializers.ReadOnlyField()
    file_size_mb = serializers.SerializerMethodField()
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    def get_file_size_mb(self, obj):
        if obj.file_size:
            return round(obj.file_size / 1024 / 1024, 2)
        return None
    
    class Meta:
        model = Image
        fields = [
            'id', 'title', 'description', 'alt_text', 'source', 'source_url',
            'image_url', 'width', 'height', 'file_size_mb', 'formatted_caption',
            'usage_count', 'created_date'
        ]

class ArticleListSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    tags_list = serializers.ReadOnlyField()
    featured_image_data = serializers.SerializerMethodField()
    
    def get_author(self, obj):
        if obj.author:
            return obj.author.get_full_name() or obj.author.username
        return "Unknown Author"
    
    def get_featured_image_data(self, obj):
        featured_image = obj.get_featured_image()
        if featured_image:
            request = self.context.get('request')
            image_url = request.build_absolute_uri(featured_image.url) if request else featured_image.url
            return {
                'url': image_url,
                'caption': obj.get_featured_image_caption()
            }
        return None
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'summary', 'author', 'featured_image_data',
            'published_date', 'scheduled_publish_time', 'view_count', 'tags_list', 'meta_description', 'category', 'is_breaking_news'
        ]

class ArticleDetailSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    tags_list = serializers.ReadOnlyField()
    featured_image_data = serializers.SerializerMethodField()
    
    def get_featured_image_data(self, obj):
        featured_image = obj.get_featured_image()
        if featured_image:
            request = self.context.get('request')
            image_url = request.build_absolute_uri(featured_image.url) if request else featured_image.url
            return {
                'url': image_url,
                'caption': obj.get_featured_image_caption()
            }
        return None
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'content', 'summary', 'author', 'featured_image_data',
            'published_date', 'scheduled_publish_time', 'created_date', 'updated_date', 'view_count', 'tags_list', 'meta_description'
        ]

class ArticleCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = [
            # Core content
            'title', 'content', 'summary',
            # Featured image (either direct upload OR library asset reference)
            'featured_image', 'featured_image_asset',
            # Publication & categorization
            'is_published', 'category', 'is_breaking_news', 'scheduled_publish_time',
            # Tagging / SEO
            'tags', 'meta_description',
            # Collaboration
            'co_author'
        ]
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)