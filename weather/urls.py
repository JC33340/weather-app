from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name = "index"),
    path("register/", views.register, name = "register"), 
    path("login/", views.login_view, name = "login"),
    path("logout/", views.logout_view, name = "logout"),

    # API calls
    path("save_city", views.save_city, name = "save_city"),
    path("user_saved_city", views.user_saved_city, name = "user_saved_city"),
    path("saving_city", views.saving_city, name = "saving_city"),
    path("saved_cities", views.saved_cities, name = "saved_cities")
]