from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.urls import reverse
from ckeditor_uploader.fields import RichTextUploadingField
from PIL import Image as PILImage
import os

class Tag(models.Model):
    """
    Tag model for article categorization and SEO.
    """
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=60, unique=True, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        indexes = [models.Index(fields=['name']), models.Index(fields=['slug'])]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Image(models.Model):
    """
    Reusable Image model for article media with automatic captioning and source attribution.
    """
    
    # Image file and metadata
    image = models.ImageField(upload_to='images/%Y/%m/', help_text="Upload image file")
    title = models.CharField(max_length=200, help_text="Internal title for organizing images")
    description = models.TextField(max_length=500, help_text="Caption/description that appears with the image")
    alt_text = models.CharField(max_length=255, help_text="Alt text for accessibility")
    
    # Source attribution
    source = models.CharField(max_length=200, help_text="Photo credit/source (e.g., 'Laura Buckman/AFP via Getty Images')")
    source_url = models.URLField(blank=True, help_text="Optional link to original source")
    
    # Image properties (auto-populated)
    width = models.PositiveIntegerField(blank=True, null=True)
    height = models.PositiveIntegerField(blank=True, null=True)
    file_size = models.PositiveIntegerField(blank=True, null=True, help_text="File size in bytes")
    
    # Metadata
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='uploaded_images')
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    
    # Usage tracking
    usage_count = models.PositiveIntegerField(default=0, help_text="Number of times this image has been used")
    
    class Meta:
        ordering = ['-created_date']
        indexes = [
            models.Index(fields=['-created_date']),
            models.Index(fields=['uploaded_by', '-created_date']),
        ]
    
    def save(self, *args, **kwargs):
        # Resize image if too large and set width, height, file_size
        MAX_WIDTH = 1200
        MAX_HEIGHT = 800
        if self.image:
            try:
                img_path = self.image.path if hasattr(self.image, 'path') else None
                if img_path and os.path.exists(img_path):
                    with PILImage.open(img_path) as img:
                        # Resize if needed
                        if img.width > MAX_WIDTH or img.height > MAX_HEIGHT:
                            img.thumbnail((MAX_WIDTH, MAX_HEIGHT), PILImage.LANCZOS)
                            img.save(img_path, optimize=True, quality=85)
                        self.width, self.height = img.size
                    self.file_size = os.path.getsize(img_path)
            except Exception:
                pass  # Silently handle any image processing errors
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.title} ({self.source})"
    
    @property
    def formatted_caption(self):
        """Returns formatted caption with source attribution"""
        if self.source:
            return f"{self.description} Photo: {self.source}"
        return self.description
    
    @property 
    def aspect_ratio(self):
        """Calculate aspect ratio for responsive display"""
        if self.width and self.height:
            return self.width / self.height
        return None
    
    def increment_usage(self):
        """Track how many times this image has been used"""
        self.usage_count += 1
        self.save(update_fields=['usage_count'])

class Article(models.Model):
    """
    Article model for news content.
    """
    
    # Category choices matching frontend navigation
    CATEGORY_CHOICES = [
        ('BREAKING_NEWS', 'Breaking News'),
        ('ECONOMY', 'Economy'),
        ('POLITICS', 'Politics'),
        ('FOREIGN_AFFAIRS', 'Foreign Affairs'),
        ('IMMIGRATION', 'Immigration'),
        ('HUMAN_RIGHTS', 'Human Rights'),
        ('LEGISLATION', 'Legislation'),
        ('OPINION', 'Opinion'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    content = RichTextUploadingField()
    summary = models.TextField(max_length=300, help_text="Brief summary of the article")
    subtitle = models.CharField(max_length=300, blank=True, help_text="Optional subtitle for the article")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='articles')
    co_author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, related_name='co_authored_articles', blank=True, null=True, help_text="Optional co-author for collaborative articles")
    
    # Featured image - can use either direct upload or reference to Image model
    featured_image = models.ImageField(upload_to='articles/', blank=True, null=True, help_text="Direct image upload")
    featured_image_asset = models.ForeignKey('Image', on_delete=models.SET_NULL, blank=True, null=True, related_name='featured_in_articles', help_text="Use image from media library")
    
    # Categorization and breaking news
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='POLITICS', help_text="Primary category for this article")
    is_breaking_news = models.BooleanField(default=False, help_text="Mark as breaking news regardless of category")
    
    # Publishing
    is_published = models.BooleanField(default=False)
    published_date = models.DateTimeField(blank=True, null=True)
    scheduled_publish_time = models.DateTimeField(blank=True, null=True, help_text="If set, article will be published at this time.")
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    # Tracks the most recent edit after the article has been published (does not include the initial publish time)
    last_published_update = models.DateTimeField(blank=True, null=True)
    
    # SEO and categorization
    tags = models.ManyToManyField(Tag, blank=True, related_name='articles', help_text="Tags for this article")
    meta_description = models.CharField(max_length=160, blank=True)
    
    # Engagement metrics
    view_count = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['-published_date', '-created_date']
        indexes = [
            models.Index(fields=['is_published', '-published_date']),
            models.Index(fields=['author', '-published_date']),
        ]
    
    def save(self, *args, **kwargs):
        # If no slug provided, default to slugified title; otherwise honor provided slug
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title
    
    def get_featured_image(self):
        """Get the featured image, prioritizing featured_image_asset over direct upload"""
        if self.featured_image_asset:
            return self.featured_image_asset.image
        return self.featured_image
    
    def get_featured_image_caption(self):
        """Get caption for the featured image"""
        if self.featured_image_asset:
            return self.featured_image_asset.formatted_caption
        return ""
    
    def get_absolute_url(self):
        return reverse('article-detail', kwargs={'slug': self.slug})
    
    @property
    def tags_list(self):
        return list(self.tags.values_list('name', flat=True))
    
    def increment_view_count(self):
        self.view_count += 1
        self.save(update_fields=['view_count'])

