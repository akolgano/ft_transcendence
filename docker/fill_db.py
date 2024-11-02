import os
import django
import sys
from django.utils import timezone
from datetime import timedelta

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pong.settings")
django.setup()

from pong.users.models import CustomUser, PlayerStats, GameResult, TournamentResult

sample_data = [
    ('juliette', 'juliette@example.com', 'password', 'en', 'profile_pictures/default.jpg'),
    ('elina', 'elina@example.com', 'password', 'fr', 'profile_pictures/default.jpg'),
    ('emily', 'emily@example.com', 'password', 'es', 'profile_pictures/default.jpg'),
    ('alice', 'alice@example.com', 'password', 'es', 'profile_pictures/default.jpg'),
    ('alex', 'alex@example.com', 'password', 'es', 'profile_pictures/redpanda.jpg'),
]

sample_data_games = [
    {"opponent_username": "alexandra", "is_ai": False, "score": [5, 2], "game_duration": "00:00:30", "progression": [0,0,0,0,0,1,1]},
    {"opponent_username": "melina", "is_ai": False, "score": [2, 5], "game_duration": "00:00:10", "progression": [0,1,0,1,1,1,1]},
    {"opponent_username": "alina", "is_ai": False, "score": [0, 5], "game_duration": "00:00:32", "progression": [1,1,1,1,1]},
    {"opponent_username": "elsa", "is_ai": False, "score": [1, 5], "game_duration": "00:00:24", "progression": [0,1,1,1,1,1]},
    {"opponent_username": "oliver", "is_ai": False, "score": [3, 5], "game_duration": "00:0:20", "progression": [0,0,0,1,1,1,1,1]},
    {"is_ai": True, "score": [4, 5], "game_duration": "00:00:29", "progression": [1,0,0,0,0,1,1,1,1,1]},
    {"opponent_username": "olivia", "is_ai": False, "score": [5, 4], "game_duration": "00:00:35", "progression": [1,0,1, 0,0,0,0,1,1]},
    {"opponent_username": "jane", "is_ai": False, "score": [5, 0], "game_duration": "00:00:20", "progression": [0,0,0,0,0]},
    {"opponent_username": "nate", "is_ai": False, "score": [5, 1], "game_duration": "00:00:39", "progression": [0,0,0,0,1, 0]},
    {"is_ai": True, "score": [5, 4], "game_duration": "00:00:10", "progression": [0,1,0,0,1,0,0,1,1]},
]

sample_data_tournaments = [
    {"nickname": "alejandro", "results": ["alejandro", "juju", "juliette", "anna"]},
    {"nickname": "alex", "results": ["alex", "test", "chanika", "chris"]},
    {"nickname": "me", "results": ["john", "jessica", "me", "ted"]},
    {"nickname": "aleja", "results": ["julia", "aleja", "frank", "lisa"]},
    {"nickname": "alexander", "results": ["mariana", "elisa", "elsa", "alexander"]},

]
def insert_sample_data():

    admin_user = CustomUser.objects.filter(username='admin').first()
    if admin_user:
        player_stats, created_stats = PlayerStats.objects.get_or_create(
            user=admin_user,
            defaults={
                'victories': 0,
                'losses': 0,
            }
        )
        if created_stats:
            print("Inserted PlayerStats for admin.")
        else:
            print("PlayerStats already exists for admin.")
    else:
        print("Admin user not found!")
    last_activity = timezone.now() - timedelta(days=1)
    for username, email, password, language, profile_picture in sample_data:
        try:
            user, created = CustomUser.objects.get_or_create(
                username=username,
                defaults={
                    'email': email,
                    'last_activity': last_activity,
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

def insert_sample_data_games():

    username = "alex"
    user, _ = CustomUser.objects.get_or_create(username=username)
    for record in sample_data_games:
        try:
            game, created_game = GameResult.objects.get_or_create(
                user=user,
                opponent_username=record.get('opponent_username'),
                is_ai=record.get('is_ai', False),
                score=record.get('score'),
                progression=record.get('progression'),
                game_duration=record.get('game_duration'),
            )
            if created_game:
                print(f"Inserted GameResult for: {username}")

                player_stats, created_stats = PlayerStats.objects.get_or_create(user=user)
                score = record['score']
                if score[0] > score[1]:
                    player_stats.victories += 1
                    player_stats.points += 10
                else:
                    player_stats.losses += 1
                    player_stats.points = max(0, player_stats.points - 5)
                player_stats.save()
                print(f"Updated PlayerStats for: {username}")
            else:
                print(f"GameResult already exists for: {username}")

        except Exception as e:
            print(f"Error inserting game data: {e}")

def insert_sample_data_tournaments():

    username = "alex"
    user = CustomUser.objects.get(username=username)
    if TournamentResult.objects.filter(user=user).exists():
        print(f"TournamentResults already exist for: {username}. Skipping insertion.")
        return
    for record in sample_data_tournaments:
        try:
            tournament = TournamentResult(
                user=user,
                nickname=record.get('nickname'),
                results=record.get('results'),
            )
            tournament.save()
            print(f"Inserted TournamentResult for: {username}")


            player_stats, created = PlayerStats.objects.get_or_create(user=user)
            results = record.get('results')
            nickname=record.get('nickname')
            place = results.index(nickname)
            if place == 0:
                player_stats.points += 20
            elif place == 1:
                player_stats.points += 10
            elif place == 3:
                player_stats.points = max(0, player_stats.points - 5)
            player_stats.save()
            print(f"Updated TournamentResult for: {username}")

        except Exception as e:
            print(f"Error inserting tournament data: {e}")

def main():
    try:
        insert_sample_data()
        insert_sample_data_games()
        insert_sample_data_tournaments()
        print("Sample data insertion completed.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
