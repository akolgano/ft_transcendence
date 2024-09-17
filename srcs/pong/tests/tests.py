# ================================
# akolgano
# ================================

# Unit tests: docker-compose exec django python manage.py test pong.tests.tests

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
#from django.contrib.auth.models import User
from pong.users.models import CustomUser
from rest_framework.authtoken.models import Token
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.conf import settings
from django.contrib.auth import get_user_model
import time, os


class LoginApiTests(APITestCase):

    #def setUp(self):
    #    self.user = User.objects.create_user(username='testuser', password='testpassword')

    def setUp(self):
        self.user = CustomUser.objects.create_user(username='testuser', password='testpassword')
        self.token, created = Token.objects.get_or_create(user=self.user)

    def test_login_success(self):
        url = reverse('login')
        data = {
            'username': 'testuser',
            'password': 'testpassword'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['token'], self.token.key)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], 'testuser')

    def test_login_invalid_password(self):
        url = reverse('login')
        data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {"detail": "Not found."})

    def test_login_user_not_found(self):
        url = reverse('login')
        data = {
            'username': 'nonexistentuser',
            'password': 'testpassword'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class SignupApiTests(APITestCase):
    
    def setUp(self):
        # Create a user for testing duplicate username scenario
        self.existing_user = CustomUser.objects.create_user(username='existinguser', password='testpassword')

    def test_signup_success(self):
        url = reverse('signup')
        data = {
            'username': 'newuser',
            'password': 'newpassword%'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertIn('token', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], 'newuser')

        # Verify that the user was created in the database
        self.assertTrue(CustomUser.objects.filter(username='newuser').exists())

        # Verify that a token was created for the user
        user = CustomUser.objects.get(username='newuser')
        token = Token.objects.get(user=user)
        self.assertEqual(response.data['token'], token.key)

    def test_signup_missing_username(self):
        url = reverse('signup')
        data = {
            'password': 'newpassword'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_signup_missing_password(self):
        url = reverse('signup')
        data = {
            'username': 'newuser'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_signup_short_password(self):
        url = reverse('signup')
        data = {
            'username': 'validuser',
            'password': '1'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('This password is too short', response.data['error'][0])

    def test_signup_duplicate_username(self):
        url = reverse('signup')
        data = {
            'username': 'existinguser',
            'password': 'newpassword'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)
        self.assertEqual(response.data['username'][0], 'A user with that username already exists.')

    def test_signup_empty_request(self):
        url = reverse('signup')
        response = self.client.post(url, {}, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_signup_space_in_password(self):
        url = reverse('signup')
        data = {
            'username': 'validuser',
            'password': 'space_in_password '
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'][0], 'The password must not contain spaces.')

class ChangeProfilePictureTestCase(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.change_profile_picture_url = '/change-profile-picture/'
        
        self.user = CustomUser.objects.create_user(
            username='testuser',
            password='Testpassword123!',
            email='testuser@example.com'
        )
        self.token, _ = Token.objects.get_or_create(user=self.user)

    def test_change_profile_picture(self):
        profile_picture = SimpleUploadedFile(
            name='profile_picture.jpg',
            content=open(os.path.join(settings.BASE_DIR, 'tests/media/test_image.jpg'), 'rb').read(),
            content_type='image/jpeg'
        )
        
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.post(self.change_profile_picture_url, {
            'profile_picture': profile_picture
        }, format='multipart')

        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertEqual(response_data['user']['username'], 'testuser')
        self.assertTrue(response_data['user']['profile_picture'].startswith('/media/'))

    def tearDown(self):
        pass

User = get_user_model()

class FriendTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='user1', password='password1')
        self.user2 = User.objects.create_user(username='user2', password='password2')
        self.token1, _ = Token.objects.get_or_create(user=self.user1)
        self.token2, _ = Token.objects.get_or_create(user=self.user2)
    
    def test_add_friend(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        response = self.client.post('/add_friend/', {'username_to_add': self.user2.username})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['detail'], 'Friend added successfully.')
        response = self.client.post('/add_friend/', {'username_to_add': self.user2.username})
        self.assertEqual(response.data['detail'], 'You are already friends with this user.')

    def test_remove_friend(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)

        response = self.client.post('/add_friend/', {'username_to_add': self.user2.username})
        self.assertEqual(response.status_code, 200)
        response = self.client.post('/remove_friend/', {'username_to_remove': self.user2.username})
        self.assertEqual(response.data['detail'], 'Friend removed successfully.')
        self.assertEqual(response.status_code, 200)     
        response = self.client.post('/remove_friend/', {'username_to_remove': self.user2.username})
        self.assertEqual(response.data['detail'], 'You are not friends with this user.')
        self.assertEqual(response.status_code, 400)


class FriendListTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='user1', password='password123', email='user1@example.com')
        self.user2 = User.objects.create_user(username='user2', password='password123', email='user2@example.com')
        self.user3 = User.objects.create_user(username='user3', password='password123', email='user3@example.com')

        self.client.force_authenticate(user=self.user1)

    def test_get_friends(self):
        response = self.client.post('/add_friend/', {'username_to_add': self.user2.username})
        self.assertEqual(response.status_code, 200) 

        response = self.client.post('/add_friend/', {'username_to_add': self.user3.username})
        self.assertEqual(response.status_code, 200)
        response = self.client.get('/get_friends/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        friends = response.data['friends']
        self.assertEqual(len(friends), 2)
        self.assertEqual(friends[0]['username'], 'user2')
        self.assertEqual(friends[1]['username'], 'user3')

    def test_get_friends_no_auth(self):
        self.client.force_authenticate(user=None)
        response = self.client.get('/get_friends/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UserInfoTests(APITestCase):

    def setUp(self):
        # Create two users for testing
        self.user1 = User.objects.create_user(username='user1', password='Pass1234!', email='user1@example.com')
        self.user2 = User.objects.create_user(username='user2', password='Pass1234!', email='user2@example.com')

        # Create tokens for the users
        self.token1 = Token.objects.create(user=self.user1)
        self.token2 = Token.objects.create(user=self.user2)

    def test_get_user_info_success(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        url = f'/get_user_info/{self.user1.id}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user1.username)
        self.assertEqual(response.data['profile_picture'], self.user1.profile_picture.url)

    def test_get_user_info_user_not_found(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        url = '/get_user_info/999/'  # An ID that does not exist
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['detail'], 'User not found.')

    def test_get_user_info_unauthenticated(self):
        # Test unauthenticated access
        url = f'/get_user_info/{self.user1.id}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class ChangePasswordTestCase(APITestCase):
    
    def setUp(self):
        # Create a user and get their token for authentication
        self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='oldpassword123')
        self.user.save()
        self.token = self.client.post(reverse('login'), {'username': 'testuser', 'password': 'oldpassword123'}).data['token']
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)
    
    def test_change_password_success(self):
        url = '/change_password/'
        data = {
            'old_password': 'oldpassword123',
            'new_password': 'newpassword456'
        }

        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Password changed successfully.')

        self.client.credentials()  

        #log in with the new password
        login_url = '/login/'
        login_data = {
            'username': 'testuser',
            'password': 'newpassword456'
        }
        login_response = self.client.post(login_url, login_data, format='json')
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn('token', login_response.data)

        #check that the old password no longer works
        old_password_login_data = {
            'username': 'testuser',
            'password': 'oldpassword123'
        }
        old_password_login_response = self.client.post(login_url, old_password_login_data, format='json')
        self.assertEqual(old_password_login_response.status_code, status.HTTP_404_NOT_FOUND)

    def test_change_password_invalid_old_password(self):
        url = '/change_password/'  
        response = self.client.patch(url, {'old_password': 'wrongpassword', 'new_password': 'newpassword456'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('old_password', response.data)
        self.assertEqual(response.data['old_password'][0], 'Old password is incorrect.')

    def test_change_password_missing_fields(self):
        url = '/change_password/'
        response = self.client.patch(url, {'old_password': 'oldpassword123'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('new_password', response.data)

    def test_change_password_weak_new_password(self):
        url = '/change_password/'
        response = self.client.patch(url, {'old_password': 'oldpassword123', 'new_password': '1'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('new_password', response.data)
        self.assertTrue(any("This password is too short" in msg for msg in response.data['new_password']))



class LanguageTestCases(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username='testuser', password='testpassword')

    def test_create_user_with_language(self):
        response = self.client.post('/signup/', {
            'username': 'newuser',
            'password': 'newpassword%',
            'language': 'es'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['user']['language'], 'es')