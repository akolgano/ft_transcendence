# ================================
# akolgano
# ================================


from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers
from .models import GameResult, PlayerStats, TournamentResult
import re
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
        user = self.context['request'].user
        new_password = self.validated_data['new_password']
        user.set_password(new_password)
        user.save()



class GameResultSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = GameResult
        fields = ['user', 'username', 'opponent_username', 'is_ai', 'score', 'progression', 'date_time', "game_duration"]

class PlayerStatsSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    online = serializers.BooleanField(source='user.online', read_only=True)
    profile_picture = serializers.ImageField(source='user.profile_picture', read_only=True)
    class Meta:
        model = PlayerStats
        fields = ['username', 'profile_picture', 'victories', 'losses', 'online']

class ChangeUsernameSerializer(serializers.Serializer):
    new_username = serializers.CharField(required=True, min_length=1, max_length=20)

    def validate_new_username(self, value):
        if not re.match(r'^\w+$', value):
            raise serializers.ValidationError("Username can only contain letters, numbers, and underscores.")
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken.")
        return value

class TournamentResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = TournamentResult
        fields = ['results', 'date_time']