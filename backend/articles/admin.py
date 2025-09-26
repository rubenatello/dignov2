from django.contrib import admin
from django.utils.html import format_html
from django.urls import path, reverse
from django.template.response import TemplateResponse
from django.http import Http404
from .models import Article, Image


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    def has_module_permission(self, request):
        return request.user.is_superuser or getattr(request.user, 'role', None) in ('writer', 'editor')

    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser or getattr(request.user, 'role', None) in ('writer', 'editor')

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser or getattr(request.user, 'role', None) in ('writer', 'editor')

    def has_add_permission(self, request):
        return request.user.is_superuser or getattr(request.user, 'role', None) in ('writer', 'editor')

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser or getattr(request.user, 'role', None) in ('writer', 'editor')
    list_display = ['title', 'image_thumbnail', 'source', 'dimensions', 'file_size_mb', 'usage_count', 'uploaded_by', 'created_date']
    list_filter = ['source', 'created_date', 'uploaded_by']
    search_fields = ['title', 'description', 'alt_text', 'source']
    readonly_fields = ['width', 'height', 'file_size', 'usage_count', 'created_date', 'updated_date', 'image_preview']
    ordering = ['-created_date']
    
    def image_thumbnail(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="60" height="60" style="object-fit: cover; border-radius: 4px;">', obj.image.url)
        return "No image"
    image_thumbnail.short_description = "Thumbnail"
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-width: 400px; max-height: 400px; border-radius: 8px;">', obj.image.url)
        return "No image"
    image_preview.short_description = "Preview"
    
    def dimensions(self, obj):
        if obj.width and obj.height:
            return f"{obj.width} × {obj.height}"
        return "Unknown"
    dimensions.short_description = "Dimensions"
    
    def file_size_mb(self, obj):
        if obj.file_size:
            return f"{obj.file_size / 1024 / 1024:.2f} MB"
        return "Unknown"
    file_size_mb.short_description = "File Size"
    
    fieldsets = (
        ('🖼️ Image Upload', {
            'fields': ('image', 'title', 'description', 'alt_text'),
            'description': 'Upload and describe your image'
        }),
        ('📰 Source Attribution', {
            'fields': ('source', 'source_url'),
            'description': 'Credit the source of this image'
        }),
        ('🔍 Preview', {
            'fields': ('image_preview',),
            'classes': ('collapse',)
        }),
        ('📊 Metadata', {
            'fields': ('width', 'height', 'file_size', 'usage_count'),
            'classes': ('collapse',),
            'description': 'Automatically populated image information'
        }),
        ('📅 Timestamps', {
            'fields': ('created_date', 'updated_date'),
            'classes': ('collapse',)
        })
    )
    
    def save_model(self, request, obj, form, change):
        if not change:  # If creating new image
            obj.uploaded_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    def has_module_permission(self, request):
        return request.user.is_superuser or getattr(request.user, 'role', None) in ('writer', 'editor')

    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser or getattr(request.user, 'role', None) in ('writer', 'editor')

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser or getattr(request.user, 'role', None) in ('writer', 'editor')

    def has_add_permission(self, request):
        return request.user.is_superuser or getattr(request.user, 'role', None) in ('writer', 'editor')

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser or getattr(request.user, 'role', None) in ('writer', 'editor')
    list_display = ('id', 'title', 'category', 'breaking_news_badge', 'author', 'co_author_display', 'status_badge', 'published_date', 'view_count', 'created_date')
    list_filter = ('is_published', 'category', 'is_breaking_news', 'published_date', 'created_date', 'author')
    search_fields = ('title', 'content', 'summary', 'tags')
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'published_date'
    ordering = ('-created_date',)
    actions = ['make_published', 'make_draft']
    
    fieldsets = (
        ('✍️ Content', {
            'fields': ('title', 'slug', 'summary', 'content'),
            'description': 'Main article content'
        }),
        ('🖼️ Featured Image', {
            'fields': ('featured_image_asset', 'featured_image'),
            'description': 'Choose from image library or upload directly'
        }),
        ('📂 Classification', {
            'fields': ('category', 'is_breaking_news'),
            'description': 'Article category and breaking news status'
        }),
        ('👤 Authors', {
            'fields': ('author', 'co_author'),
            'description': 'Primary author and optional co-author'
        }),
        ('📝 Publishing', {
            'fields': ('is_published', 'published_date'),
            'description': 'Publishing settings and scheduling'
        }),
        ('🔍 SEO & Categorization', {
            'fields': ('tags', 'meta_description'),
            'classes': ('collapse',),
            'description': 'Search engine optimization and additional tags'
        }),
        ('📊 Statistics', {
            'fields': ('view_count', 'created_date', 'updated_date'),
            'classes': ('collapse',),
        }),
    )
    
    readonly_fields = ('created_date', 'updated_date', 'view_count')
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('<int:object_id>/preview/', self.admin_site.admin_view(self.preview_view), name='articles_article_preview'),
        ]
        return custom_urls + urls
    
    def preview_view(self, request, object_id):
        """Custom preview view for articles"""
        article = self.get_object(request, object_id)
        if article is None:
            raise Http404("Article not found")
        
        context = {
            'article': article,
            'title': f'Preview: {article.title}',
            'opts': self.model._meta,
        }
        return TemplateResponse(request, 'admin/articles/article_preview.html', context)
    
    def co_author_display(self, obj):
        """Display co-author in list view"""
        if obj.co_author:
            return obj.co_author.get_full_name() or obj.co_author.username
        return "-"
    co_author_display.short_description = 'Co-Author'
    
    def breaking_news_badge(self, obj):
        """Display breaking news badge"""
        if obj.is_breaking_news:
            return format_html(
                '<span style="background: #E74C3C; color: white; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: bold;">🔥 BREAKING</span>'
            )
        return "-"
    breaking_news_badge.short_description = 'Breaking'
    
    def status_badge(self, obj):
        """Display publication status with colored badge"""
        if obj.is_published:
            return format_html(
                '<span style="background: #27AE60; color: white; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold;">✅ PUBLISHED</span>'
            )
        else:
            return format_html(
                '<span style="background: #F39C12; color: white; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold;">📝 DRAFT</span>'
            )
    status_badge.short_description = 'Status'
    
    def save_model(self, request, obj, form, change):
        if not change:  # If creating new article
            obj.author = request.user
        super().save_model(request, obj, form, change)
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(author=request.user)
    
    # Custom actions
    def make_published(self, request, queryset):
        """Publish selected articles"""
        updated = queryset.update(is_published=True)
        self.message_user(request, f'✅ {updated} articles were successfully published.')
    make_published.short_description = "✅ Publish selected articles"
    
    def make_draft(self, request, queryset):
        """Move selected articles to draft"""
        updated = queryset.update(is_published=False)
        self.message_user(request, f'📝 {updated} articles were moved to draft.')
    make_draft.short_description = "📝 Move to draft"
    
    def change_view(self, request, object_id, form_url='', extra_context=None):
        """Add preview button to change form"""
        extra_context = extra_context or {}
        if object_id:
            extra_context['show_preview'] = True
            extra_context['preview_url'] = reverse('admin:articles_article_preview', args=[object_id])
        return super().change_view(request, object_id, form_url, extra_context)
    
    class Media:
        css = {
            'all': ('admin/css/custom-article-admin.css',)
        }
        js = ('admin/js/article-preview.js', 'admin/js/article-changeform.js')
