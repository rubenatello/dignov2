from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Donation

class DonationViewSet(viewsets.ReadOnlyModelViewSet):
    """Basic donation viewset - placeholder"""
    queryset = Donation.objects.all()
    permission_classes = [permissions.IsAuthenticated]

class CreateDonationView(APIView):
    """Create donation - placeholder"""
    pass

class StripeWebhookView(APIView):
    """Stripe webhook - placeholder"""
    pass
