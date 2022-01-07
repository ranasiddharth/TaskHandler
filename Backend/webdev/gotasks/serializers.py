from rest_framework import serializers

from gotasks.models import Cards, Comment, Lists, Projects, User


class ProjectsSerializer(serializers.ModelSerializer):
    project_creator = serializers.ReadOnlyField(
        source='project_creator.fullname')

    class Meta:
        model = Projects
        fields = ['id', 'project_name', 'project_wiki', 'project_creator',
                  'project_members', 'project_created', 'is_completed']


class ListsSerializer(serializers.ModelSerializer):
    project = serializers.ReadOnlyField(source='project.project_name')

    class Meta:
        model = Lists
        fields = ['id', 'list_name', 'list_created', 'project', 'is_completed']
        read_only_fields = ['project']


class CardsShowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cards
        fields = ['id', 'card_name', 'list',
                  'assigned', 'date_created', 'due_date']


class CardsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cards
        fields = ['id', 'card_name', 'list', 'description',
                  'assigned', 'date_created', 'due_date', 'is_completed']


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'body', 'commentor', 'card', 'timestamp']
        read_only_fields = ['id', 'commentor', 'card', 'timestamp']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'fullname',
                  'email', 'moderator', 'is_banned']
        read_only_fields = ['id', 'username', 'fullname', 'email']


class UserShowSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'fullname']


class DashboardProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projects
        fields = "__all__"
        depth = 1


class DashboardCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cards
        fields = "__all__"
        depth = 1
