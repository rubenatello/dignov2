from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Article, Image, Tag

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
            'published_date', 'last_published_update', 'scheduled_publish_time', 'view_count', 'tags_list', 'meta_description', 'category', 'is_breaking_news', 'is_published'
        ]

class ArticleDetailSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    tags_list = serializers.ReadOnlyField()
    featured_image_data = serializers.SerializerMethodField()
    # include raw fields needed by the editor form
    featured_image = serializers.ImageField(read_only=True)
    featured_image_asset = serializers.PrimaryKeyRelatedField(read_only=True)
    co_author = serializers.PrimaryKeyRelatedField(read_only=True)
    
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
            'id', 'title', 'subtitle', 'slug', 'content', 'summary',
            'author', 'co_author',
            'category', 'is_breaking_news', 'is_published',
            'featured_image', 'featured_image_asset', 'featured_image_data',
            'published_date', 'last_published_update', 'scheduled_publish_time', 'created_date', 'updated_date',
            'view_count', 'tags_list', 'meta_description'
        ]

class ArticleCreateUpdateSerializer(serializers.ModelSerializer):
    # Accept tags as simple string list on write; don't include in auto representation to avoid
    # DRF trying to serialize the ManyRelatedManager (which triggers the TypeError seen).
    tags = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        write_only=True,
        help_text="List of tag names"
    )
    # Expose the generated primary key so the frontend can navigate after creating
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Article
        fields = [
            'id',
            # Core content
            'title', 'slug', 'content', 'summary', 'subtitle',
            # Featured image (either direct upload OR library asset reference)
            'featured_image', 'featured_image_asset',
            # Publication & categorization
            'is_published', 'category', 'is_breaking_news', 'scheduled_publish_time',
            # Tagging / SEO
            'tags', 'meta_description',
            # Collaboration
            'co_author'
        ]

    def to_representation(self, instance):
        """Convert Article instance to dictionary representation"""
        # Let DRF build the base representation first (will not include write_only 'tags')
        data = super().to_representation(instance)
        # Convert tags ManyToManyField to list of tag names
        if instance.pk:  # Only if instance exists (has been saved)
            data['tags'] = [tag.name for tag in instance.tags.all()]
        return data

    def create(self, validated_data):
        from django.utils import timezone
        tags_data = validated_data.pop('tags', [])
        validated_data['author'] = self.context['request'].user
        # Set published_date if publishing now
        if validated_data.get('is_published') and not validated_data.get('published_date'):
            validated_data['published_date'] = timezone.now()
        article = super().create(validated_data)
        if tags_data:
            tag_objs = []
            for tag_name in tags_data:
                tag, _ = Tag.objects.get_or_create(name=tag_name)
                tag_objs.append(tag)
            article.tags.set(tag_objs)
        return article

    def update(self, instance, validated_data):
        from django.utils import timezone
        tags_data = validated_data.pop('tags', None)
        # Determine if this update is the initial publish transition
        is_initial_publish = bool(validated_data.get('is_published')) and instance.published_date is None
        if is_initial_publish:
            validated_data['published_date'] = timezone.now()
        article = super().update(instance, validated_data)
        # If the article is (now) published and this was not the initial publish, record last_published_update
        if article.is_published and article.published_date and not is_initial_publish:
            article.last_published_update = timezone.now()
            article.save(update_fields=['last_published_update'])
        if tags_data is not None:
            tag_objs = []
            for tag_name in tags_data:
                tag, _ = Tag.objects.get_or_create(name=tag_name)
                tag_objs.append(tag)
            article.tags.set(tag_objs)
        return article