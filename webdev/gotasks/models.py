from django.db import models

# Create your models here.

class Members(models.Model):
    username = models.CharField(max_length=100, unique=True)    
    fullname = models.CharField(max_length=100)
    moderator = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username}"

class Projects(models.Model):
    project_name = models.CharField(max_length=100, unique=True)
    project_wiki = models.CharField(max_length=250)
    project_members = models.ManyToManyField(Members)
    project_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['project_created']

    def __str__(self):
        return f"{self.project_name}"

class Lists(models.Model):
    list_name = models.CharField(max_length=100)
    project = models.ForeignKey(to=Projects, on_delete=models.CASCADE)
    list_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['list_created']

    def __str__(self):
        return f"{self.list_name}"

class Cards(models.Model):
    card_name = models.CharField(max_length=100)
    list = models.ForeignKey(to=Lists, on_delete=models.CASCADE)
    assigned = models.ManyToManyField(Members)
    date_created = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField()

    class Meta:
        ordering = ['due_date']

    def __str__(self):
        return f"{self.card_name}"