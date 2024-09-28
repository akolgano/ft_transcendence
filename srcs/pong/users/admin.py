from django.contrib import admin
from django import forms
from .models import CustomUser, Friendship, GameResult, PlayerStats
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html

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
    #fieldsets = {'fields': ('username', 'email', 'password1', 'password2')}
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
    list_display = ('from_user', 'to_user')
    #list_filter = ('created_at',)
    search_fields = ('from_user__username', 'to_user__username')

admin.site.register(Friendship, FriendshipAdmin)
admin.site.register(GameResult)

class PlayerStatsAdmin(admin.ModelAdmin):
    list_display = ['user', 'victories', 'losses']  
    search_fields = ['user__username'] 

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset

    def serialize_stats(self, obj):
        serializer = PlayerStatsSerializer(obj)
        return serializer.data


admin.site.register(PlayerStats, PlayerStatsAdmin)
