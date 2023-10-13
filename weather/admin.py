from django.contrib import admin
from .models import User, City, SavedCity

# Register your models here.
admin.site.register(City)
admin.site.register(SavedCity)