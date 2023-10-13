from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    pass

class City(models.Model):
    name = models.CharField(max_length = 50)
    country = models.CharField(max_length = 5)
    longitude = models.FloatField()
    latitude = models.FloatField()
    population = models.PositiveBigIntegerField()

class SavedCity(models.Model):
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="savedcity_city")
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "savedcity_user")