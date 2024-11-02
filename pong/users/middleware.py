from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import AnonymousUser

class UpdateLastActivityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        # Skip last activity update for admin paths
        if request.path.startswith('/api/admin/'):
            return self.get_response(request)
        auth = request.META.get('HTTP_AUTHORIZATION')
        if auth and auth.startswith('Token '):
            token = auth.split(' ')[1]
            try:
                token_obj = Token.objects.get(key=token)
                request.user = token_obj.user  # Set the user on the request
            except Token.DoesNotExist:
                request.user = AnonymousUser()  # Handle invalid token case
        else:
            request.user = AnonymousUser()
        if not isinstance(request.user, AnonymousUser):
            user = request.user
            user.last_activity = timezone.now()
            user.save(update_fields=['last_activity'])
        response = self.get_response(request)
        return response