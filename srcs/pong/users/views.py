# ================================
# akolgano
# ================================

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
#from django.contrib.auth.models import User
from .models import CustomUser
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, FriendSerializer, ChangePasswordSerializer
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound

User = get_user_model()

@api_view(['POST'])
def login(request):
	user = get_object_or_404(User, username=request.data['username'])
	if not user.check_password(request.data['password']):
		return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
	token, created = Token.objects.get_or_create(user=user)
	serializer = UserSerializer(user)
	return Response({'token': token.key, 'user': serializer.data})

@api_view(['POST'])
def signup(request):
	serializer = UserSerializer(data=request.data)
	if serializer.is_valid():
		email = request.data.get('email')
		# Check if email already exists
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
		token = Token.objects.create(user=user)
		return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_201_CREATED)
	#return Response({'error': 'Please enter a valid email address'}, status=status.HTTP_400_BAD_REQUEST)
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

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_friend(request):
    user = request.user
    friend_username = request.data.get('friend_username')
    friend = get_object_or_404(CustomUser, username=friend_username)
    user.add_friend(friend)
    return Response({'detail': 'Friend added successfully'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def remove_friend(request):
    user = request.user
    friend_username = request.data.get('friend_username')
    friend = get_object_or_404(CustomUser, username=friend_username)
    user.remove_friend(friend)
    return Response({'detail': 'Friend removed successfully'}, status=status.HTTP_200_OK)

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





