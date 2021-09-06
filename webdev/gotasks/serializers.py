from django.http.request import HttpRequest
from django.http.response import HttpResponse, JsonResponse
from rest_framework import response, serializers
from gotasks.models import User, Projects, Lists, Cards


class ProjectsSerializer(serializers.ModelSerializer):
    project_creator = serializers.ReadOnlyField(source='project_creator.fullname')
    project_members = serializers.SlugRelatedField(many=True, queryset=User.objects.all(), slug_field='fullname')  

    class Meta:
        model = Projects
        fields = ['id', 'project_name', 'project_wiki', 'project_creator', 'project_members', 'project_created']


class ListsShowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lists
        fields = ['id', 'list_name', 'project', 'list_created']


class ListsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lists
        fields = ['id', 'list_name', 'list_created']


class CardsShowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cards
        fields = ['id', 'card_name', 'list', 'assigned', 'date_created', 'due_date']


class CardsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cards
        fields = ['id', 'card_name', 'assigned', 'date_created', 'due_date']


class UserSerializer(serializers.ModelSerializer):
    creator = serializers.StringRelatedField(many=True)
    cards = CardsShowSerializer(many=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'fullname', 'creator', 'cards']