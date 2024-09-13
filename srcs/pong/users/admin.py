from django.contrib import admin
from .models import CustomUser
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html

class UserAdmin(BaseUserAdmin):

    # Display profile picture in list view
    list_display = ('username', 'email', 'profile_picture_display', 'online', 'language')

    def profile_picture_display(self, obj):
        if obj.profile_picture:
            return format_html('<img src="{}" style="width: 60px; height: 50px;"/>', obj.profile_picture.url)
        #return format_html('<img src="{}" style="width: 50px; height: 50px;"/>', '/media/profile_pictures/default.jpg')

    profile_picture_display.short_description = 'Profile Picture'
    model = CustomUser
    fieldsets = BaseUserAdmin.fieldsets + (
        (None, {'fields': ('profile_picture',)}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        (None, {'fields': ('profile_picture',)}),
    )

admin.site.register(CustomUser, UserAdmin)
