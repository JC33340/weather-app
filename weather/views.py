from django.shortcuts import render, HttpResponseRedirect
from django.urls import reverse
from django.http import HttpResponse, JsonResponse
from django.db import IntegrityError
from django.contrib.auth import authenticate, login, logout
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required


from .models import User, City, SavedCity

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

@csrf_exempt
def save_city(request):
    if request.method == "GET":
        return render(request, "weather/index.html")
    if request.method == "POST":
        data = json.loads(request.body)
        if City.objects.filter(name = data['name'], country = data['country'], longitude = data['longitude'], latitude = data['latitude'], population = data['population']).first() == None:
            City.objects.create(name = data['name'], country = data['country'], longitude = data['longitude'], latitude = data['latitude'], population = data['population'])
            return JsonResponse ({"Added": "country saved"},status = 200)
        else:
            return JsonResponse({"Exists": "country has already been saved"})
        
@csrf_exempt
def user_saved_city(request):
    if request.method == "POST":
       
        data = json.loads(request.body)
        city_id = City.objects.filter(name = data["name"], longitude = data["longitude"], latitude = data["latitude"]).values()[0]["id"]
        save = SavedCity.objects.filter(city = city_id, user_id = request.user).first()
        if save == None:
            saved_status = False
        else:
            saved_status = True 
        return JsonResponse({"city_id":city_id, "saved_status": saved_status})
        
    else:
        return render(request, "weather/index.html")
    
@csrf_exempt
def saving_city(request):
    if request.method == "POST":
        data = json.loads(request.body)
        print(data)
        city_object = City.objects.get(id = data["id"])
        if data["action"] == "save":
            SavedCity.objects.create(user_id = request.user, city = city_object)
            result = "Saved"
        elif data["action"] == "unsave":
            SavedCity.objects.get(user_id = request.user, city = city_object).delete()
            result = "Unsaved"
        return JsonResponse({"Result":result})
        
    else:
        return render(request, "weather/index.html")