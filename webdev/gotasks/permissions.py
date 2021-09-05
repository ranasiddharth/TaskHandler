from .serializers import ProjectsSerializer
from .models import Projects
from rest_framework import permissions


class IsProjectCreator_MemberOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow members and creators of an project to edit it (delete and update).
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return (request.user in obj.project_members.all()) or (request.user == obj.project_creator)


class IsListCreator_MemberOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow members and creators of an project to edit the list (delete and update)
    """
    # def has_permission(self, request, view):
    #     if request.method == 'POST':
    #         user_id = getattr(request.user, 'id')
    #         project_id = request.GET['id']
    #         if project_id is not None:
    #             project_obj = Projects.objects.get(id=project_id)
    #             serializer = ProjectsSerializer(project_obj)
    #             return (user_id == serializer.data['project_creator']) or (user_id in serializer.data['project_members'].all()) 
    #         return False
    #     return True


    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return (request.user in obj.project.project_members.all()) or (request.user == obj.project.project_creator)


class IsCardCreator_MemberOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow members and creators of an project to edit the card (delete and update)
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return (request.user in obj.list.project.project_members.all()) or (request.user == obj.list.project.project_creator)