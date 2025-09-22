from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import Article

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'is_published', 'published_date', 'view_count', 'created_date')
    list_filter = ('is_published', 'published_date', 'created_date', 'author')
    search_fields = ('title', 'content', 'summary', 'tags')
    prepopulated_fields = {'slug': ('title',)}
    raw_id_fields = ('author',)
    date_hierarchy = 'published_date'
    ordering = ('-created_date',)
    
    fieldsets = (
        ('Content', {
            'fields': ('title', 'slug', 'summary', 'content', 'featured_image')
        }),
        ('Publishing', {
            'fields': ('author', 'is_published', 'published_date')
        }),
        ('SEO & Categorization', {
            'fields': ('tags', 'meta_description'),
            'classes': ('collapse',)
        }),
        ('Statistics', {
            'fields': ('view_count', 'created_date', 'updated_date'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_date', 'updated_date', 'view_count')
    
    def save_model(self, request, obj, form, change):
        if not change:  # If creating new article
            obj.author = request.user
        super().save_model(request, obj, form, change)
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(author=request.user)
