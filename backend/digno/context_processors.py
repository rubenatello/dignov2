"""
Context processors for Django admin customization
"""
from articles.models import Article


def admin_dashboard_stats(request):
    """Add dashboard statistics to admin context"""
    if not request.path.startswith('/admin/') or not request.user.is_authenticated:
        return {}
    
    # Only add stats to the main admin index page
    if request.path == '/admin/':
        user_articles = Article.objects.filter(author=request.user).count()
        user_published = Article.objects.filter(author=request.user, is_published=True).count()
        user_drafts = Article.objects.filter(author=request.user, is_published=False).count()
        
        # Global stats for admins
        total_articles = Article.objects.count()
        total_published = Article.objects.filter(is_published=True).count()
        
        return {
            'user_articles': user_articles,
            'user_published': user_published,
            'user_drafts': user_drafts,
            'total_articles': total_articles,
            'total_published': total_published,
        }
    
    return {}