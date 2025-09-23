from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Donation

class DonationViewSet(viewsets.ReadOnlyModelViewSet):
    """Basic donation viewset - placeholder"""
    queryset = Donation.objects.all()
    permission_classes = [permissions.IsAuthenticated]

class CreateDonationView(APIView):
    """Create donation - basic implementation"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        email = data.get('email')
        amount = data.get('amount')
        if not email or not amount:
            return Response({'error': 'Email and amount required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            donation = Donation.objects.create(
                email=email,
                amount=amount,
                status='pending'
            )
            # TODO: Integrate Stripe payment intent here
            donation.status = 'completed'
            donation.save()
            return Response({'message': 'Donation received', 'id': donation.id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class StripeWebhookView(APIView):
    """Stripe webhook - placeholder"""
    pass
