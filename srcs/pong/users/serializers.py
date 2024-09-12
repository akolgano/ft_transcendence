# ================================
# akolgano
# ================================


from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'online', 'language', 'profile_picture']

class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'profile_picture']

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        user = self.context['request'].user  # Accessing the request context
        old_password = attrs.get('old_password')
        new_password = attrs.get('new_password')
        
        if not user.check_password(old_password):
            raise serializers.ValidationError({"old_password": "Old password is incorrect."})

        try:
            validate_password(new_password, user)
        except ValidationError as e:
            raise serializers.ValidationError({"new_password": e.messages})

        return attrs

    def save(self):
        user = self.context['request'].user  # Accessing the request context
        new_password = self.validated_data['new_password']
        user.set_password(new_password)
        user.save()