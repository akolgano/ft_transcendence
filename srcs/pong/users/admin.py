from django.contrib import admin
from .models import CustomUser, Friendship
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .forms import CustomUserChangeForm, CustomUserCreationForm

class UserAdmin(BaseUserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm

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