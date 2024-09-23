# ================================
# akolgano
# ================================

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


class CustomUser(AbstractUser):
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        blank=True,
        null=True,
        default='profile_pictures/default.jpg'
    )
    online = models.BooleanField(default=False)
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

    # def get_friends(self):
    #     """this user is either the initiator or receiver of the friendship."""
    #     from django.db.models import Q
    #     return CustomUser.objects.filter(
    #         Q(friendships_created__from_user=self) |
    #         Q(friendships_received__to_user=self)
    #     ).distinct()

    def get_friends(self):
        #return list(self.get_friends())
        return list(self.get_friends_initiated())

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
    opponent_username = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='opponent', on_delete=models.CASCADE)
    is_ai = models.BooleanField(default=False)
    score = models.JSONField()
    date_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date_time']  # Latest games first
        verbose_name_plural = 'Game Results'

class PlayerStats(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    victories = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)

    class Meta:
        verbose_name_plural = 'Stats'
