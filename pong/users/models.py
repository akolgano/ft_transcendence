# ================================
# akolgano
# ================================

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import os


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True, null=False, blank=False)
    username = models.CharField(max_length = 20, unique=True)
    last_activity = models.DateTimeField(default=timezone.now)

    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        blank=True,
        null=True,
        default='profile_pictures/default.jpg'
    )
    #online = models.BooleanField(default=False)
    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('es', 'Spanish'),
        ('fr', 'French'),
    ]
    language = models.CharField(
        max_length=2,
        choices=LANGUAGE_CHOICES,
        default='en',
    )
    def get_friends_initiated(self):
        """user is the initiator of the friendship."""
        return Friendship.objects.filter(
            from_user=self
        ).distinct()

    def get_friends(self):
        return list(self.get_friends_initiated())

    def save(self, *args, **kwargs):
        if self.pk:
            old_image = CustomUser.objects.get(pk=self.pk).profile_picture

            if old_image and old_image.name != self.profile_picture.name and old_image.name != 'profile_pictures/default.jpg':
                if os.path.isfile(old_image.path):
                    os.remove(old_image.path)
        super().save(*args, **kwargs)    

    def update_activity(self):
        self.last_activity = timezone.now()
        self.save()
        
    @property
    def online(self):
        return timezone.now() - self.last_activity < timedelta(minutes=1)

class Friendship(models.Model):
    from_user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='friendships_created', on_delete=models.CASCADE)
    to_user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='friendships_received', on_delete=models.CASCADE)


    class Meta:
        unique_together = ('from_user', 'to_user')
        verbose_name = 'Friendship'
        verbose_name_plural = 'Friendships'

    def __str__(self):
        return f"{self.from_user} -> {self.to_user}"


class GameResult(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='user', on_delete=models.CASCADE)
    opponent_username = models.CharField(max_length = 20, null=True)
    is_ai = models.BooleanField(default=False)
    score = models.JSONField()
    progression = models.JSONField()
    date_time = models.DateTimeField(auto_now_add=True)
    game_duration = models.DurationField()

    class Meta:
        ordering = ['-date_time']  # Latest games first
        verbose_name_plural = 'Game Results'
    def __str__(self):
        return f"{self.user.username} vs {self.opponent_username} - Score: {self.score} - Duration: {self.game_duration}"
    
class PlayerStats(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    victories = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    points = models.IntegerField(default=0)

    class Meta:
        verbose_name_plural = 'Stats'


class TournamentResult(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    nickname = models.CharField(max_length = 20)
    results = models.JSONField()
    date_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date_time']
        verbose_name_plural = 'Tournament Results' 
 