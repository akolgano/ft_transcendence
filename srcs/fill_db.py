import os
import django
import sys

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pong.settings")
django.setup()

from pong.users.models import CustomUser

sample_data = [
    ('computer', 'alice@example.com', False, 'en', 'profile_pictures/default.jpg'),
    ('elina', 'elina@example.com', False, 'fr', '/profile_pictures/default.jpg'),
    ('emily', 'emily@example.com', False, 'es', 'profile_pictures/default.jpg'),
    ('alice', 'alice@example.com', False, 'es', '/profile_pictures/default.jpg'),
    ('alex', 'alex@example.com', False, 'es', '/profile_pictures/default.jpg'),
]

def insert_sample_data():
    for username, email, online, language, profile_picture in sample_data:
        try:
            user, created = CustomUser.objects.get_or_create(
                username=username,
                defaults={
                    'email': email,
                    'online': online,
                    'language': language,
                    'profile_picture': profile_picture,
                }
            )
            if created:
                print(f"Inserted: {username}")
            else:
                print(f"User already exists: {username}")
        except Exception as e:
            print(f"Error inserting {username}: {e}")

def main():
    try:
        insert_sample_data()
        print("Sample data insertion completed.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
