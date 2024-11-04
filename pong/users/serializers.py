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

class NoStripCharField(serializers.CharField):
    def to_internal_value(self, data):
        return data

class UserSerializer(serializers.ModelSerializer):
    username = NoStripCharField(required=True, min_length=1, max_length=20)
    email = NoStripCharField(required=True)
    password = NoStripCharField(write_only=True, required=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'online', 'language', 'profile_picture', 'password']

    def validate_username(self, value):
        if value != value.strip():
            raise serializers.ValidationError("Username cannot have leading or trailing spaces.")
        
        if not re.match(r'^\w+$', value):
            raise serializers.ValidationError("Username can only contain letters, numbers, and underscores.")
        
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username is already taken.")
        
        return value

    def validate_email(self, value):
        if value != value.strip():
            raise serializers.ValidationError("Email cannot have leading or trailing spaces.")
        
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if not re.match(email_regex, value):
            raise serializers.ValidationError("Enter a valid email address.")
        
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already taken.")
        
        return value

    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user

class FriendSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['username', 'profile_picture']

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    #new_password = serializers.CharField(required=True, write_only=True)
    new_password = NoStripCharField(write_only=True, required=True, min_length=8)

    def validate(self, attrs):
        user = self.context['request'].user
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
        fields = ['username', 'profile_picture', 'victories', 'losses', 'online', 'points']



class ChangeUsernameSerializer(serializers.Serializer):
    new_username = NoStripCharField(required=True, min_length=1, max_length=20)

    def validate_new_username(self, value):
        if value != value.strip():
            raise serializers.ValidationError("Username cannot have leading or trailing spaces.")
        if not re.match(r'^\w+$', value):
            raise serializers.ValidationError("Username can only contain letters, numbers, and underscores.")
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken.")
        return value

class TournamentResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = TournamentResult
        fields = ['results', 'date_time', 'nickname']