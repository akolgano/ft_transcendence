# ================================
# akolgano
# ================================

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
#from django.contrib.auth.models import User
from .models import CustomUser, Friendship
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, FriendSerializer, ChangePasswordSerializer, ChangeUsernameSerializer
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from .models import GameResult, PlayerStats
from .serializers import GameResultSerializer, PlayerStatsSerializer
from rest_framework.views import APIView
User = get_user_model()

@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(user)
    user.online = True
    user.save()
    return Response({'token': token.key, 'user': serializer.data})

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
    user = get_object_or_404(User, username=request.data['username'])
    user.online = False
    request.user.auth_token.delete()
    user.save()
    return Response("logout successfully")

@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        email = request.data.get('email')
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already taken."}, status=status.HTTP_400_BAD_REQUEST)
        password = request.data.get('password')
        if not password:
            return Response({"error": "Password is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            validate_password(request.data['password'])
        except ValidationError as e:
            return Response({"error": e.messages}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        user = User.objects.get(username=request.data['username'])
        user.set_password(request.data['password']) #hash pass with this function
        user.save()
        PlayerStats.objects.create(user=user)
        token = Token.objects.create(user=user)
        return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("passed!")

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def change_profile_picture(request):
    user = request.user
    if 'profile_picture' not in request.FILES:
        return Response({"error": "No profile picture uploaded."}, status=status.HTTP_400_BAD_REQUEST)

    profile_picture = request.FILES['profile_picture']
    user.profile_picture = profile_picture
    user.save()

    serializer = UserSerializer(user)
    return Response({'user': serializer.data}, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_friends(request):
    user = request.user
    friends = user.friends.all()
    serializer = FriendSerializer(friends, many=True)
    return Response({'friends': serializer.data}, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user_by_id(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        raise NotFound('User not found.')

    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def change_password(request):
    serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response({"detail": "Password changed successfully."}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_friend(request):
    user = request.user
    username_to_add = request.data.get('username_to_add')

    if not username_to_add:
        return Response({'detail': 'Username to add is required.'}, status=status.HTTP_400_BAD_REQUEST)

    user_to_add = get_object_or_404(CustomUser, username=username_to_add)

    if user == user_to_add:
        return Response({'detail': 'You cannot add yourself as a friend.'}, status=status.HTTP_400_BAD_REQUEST)

    if Friendship.objects.filter(from_user=user, to_user=user_to_add).exists():
        return Response({'detail': 'You are already friends with this user.'}, status=status.HTTP_400_BAD_REQUEST)

    Friendship.objects.create(from_user=user, to_user=user_to_add)
    serializer = UserSerializer(user_to_add)
    return Response({
        'detail': 'Friend added successfully.',
        'friend': serializer.data
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def remove_friend(request):
    user = request.user
    username_to_remove = request.data.get('username_to_remove')

    if not username_to_remove:
        return Response({'detail': 'Username to remove is required.'}, status=status.HTTP_400_BAD_REQUEST)

    user_to_remove = get_object_or_404(CustomUser, username=username_to_remove)

    friendship = Friendship.objects.filter(from_user=user, to_user=user_to_remove).first()
    if not friendship:
        return Response({'detail': 'You are not friends with this user.'}, status=status.HTTP_400_BAD_REQUEST)

    friendship.delete()
    return Response({'detail': 'Friend removed successfully.'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_friends_view(request):
    user = request.user
    try:
        friends = user.get_friends()
        friends_list = [{
            'username': friend.to_user.username,
            'profile_picture': friend.to_user.profile_picture.url if friend.to_user.profile_picture else None
        } for friend in friends] 
        return Response({'user': user.username, 'friends': friends_list})
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def save_game_result(request):
    user = request.user
    is_ai = request.data.get('is_ai')
    game_duration = request.data.get('game_duration')
    if not is_ai:
        opponent_username = request.data.get('opponent_username')
    else:
        opponent_username = ''
    score = request.data.get('score')
    progression = request.data.get('progression')
    if User.objects.filter(username=opponent_username).exists():
        return Response({'error': 'Opponent username is already registered.'}, status=status.HTTP_400_BAD_REQUEST)
    if score is None:
        return Response({'error': 'Score is required.'}, status=status.HTTP_400_BAD_REQUEST)

    if isinstance(score, list):
        if len(score) != 2 or not all(isinstance(s, int) and 0 <= s <= 5 for s in score):
            return Response({'error': 'Invalid score format.'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Invalid score format.'}, status=status.HTTP_400_BAD_REQUEST)

    if isinstance(progression, list):
        if len(progression) > 9 or not all(isinstance(s, int) and 0 <= s <= 1 for s in progression):
            return Response({'error': 'Invalid progression format.'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Invalid progression format.'}, status=status.HTTP_400_BAD_REQUEST)
    game_result = GameResult.objects.create(
        user=user,
        opponent_username=opponent_username,
        is_ai=is_ai,
        score=score,
        game_duration = game_duration,
        progression = progression
    )
    player_stats, created = PlayerStats.objects.get_or_create(user=user)
    if score[0] > score[1]: 
        player_stats.victories += 1
    else: 
        player_stats.losses += 1
    player_stats.save()

    return Response({'detail': 'Score saved successfully.'}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_player(request, username):
    """
    Retrieves player statistics for a specified user.
    """
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        stats = PlayerStats.objects.get(user=user)
        game_results = GameResult.objects.filter(user=user)
        stats_data = PlayerStatsSerializer(stats).data
        stats_data['game_results'] = GameResultSerializer(game_results, many=True).data

        return Response(stats_data)
    except PlayerStats.DoesNotExist:
        return Response({"error": "No results for this user"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def all_player_stats(request):
    stats = PlayerStats.objects.all()
    serializer = PlayerStatsSerializer(stats, many=True)
    return Response(serializer.data)

@api_view(['PATCH'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def change_language(request):
    user = request.user
    new_language = request.data.get('language')
    if not new_language:
        return Response({"error": "Language is required."}, status=status.HTTP_400_BAD_REQUEST)
    supported_languages = ['en', 'es', 'fr']
    if new_language not in supported_languages:
        return Response({"error": "Unsupported language."}, status=status.HTTP_400_BAD_REQUEST)
    user.language = new_language
    user.save()
    return Response({"detail": "Language changed successfully."}, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def change_username(request):
    user = request.user
    serializer = ChangeUsernameSerializer(data=request.data)

    if serializer.is_valid():
        user.username = serializer.validated_data['new_username']
        user.save()
        return Response({"detail": "Username changed successfully."}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)