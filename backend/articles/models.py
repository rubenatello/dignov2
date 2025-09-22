from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.urls import reverse
from ckeditor_uploader.fields import RichTextUploadingField

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
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='articles')
    co_author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, related_name='co_authored_articles', blank=True, null=True, help_text="Optional co-author for collaborative articles")
    featured_image = models.ImageField(upload_to='articles/', blank=True, null=True)
    
    # Categorization and breaking news
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='POLITICS', help_text="Primary category for this article")
    is_breaking_news = models.BooleanField(default=False, help_text="Mark as breaking news regardless of category")
    
    # Publishing
    is_published = models.BooleanField(default=False)
    published_date = models.DateTimeField(blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    
    # SEO and categorization
    tags = models.CharField(max_length=200, blank=True, help_text="Comma-separated tags")
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
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return reverse('article-detail', kwargs={'slug': self.slug})
    
    @property
    def tags_list(self):
        return [tag.strip() for tag in self.tags.split(',') if tag.strip()]
    
    def increment_view_count(self):
        self.view_count += 1
        self.save(update_fields=['view_count'])
