from django.contrib import admin
from django import forms
from .models import CustomUser, Friendship, GameResult, PlayerStats, TournamentResult
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from django.core.exceptions import ValidationError
import logging
logger = logging.getLogger(__name__)

class CustomUserCreationForm(forms.ModelForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Confirm Password', widget=forms.PasswordInput)

    class Meta:
        model = CustomUser
        fields = ('username', 'email')

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if not email:
            raise forms.ValidationError("Email is required.")
        return email

    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get("password1")
        password2 = cleaned_data.get("password2")

        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords do not match.")

        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password1'])
        if commit:
            user.save()
        return user

class UserAdmin(BaseUserAdmin):
    add_form = CustomUserCreationForm
    add_fieldsets = (
    (None, {
        'classes': ('wide',),
        'fields': ('username', 'email', 'password1', 'password2'),
    }),
    )
    list_display = ('username', 'email', 'profile_picture_display', 'online', 'language', 'get_friends_count', 'get_friends_list')
    def profile_picture_display(self, obj):
        if obj.profile_picture:
            return format_html('<img src="{}" style="width: 60px; height: 50px;"/>', obj.profile_picture.url)
        return format_html('<img src="{}" style="width: 50px; height: 50px;"/>', '/media/profile_pictures/default.jpg')

    profile_picture_display.short_description = 'Profile Picture'

    def get_friends_count(self, obj):
        return len(obj.get_friends())
    get_friends_count.short_description = 'Friends Count'

    def get_friends_list(self, obj):
        return ", ".join([friend.to_user.username for friend in obj.get_friends()])
    get_friends_list.short_description = 'Friends'

admin.site.register(CustomUser, UserAdmin)

class FriendshipAdmin(admin.ModelAdmin):
    """
    Admin interface for managing Friendship instances.
    """
    list_display = ('from_user', 'to_user')
    search_fields = ('from_user__username', 'to_user__username')

admin.site.register(Friendship, FriendshipAdmin)

class GameResultForm(forms.ModelForm):
    class Meta:
        model = GameResult
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['opponent_username'].required = True
        if self.instance and self.instance.pk: #already existed
            if self.instance.is_ai:
                self.fields['opponent_username'].required = False
        elif kwargs.get('initial', {}).get('is_ai'):
            self.fields['opponent_username'].required = False


    def clean_score(self):
        score = self.cleaned_data.get('score')
        if isinstance(score, list):
            if len(score) != 2 or not all(isinstance(s, int) and 0 <= s <= 5 for s in score):
                raise forms.ValidationError("Score must be a list of exactly two integers between 0 and 5.")
        return score

class GameResultAdmin(admin.ModelAdmin):
    form = GameResultForm
    list_display = ('user', 'opponent_username', 'is_ai', 'score', 'progression', 'game_duration', 'date_time')
    list_filter = ('user', 'opponent_username', 'is_ai', 'date_time')
    search_fields = ('user__username', 'opponent_username')
    ordering = ('-date_time',)

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)

        player_stats, created = PlayerStats.objects.get_or_create(user=obj.user)
        user_score, opponent_score = obj.score

        if user_score > opponent_score:
            player_stats.victories += 1
            player_stats.points += 10
        elif user_score < opponent_score:
            player_stats.losses += 1
            player_stats.points = max(0, player_stats.points - 5)
        
        player_stats.save()


class PlayerStatsAdmin(admin.ModelAdmin):
    """
    Admin interface for managing PlayerStats instances.
    """

    list_display = ('user', 'victories', 'losses', 'points')
    search_fields = ('user__username',)

class TournamentResultAdmin(admin.ModelAdmin):
    list_display = ('user', 'results','date_time')
    ordering = ('-date_time',)

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)

        player_stats, created = PlayerStats.objects.get_or_create(user=obj.user)
        results = obj.results
        place = results.index(obj.user.username)
        if place == 0:
            player_stats.points += 20
        elif place == 1:
            player_stats.points += 10
        elif place == 3:
            player_stats.points = max(0, player_stats.points - 5)
        player_stats.save()

admin.site.register(GameResult, GameResultAdmin)
admin.site.register(PlayerStats, PlayerStatsAdmin)
admin.site.register(TournamentResult, TournamentResultAdmin)