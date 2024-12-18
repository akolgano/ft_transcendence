# ================================
# akolgano
# ================================

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser, Friendship
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, FriendSerializer, ChangePasswordSerializer, ChangeUsernameSerializer
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from .models import GameResult, PlayerStats, TournamentResult
from .serializers import GameResultSerializer, PlayerStatsSerializer, TournamentResultSerializer
from rest_framework.views import APIView
from django.http import Http404
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    logger.info(f"Login attempt for username: {username}")
    try:
        user = get_object_or_404(User, username=username)
    except Http404:
        logger.warning(f"Login failed: User {username} not found.")
        return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    if not user.check_password(request.data['password']):
        logger.warning(f"Login failed for username: {username}: incorrect password")
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(user)
    user.last_activity = timezone.now()
    user.save()
    logger.info(f"User {username} logged in successfully.")
    return Response({'token': token.key, 'user': serializer.data})

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
    username = request.data.get('username')
    
    logger.info(f"Logout attempt for username: {username}")
    try:
        user = get_object_or_404(User, username=username)
    except Http404:
        logger.warning(f"Logout failed: User {username} not found.")
        return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    try:
        request.user.auth_token.delete()
        user.save()
        logger.info(f"User {username} logged out successfully.")
        return Response("Logout successfully")
    except Exception as e:
        logger.error(f"Logout failed for user {username}: {str(e)}")
        return Response({"detail": "Logout failed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def signup(request):
    logger.info("Signup attempt")
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        
        PlayerStats.objects.create(user=user)
        token = Token.objects.create(user=user)
        
        response_data = {
            'token': token.key,
            'user': serializer.data
        }
        logger.info(f"User {user.username} signed up successfully.")
        return Response(response_data, status=status.HTTP_201_CREATED)
    logger.error("Signup failed with errors: %s", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("passed!")

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def change_profile_picture(request):
    user = request.user
    logger.info(f"Change photo attempt for username: {user.username}")
    if 'profile_picture' not in request.FILES:
        logger.error(f"User {user.username}: No profile picture uploaded.")
        return Response({"error": "No profile picture uploaded."}, status=status.HTTP_400_BAD_REQUEST)

    profile_picture = request.FILES['profile_picture']
    user.profile_picture = profile_picture
    user.save()

    serializer = UserSerializer(user)
    logger.info(f"User {user.username} changed profile picture successfully.")
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
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user_by_id(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        raise NotFound('User not found.')

    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    logger.info(f"Change password attempt for username: {user.username}")
    serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        logger.info(f"User {user.username} changed password successfully.")
        return Response({"detail": "Password changed successfully."}, status=status.HTTP_200_OK)
    logger.error("Change password failed with errors: %s", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_friend(request):
    user = request.user
    username_to_add = request.data.get('username_to_add')
    logger.debug(f"User {user.username} attempts to add a friend - Request data: {request.data}")

    if not username_to_add:
        logger.error(f"User {user.username}: Username to add is required.")
        return Response({'detail': 'Username to add is required.'}, status=status.HTTP_400_BAD_REQUEST)

    user_to_add = get_object_or_404(CustomUser, username=username_to_add)

    if user == user_to_add:
        logger.warning(f"User {user.username}: You cannot add yourself as a friend.")
        return Response({'detail': 'You cannot add yourself as a friend.'}, status=status.HTTP_400_BAD_REQUEST)

    if Friendship.objects.filter(from_user=user, to_user=user_to_add).exists():
        logger.warning(f"User {user.username}: You are already friends with this user.")
        return Response({'detail': 'You are already friends with this user.'}, status=status.HTTP_400_BAD_REQUEST)

    Friendship.objects.create(from_user=user, to_user=user_to_add)
    player_stats = get_object_or_404(PlayerStats, user=user_to_add)
    serializer = UserSerializer(user_to_add)
    friend_data = serializer.data
    friend_data['points'] = player_stats.points
    logger.info(f"User {user.username} added a friend {user_to_add.username}")
    return Response({
        'detail': 'Friend added successfully.',
        'friend': friend_data,
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def remove_friend(request):
    user = request.user
    username_to_remove = request.data.get('username_to_remove')
    logger.debug(f"User {user.username} attempts to remove a friend - Request data: {request.data}")
    if not username_to_remove:
        logger.error(f"User {user.username}: Username to remove is required.")
        return Response({'detail': 'Username to remove is required.'}, status=status.HTTP_400_BAD_REQUEST)

    user_to_remove = get_object_or_404(CustomUser, username=username_to_remove)

    friendship = Friendship.objects.filter(from_user=user, to_user=user_to_remove).first()
    if not friendship:
        logger.warning(f"User {user.username}: You are not friends with this user.")
        return Response({'detail': 'You are not friends with this user.'}, status=status.HTTP_400_BAD_REQUEST)

    friendship.delete()
    logger.info(f"User {user.username} removed a friend {username_to_remove}")
    return Response({'detail': 'Friend removed successfully.'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_friends_view(request):
    user = request.user
    logger.info(f"Fetching friends for user: {user.username}")
    try:
        friends = user.get_friends()
        friends_list = [{
            'username': friend.to_user.username,
            'points': PlayerStats.objects.get_or_create(user=friend.to_user, defaults={'points': 0})[0].points,
            'profile_picture': friend.to_user.profile_picture.url if friend.to_user.profile_picture else None
        } for friend in friends]
        logger.info(f"Successfully retrieved friends for user: {user.username}")
        return Response({'user': user.username, 'friends': friends_list})
    except Exception as e:
        logger.error(f"Error fetching friends for user: {user.username} - {str(e)}")
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def save_game_result(request):
    user = request.user
    logger.info(f"Save game result attempt for {user.username} - Request data: {request.data}")
    is_ai = request.data.get('is_ai')
    game_duration = request.data.get('game_duration')
    if not is_ai:
        opponent_username = request.data.get('opponent_username')
    else:
        opponent_username = ''
    score = request.data.get('score')

    progression = request.data.get('progression')

    if score is None:
        logger.error(f"User {user.username}: Score is required.")
        return Response({'error': 'Score is required.'}, status=status.HTTP_400_BAD_REQUEST)

    if isinstance(score, list):
        if len(score) != 2 or not all(isinstance(s, int) and 0 <= s <= 5 for s in score):
            logger.error(f"User {user.username}: Invalid score format")
            return Response({'error': 'Invalid score format.'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        logger.error(f"User {user.username}: Invalid score format")
        return Response({'error': 'Invalid score format.'}, status=status.HTTP_400_BAD_REQUEST)

    if isinstance(progression, list):
        if len(progression) > 9 or not all(isinstance(s, int) and 0 <= s <= 1 for s in progression):
            logger.error(f"User {user.username}: Invalid progression format")
            return Response({'error': 'Invalid progression format.'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        logger.error(f"User {user.username}: Invalid progression format")
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
        player_stats.points += 10
    else:
        player_stats.losses += 1
        player_stats.points = max(0, player_stats.points - 5)
    player_stats.save()
    logger.info(f"User {user.username}: Response - Score saved successfully.")
    return Response({'detail': 'Score saved successfully.'}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_player(request, username):
    """
    Retrieves player statistics for a specified user.
    """
    logger.info(f"Attempt player stats for {username} - Request data: {request.data}")
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        logger.warning(f"User with username {username} is not found")
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        stats = PlayerStats.objects.get(user=user)
        game_results = GameResult.objects.filter(user=user).order_by('-date_time')
        tournament_results = TournamentResult.objects.filter(user=user).order_by('-date_time')
        stats_data = PlayerStatsSerializer(stats).data
        stats_data['game_results'] = GameResultSerializer(game_results, many=True).data
        stats_data['tournaments'] = TournamentResultSerializer(tournament_results, many=True).data
        logger.info(f"The player stats for {username} were successfully returned. Response - {stats_data}")
        return Response(stats_data, status=status.HTTP_200_OK)
    except PlayerStats.DoesNotExist:
        logger.error(f"No results for user {username}")
        return Response({"error": "No results for this user"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def change_language(request):
    user = request.user
    new_language = request.data.get('language')
    if not new_language:
        logger.warning(f"Language change attempt failed: Language is required.")
        return Response({"error": "Language is required."}, status=status.HTTP_400_BAD_REQUEST)
    supported_languages = ['en', 'es', 'fr']
    if new_language not in supported_languages:
        logger.warning(f"Language change attempt failed: Unsupported language.")
        return Response({"error": "Unsupported language."}, status=status.HTTP_400_BAD_REQUEST)
    user.language = new_language
    user.save()
    logger.info(f"User {user.username} changed language to '{new_language}' successfully.")
    return Response({"detail": "Language changed successfully."}, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def change_username(request):
    user = request.user
    old_username = user.username
    serializer = ChangeUsernameSerializer(data=request.data)

    if serializer.is_valid():
        user.username = serializer.validated_data['new_username']
        user.save()
        logger.info(f"User {old_username} changed username to {user.username} successfully.")
        return Response({"detail": "Username changed successfully."}, status=status.HTTP_200_OK)
    logger.error("Username change failed with errors: %s", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def save_tournament_result(request):
    user = request.user
    logger.info(f"User {user.username}: Save tournament result attempt")
    results = request.data.get('results')
    nickname = request.data.get('nickname')
    if not nickname:
        logger.error(f"User {user.username}: Nickname is required.")
        return Response({'error': 'Nickname is required.'}, status=status.HTTP_400_BAD_REQUEST)

    if isinstance(results, list):
        if len(results) != 4 or not all(isinstance(s, str) for s in results):
            logger.error(f"User {user.username}: Invalid results format")
            return Response({'error': 'Invalid results format.'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        logger.error(f"User {user.username}: Invalid results format")
        return Response({'error': 'Invalid results format.'}, status=status.HTTP_400_BAD_REQUEST)
    tournament_result = TournamentResult.objects.create(
        user=user,
        results=results,
        nickname=nickname
    )

    player_stats, created = PlayerStats.objects.get_or_create(user=user)
    try:
        place = results.index(nickname)
        if place == 0:
            player_stats.points += 20
        elif place == 1:
            player_stats.points += 10
        elif place == 3:
            player_stats.points = max(0, player_stats.points - 5)
        player_stats.save()
        response_data = {'detail': 'Tournament result saved successfully.'}
        logger.info(f"User {user.username}: Response - {response_data}")
        return Response(response_data, status=status.HTTP_201_CREATED)
    except ValueError:
        logger.error(f"User {user.username}: Nickname '{nickname}' not found in results.")
        return Response({'error': 'No nickname in results.'}, status=status.HTTP_400_BAD_REQUEST)
