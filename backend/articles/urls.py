from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .api_views import ArticleListAPIView

router = DefaultRouter()
router.register(r'articles', views.ArticleViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('articles/', ArticleListAPIView.as_view(), name='article-list-api'),
]