from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Article
from .serializers import ArticleListSerializer, ArticleDetailSerializer, ArticleCreateUpdateSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling Article CRUD operations.
    """
    queryset = Article.objects.filter(is_published=True).select_related('author')
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ArticleListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ArticleCreateUpdateSerializer
        return ArticleDetailSerializer
    
    def get_queryset(self):
        queryset = self.queryset
        
        # If user is staff, show all articles including unpublished
        if self.request.user.is_authenticated and self.request.user.is_staff:
            queryset = Article.objects.all().select_related('author')
        
        # Filter by tags if provided
        tags = self.request.query_params.get('tags', None)
        if tags:
            queryset = queryset.filter(tags__icontains=tags)
        
        return queryset
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        instance.increment_view_count()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured articles (most viewed in last 30 days)"""
        from django.utils import timezone
        from datetime import timedelta
        
        thirty_days_ago = timezone.now() - timedelta(days=30)
        featured_articles = self.get_queryset().filter(
            published_date__gte=thirty_days_ago
        ).order_by('-view_count')[:5]
        
        serializer = ArticleListSerializer(featured_articles, many=True)
        return Response(serializer.data)
