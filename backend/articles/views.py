from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Article
from .models import Article, Image, ArticleLike, Comment, CommentLike
from .serializers import ArticleListSerializer, ArticleDetailSerializer, ArticleCreateUpdateSerializer, ImageSerializer, CommentSerializer
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
        # Filter by category if provided
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
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

    @action(detail=True, methods=['post', 'delete'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, slug=None):
        """POST: like, DELETE: unlike. Idempotent."""
        article = self.get_object()
        if request.method.lower() == 'post':
            ArticleLike.objects.get_or_create(article=article, user=request.user)
            return Response({ 'liked': True })
        # DELETE
        ArticleLike.objects.filter(article=article, user=request.user).delete()
        return Response({ 'liked': False })

    @action(detail=True, methods=['get', 'post'], url_path='comments', permission_classes=[permissions.IsAuthenticatedOrReadOnly])
    def comments(self, request, slug=None):
        """GET: list top-level comments; POST: create top-level comment (auth required).

        Optional query param include_replies=true to include replies inline (small threads).
        """
        article = self.get_object()
        if request.method.lower() == 'get':
            include_replies = request.query_params.get('include_replies', 'false').lower() in ('1', 'true', 'yes')
            qs = Comment.objects.filter(article=article, parent__isnull=True).select_related('user')
            page = self.paginate_queryset(qs)
            data_qs = page or qs
            serializer = CommentSerializer(data_qs, many=True, context={'request': request})
            data = serializer.data
            if include_replies:
                # Attach replies (flat, ordered newest->oldest) per parent comment
                ids = [c.id for c in data_qs]
                replies = (
                    Comment.objects.filter(article=article, parent_id__in=ids)
                    .select_related('user')
                    .order_by('-created_date')
                )
                rep_by_parent = {}
                for r in replies:
                    rep_by_parent.setdefault(r.parent_id, []).append(CommentSerializer(r, context={'request': request}).data)
                # merge
                for item in data:
                    item['replies'] = rep_by_parent.get(item['id'], [])
            if page is not None:
                return self.get_paginated_response(data)
            return Response(data)
        # POST (top-level)
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        content = (request.data.get('content') or '').strip()
        if not content:
            return Response({'content': 'This field may not be blank.'}, status=status.HTTP_400_BAD_REQUEST)
        if len(content) > 300:
            return Response({'content': 'Ensure this field has no more than 300 characters.'}, status=status.HTTP_400_BAD_REQUEST)
        comment = Comment.objects.create(article=article, user=request.user, content=content)
        serializer = CommentSerializer(comment, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='comments/(?P<comment_id>[^/.]+)/reply', permission_classes=[permissions.IsAuthenticated])
    def reply(self, request, slug=None, comment_id=None):
        """Create a reply to a specific comment."""
        article = self.get_object()
        try:
            parent = Comment.objects.get(id=comment_id, article=article)
        except Comment.DoesNotExist:
            return Response({'detail': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)
        content = (request.data.get('content') or '').strip()
        if not content:
            return Response({'content': 'This field may not be blank.'}, status=status.HTTP_400_BAD_REQUEST)
        if len(content) > 300:
            return Response({'content': 'Ensure this field has no more than 300 characters.'}, status=status.HTTP_400_BAD_REQUEST)
        c = Comment.objects.create(article=article, user=request.user, parent=parent, content=content)
        return Response(CommentSerializer(c, context={'request': request}).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post', 'delete'], url_path='comments/(?P<comment_id>[^/.]+)/like', permission_classes=[permissions.IsAuthenticated])
    def comment_like(self, request, slug=None, comment_id=None):
        """POST: like a comment; DELETE: unlike.

        Idempotent operations.
        """
        article = self.get_object()  # ensure article exists and user can access
        try:
            comment = Comment.objects.get(id=comment_id, article=article)
        except Comment.DoesNotExist:
            return Response({'detail': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)
        if request.method.lower() == 'post':
            CommentLike.objects.get_or_create(comment=comment, user=request.user)
            return Response({'liked': True})
        CommentLike.objects.filter(comment=comment, user=request.user).delete()
        return Response({'liked': False})
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured articles (most viewed in last 30 days)"""
        from django.utils import timezone
        from datetime import timedelta
        
        thirty_days_ago = timezone.now() - timedelta(days=30)
        featured_articles = self.get_queryset().filter(
            published_date__gte=thirty_days_ago
        ).order_by('-view_count')[:5]
        serializer = ArticleListSerializer(featured_articles, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def breaking(self, request):
        """Get up to 5 currently-breaking articles.

        Definition: is_breaking_news=True AND published_date within the last 12 hours.
        """
        from django.utils import timezone
        from datetime import timedelta
        twelve_hours_ago = timezone.now() - timedelta(hours=12)
        qs = self.get_queryset().filter(
            is_breaking_news=True,
            published_date__gte=twelve_hours_ago
        ).order_by('-published_date')[:5]
        serializer = ArticleListSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='analytics/top-viewed')
    def analytics_top_viewed(self, request):
        """Return top viewed published articles within a timeframe.

        Query params:
          - days (int): lookback window in days (default 30)
          - limit (int): number of results (default 5)
        """
        from datetime import timedelta
        try:
            days = int(request.query_params.get('days', '30'))
        except Exception:
            days = 30
        try:
            limit = int(request.query_params.get('limit', '5'))
        except Exception:
            limit = 5
        since = timezone.now() - timedelta(days=days)
        qs = (
            self.get_queryset()
            .filter(is_published=True, published_date__gte=since)
            .order_by('-view_count')[: max(1, min(limit, 50))]
        )
        serializer = ArticleListSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='analytics/trending')
    def analytics_trending(self, request):
        """Return trending articles scored by simple recency-weighted views.

        Score = view_count / max(1, days_since_publish)
        Query params:
          - days (int): consider only items published within last N days (default 14)
          - limit (int): number of results (default 5)
        """
        from datetime import timedelta
        import math
        try:
            days = int(request.query_params.get('days', '14'))
        except Exception:
            days = 14
        try:
            limit = int(request.query_params.get('limit', '5'))
        except Exception:
            limit = 5
        since = timezone.now() - timedelta(days=days)
        qs = (
            self.get_queryset()
            .filter(is_published=True, published_date__gte=since)
        )
        items = []
        now = timezone.now()
        for a in qs:
            if not a.published_date:
                continue
            delta_days = max(1, (now - a.published_date).days or 0)
            score = float(a.view_count or 0) / float(delta_days)
            items.append({
                'id': a.id,
                'title': a.title,
                'slug': a.slug,
                'category': a.category,
                'published_date': a.published_date,
                'view_count': a.view_count,
                'score': round(score, 2),
            })
        items.sort(key=lambda x: x['score'], reverse=True)
        return Response(items[: max(1, min(limit, 50))])

    @action(detail=False, methods=['get'], url_path='analytics/tags')
    def analytics_tags(self, request):
        """Return top tags by frequency within a timeframe.

        Query params:
          - days (int): lookback window in days (default 30)
          - limit (int): number of results (default 10)
        """
        from datetime import timedelta
        try:
            days = int(request.query_params.get('days', '30'))
        except Exception:
            days = 30
        try:
            limit = int(request.query_params.get('limit', '10'))
        except Exception:
            limit = 10
        since = timezone.now() - timedelta(days=days)
        qs = self.get_queryset().filter(is_published=True, published_date__gte=since)
        counts = {}
        for a in qs:
            # Prefer tags_list if serializer/model provides it; fall back to CSV in 'tags'
            tags_list = getattr(a, 'tags_list', None)
            if tags_list is None:
                raw = (a.tags or '')
                tags_list = [t.strip() for t in raw.split(',') if t.strip()]
            for t in tags_list or []:
                key = str(t).strip()
                if not key:
                    continue
                counts[key] = counts.get(key, 0) + 1
        # Sort by frequency desc
        top = sorted(counts.items(), key=lambda kv: kv[1], reverse=True)[: max(1, min(limit, 50))]
        data = [{ 'tag': k, 'count': v } for k, v in top]
        return Response(data)

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
