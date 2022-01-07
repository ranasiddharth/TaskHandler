from ckeditor.fields import RichTextField
from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.


class User(AbstractUser):
    username = models.CharField(max_length=100, unique=True)
    fullname = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    moderator = models.BooleanField(default=False)
    is_banned = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username}"


class Projects(models.Model):
    project_name = models.CharField(max_length=100, unique=True, blank=False)
    project_wiki = RichTextField()
    project_creator = models.ForeignKey(
        to=User, on_delete=models.CASCADE, related_name='creator')
    project_members = models.ManyToManyField(User)
    project_created = models.DateTimeField(auto_now_add=True)
    is_completed = models.BooleanField(default=False)

    class Meta:
        ordering = ['project_created']

    def __str__(self):
        return f"{self.project_name}"


class Lists(models.Model):
    list_name = models.CharField(max_length=100)
    project = models.ForeignKey(to=Projects, on_delete=models.CASCADE)
    list_created = models.DateTimeField(auto_now_add=True)
    is_completed = models.BooleanField(default=False)

    class Meta:
        ordering = ['list_created']
        unique_together = ('list_name', 'project')

    def __str__(self):
        return f"{self.list_name}"


class Cards(models.Model):
    card_name = models.CharField(max_length=100)
    description = models.CharField(max_length=250, blank=False, null=False)
    list = models.ForeignKey(to=Lists, on_delete=models.CASCADE)
    assigned = models.ForeignKey(
        to=User, on_delete=models.CASCADE, related_name='cards')
    date_created = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField()
    is_completed = models.BooleanField(default=False)

    class Meta:
        ordering = ['due_date']
        unique_together = ('card_name', 'list')

    def __str__(self):
        return f"{self.card_name}"


class Comment(models.Model):
    body = models.CharField(max_length=200)
    card = models.ForeignKey(
        Cards, on_delete=models.CASCADE, related_name="comments")
    commentor = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="yourcomments")
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.body} - by {self.commentor}"

    class Meta:
        ordering = ['id']
