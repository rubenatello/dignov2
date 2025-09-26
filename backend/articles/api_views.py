from rest_framework import generics, serializers
from rest_framework.response import Response
from django.db.models import Q
from .models import Article

class ArticleSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    
    def get_author(self, obj):
        if obj.author:
            return obj.author.get_full_name() or obj.author.username
        return "Unknown Author"
    
    class Meta:
        model = Article
        fields = ['id', 'title', 'summary', 'category', 'is_breaking_news', 'author', 'published_date', 'slug', 'featured_image', 'is_published']

class ArticleListAPIView(generics.ListAPIView):
    serializer_class = ArticleSerializer
    
    def get_queryset(self):
        queryset = Article.objects.filter(is_published=True).order_by('-published_date')
        search_query = self.request.query_params.get('search', None)
        
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(summary__icontains=search_query) |
                Q(content__icontains=search_query) |
                Q(author__first_name__icontains=search_query) |
                Q(author__last_name__icontains=search_query)
            )
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        search_query = self.request.query_params.get('search', None)
        
        # Limit to 20 most recent articles if no search query
        if not search_query:
            queryset = queryset[:20]
            
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'results': serializer.data,
            'count': len(serializer.data),
            'search_query': search_query
        })