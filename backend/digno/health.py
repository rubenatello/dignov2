from django.http import JsonResponse


def healthz(_request):
    """Lightweight health endpoint returning 200 OK with a small JSON payload."""
    return JsonResponse({"status": "ok"})
