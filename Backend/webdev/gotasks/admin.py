from django.contrib import admin
from .models import User, Projects, Lists, Cards, Comment

# Register your models here.

admin.site.register(User)
admin.site.register(Projects)
admin.site.register(Lists)
admin.site.register(Cards)
admin.site.register(Comment)