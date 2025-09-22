from rest_framework import generics, serializers
from rest_framework.response import Response
from .models import Article

class ArticleSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.get_full_name', read_only=True)
    
    class Meta:
        model = Article
        fields = ['id', 'title', 'summary', 'category', 'is_breaking_news', 'author', 'published_date', 'slug', 'featured_image']

class ArticleListAPIView(generics.ListAPIView):
    serializer_class = ArticleSerializer
    
    def get_queryset(self):
        return Article.objects.filter(is_published=True).order_by('-published_date')
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()[:20]  # Limit to 20 most recent articles
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'results': serializer.data,
            'count': len(serializer.data)
        })