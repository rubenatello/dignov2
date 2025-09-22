from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'donations', views.DonationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('donate/', views.CreateDonationView.as_view(), name='create-donation'),
    path('stripe/webhook/', views.StripeWebhookView.as_view(), name='stripe-webhook'),
]