from django.contrib import admin

from .models import Cards, Comment, Lists, Projects, User

# Register your models here.

admin.site.register(User)
admin.site.register(Projects)
admin.site.register(Lists)
admin.site.register(Cards)
admin.site.register(Comment)