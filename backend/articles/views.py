from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Article
from .models import Article, Image
from .serializers import ArticleListSerializer, ArticleDetailSerializer, ArticleCreateUpdateSerializer, ImageSerializer
from .permissions import IsWriterOrEditorOrReadOnly

class ImageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling Image CRUD operations.
    """
    queryset = Image.objects.all().select_related('uploaded_by').order_by('-created_date')
    serializer_class = ImageSerializer
    permission_classes = [IsWriterOrEditorOrReadOnly]
    
    def get_queryset(self):
        queryset = self.queryset
        
        # Handle search query
        search_query = self.request.query_params.get('search', None)
        if search_query:
            from django.db.models import Q
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(source__icontains=search_query) |
                Q(alt_text__icontains=search_query)
            )
        
        # Filter by source if provided
        source = self.request.query_params.get('source', None)
        if source:
            queryset = queryset.filter(source__icontains=source)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get most recently uploaded images"""
        recent_images = self.get_queryset()[:20]
        serializer = self.get_serializer(recent_images, many=True, context={'request': request})
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)


class ArticleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling Article CRUD operations.
    """
    queryset = Article.objects.all().select_related('author')
    permission_classes = [IsWriterOrEditorOrReadOnly]
    lookup_field = 'slug'
    

    def get_serializer_class(self):
        if self.action == 'list':
            return ArticleListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ArticleCreateUpdateSerializer
        return ArticleDetailSerializer

    def create(self, request, *args, **kwargs):
        # Log the incoming request data for debugging
        import logging
        logger = logging.getLogger(__name__)
        logger.debug(f"[ARTICLE CREATE] Request data: {request.data}")
        
        serializer = self.get_serializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            logger.error(f"[ARTICLE CREATE] Validation errors: {serializer.errors}")
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        try:
            self.perform_create(serializer)
        except Exception as e:
            logger.error(f"[ARTICLE CREATE] Exception: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial, context={'request': request})
        if not serializer.is_valid():
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        try:
            self.perform_update(serializer)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.data)
    
    def get_queryset(self):
        queryset = self.queryset
        # Only filter for published articles on list/retrieve actions
        if self.action in ["list", "retrieve", "featured"]:
            queryset = queryset.filter(is_published=True)
        # If user is staff, show all articles including unpublished
        if self.request.user.is_authenticated and self.request.user.is_staff:
            queryset = Article.objects.all().select_related('author')
        # Handle search query
        search_query = self.request.query_params.get('search', None)
        if search_query:
            from django.db.models import Q
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(summary__icontains=search_query) |
                Q(content__icontains=search_query) |
                Q(author__first_name__icontains=search_query) |
                Q(author__last_name__icontains=search_query)
            )
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

    @action(detail=False, methods=['get'])
    def exists(self, request):
        """Check if an article slug already exists. Ignores publish status.

        Query params:
            - slug: the slug to check
        Returns: { exists: bool, id: number|null }
        """
        slug = request.query_params.get('slug')
        if not slug:
            return Response({ 'exists': False, 'id': None }, status=status.HTTP_400_BAD_REQUEST)
        obj = Article.objects.filter(slug=slug).values('id').first()
        return Response({ 'exists': bool(obj), 'id': obj['id'] if obj else None })

    @action(detail=False, methods=['get'], url_path='by-id')
    def by_id(self, request):
        """Fetch one article by numeric id. Useful for the editor when we only have id."""
        try:
            article_id = int(request.query_params.get('id', ''))
        except Exception:
            return Response({'error': 'Invalid id'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            obj = Article.objects.select_related('author', 'co_author', 'featured_image_asset').get(id=article_id)
        except Article.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ArticleDetailSerializer(obj, context={'request': request})
        return Response(serializer.data)
