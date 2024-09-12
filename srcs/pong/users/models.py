# ================================
# akolgano
# ================================

from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        blank=True,
        null=True,
        default='profile_pictures/default.jpg'
    )

    friends = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='user_friends')
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
    def add_friend(self, friend):
        if friend == self:
            return False  # Cannot add self as a friend

        if not isinstance(friend, CustomUser):
            return False  # Invalid friend object
        
        if not self.friends.filter(id=friend.id).exists():
            self.friends.add(friend)
            friend.friends.add(self)
            return True  # Friend added successfully
        return False  # Friend already in the list

    def remove_friend(self, friend):
        if friend == self:
            return False  # Cannot remove self as a friend

        if not isinstance(friend, CustomUser):
            return False  # Invalid friend object
        
        if self.friends.filter(id=friend.id).exists():
            self.friends.remove(friend)
            friend.friends.remove(self)
            return True  # Friend removed successfully
        return False  # Friend not in the list