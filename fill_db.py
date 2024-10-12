import os
import django
import sys

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pong.settings")
django.setup()

from pong.users.models import CustomUser, PlayerStats

sample_data = [
    ('computer', 'computer@example.com', 'password', False, 'en', 'profile_pictures/default.jpg'),
    ('elina', 'elina@example.com', 'password', False, 'fr', '/profile_pictures/default.jpg'),
    ('emily', 'emily@example.com', 'password', False, 'es', 'profile_pictures/default.jpg'),
    ('alice', 'alice@example.com', 'password', False, 'es', '/profile_pictures/default.jpg'),
    ('alex', 'alex@example.com', 'password', False, 'es', '/profile_pictures/default.jpg'),
]

def insert_sample_data():
    for username, email, password, online, language, profile_picture in sample_data:
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
                user.set_password("password") # hash it
                user.save()
                print(f"Inserted: {username}")
            else:
                print(f"User already exists: {username}")

            player_stats, created_stats = PlayerStats.objects.get_or_create(
                user=user,
                defaults={
                    'victories': 0,
                    'losses': 0,
                }
            )
            if created_stats:
                print(f"Inserted PlayerStats for: {username}")
            else:
                print(f"PlayerStats already exists for: {username}")
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
