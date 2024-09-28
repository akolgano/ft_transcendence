# ================================
# akolgano
# ================================

from django.contrib import admin
from django.urls import path, re_path
from django.conf import settings
from django.conf.urls.static import static
from pong.users import views

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path('login', views.login, name='login'),
    re_path('signup', views.signup, name='signup'),
    re_path('test_token', views.test_token, name='test_token'),
    path('add_friend/', views.add_friend, name='add_friend'),
    path('remove_friend/', views.remove_friend, name='remove_friend'),
    path('get_friends/', views.user_friends_view, name='get_friends'),
    path('get_user_info/', views.get_user_info, name='get_user_info'),
    path('change_password/', views.change_password, name='change_password'),
    path('get_user_info/<int:user_id>/', views.get_user_by_id, name='get_user_by_id'),
    path('game/result/', views.save_game_result, name='game_result'),
    path('player/stats/', views.get_game_result, name='player_stats'),
	path('player/stats/all/', views.all_player_stats, name='all_player_stats'),
    path('change_language/', views.change_language, name='change_language'),
    re_path('change-profile-picture', views.change_profile_picture, name='change_profile_picture'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


