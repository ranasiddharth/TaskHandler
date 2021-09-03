from rest_framework import serializers
from gotasks.models import User, Projects, Lists, Cards


class UserSerializer(serializers.ModelSerializer):
    creator = serializers.StringRelatedField(many=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'fullname', 'creator']


class ProjectsSerializer(serializers.ModelSerializer):
    project_creator = serializers.ReadOnlyField(source='project_creator.fullname')
    project_members = serializers.SlugRelatedField(many=True, queryset=User.objects.all(), slug_field='fullname')  

    class Meta:
        model = Projects
        fields = ['id', 'project_name', 'project_wiki', 'project_creator', 'project_members', 'project_created']


class ListsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lists
        fields = ['id', 'list_name', 'project', 'list_created']


class CardsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cards
        fields = ['id', 'card_name', 'list', 'assigned', 'date_created', 'due_date']