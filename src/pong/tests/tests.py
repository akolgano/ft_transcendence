from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
import time


class LoginApiTests(APITestCase):

    #def setUp(self):
    #    self.user = User.objects.create_user(username='testuser', password='testpassword')

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.token, created = Token.objects.get_or_create(user=self.user)

    def test_login_success(self):
        url = reverse('login')  # Ensure 'login' matches the URL name in your URLs configuration
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







"""
    def test_signup(self):
        url = reverse('signup')  # URL name for the signup endpoint
        data = { 
            "username": "anna", 
            "password": "Pass1234!", 
            "email": "anna@mail.com" 
        }
        response = self.client.post(url, data, format='json')

        # Print debug information
        print('Signup response:', response.data)
        print('Response status code:', response.status_code)

        # Introduce a delay to allow time for manual inspection
        time.sleep(60)  # Sleep for 60 seconds

        # Check if the response status code is 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Verify user creation in the test database
        user_exists = User.objects.filter(username='anna').exists()
        self.assertTrue(user_exists, "User should be created") """


class SignupApiTests(APITestCase):
    
    def setUp(self):
        # Create a user for testing duplicate username scenario
        self.existing_user = User.objects.create_user(username='existinguser', password='testpassword')

    def test_signup_success(self):
        url = reverse('signup')
        data = {
            'username': 'newuser',
            'password': 'newpassword%'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertIn('token', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], 'newuser')

        # Verify that the user was created in the database
        self.assertTrue(User.objects.filter(username='newuser').exists())

        # Verify that a token was created for the user
        user = User.objects.get(username='newuser')
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
            'password': 'short'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'][0], 'This password is too short. It must contain at least 12 characters.')

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
        self.assertEqual(response.data['detail'][0], 'The password must not contain spaces.')