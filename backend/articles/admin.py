from django.contrib import admin
from django.utils.html import format_html
from django.urls import path, reverse
from django.template.response import TemplateResponse
from django.http import Http404
from .models import Article

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'breaking_news_badge', 'author', 'co_author_display', 'status_badge', 'published_date', 'view_count', 'created_date')
    list_filter = ('is_published', 'category', 'is_breaking_news', 'published_date', 'created_date', 'author')
    search_fields = ('title', 'content', 'summary', 'tags')
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'published_date'
    ordering = ('-created_date',)
    actions = ['make_published', 'make_draft']
    
    fieldsets = (
        ('✍️ Content', {
            'fields': ('title', 'slug', 'summary', 'content', 'featured_image'),
            'description': 'Main article content and media'
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
