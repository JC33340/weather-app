from django.shortcuts import render, HttpResponseRedirect
from django.urls import reverse
from django.http import HttpResponse
from django.db import IntegrityError
from django.contrib.auth import authenticate, login, logout

from .models import User

# Create your views here.

def index(request):
    return render(request, "weather/index.html")

def register(request):
    if request.method == "GET":
        return render(request, "weather/register.html")
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        confirmation = request.POST["password-confirmation"]
        if password != confirmation:
            return render(request, "weather/register.html", {"message": "Passwords do not match"})
        try:
            user = User.objects.create_user(username, email = None, password = confirmation)
            user.save()
        except IntegrityError:
            return render(request,"weather/register.html", {"message": "Username is already in use"}) 

        return render(request, 'weather/login.html')

def login_view(request):
    if request.method == "GET":
        return render(request, "weather/login.html")
    elif request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        
        #authenticating user
        user = authenticate(request, username = username, password = password)
        print(user, username,password)

        #check if authentication is succesful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "weather/login.html", {"message":"User does not exist"})

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))