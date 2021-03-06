from rest_framework import permissions


class IsAdminPrivilege(permissions.BasePermission):
    """
    Custom permission to only allow admins to view and change status of other users
    """

    def has_permission(self, request, view):
        return request.user.moderator == True


class IsProjectCreator_MemberOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow members and creators of an project to edit it (delete and update).
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return (request.user in obj.project_members.all()) or (request.user == obj.project_creator) or (request.user.moderator)


class IsListCreator_MemberOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow members and creators of an project to edit the list (delete and update)
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return (request.user in obj.project.project_members.all()) or (request.user == obj.project.project_creator) or (request.user.moderator)


class IsCardCreator_MemberOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow members and creators of an project to edit the card (delete and update)
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return (request.user in obj.list.project.project_members.all()) or (request.user == obj.list.project.project_creator) or (request.user.moderator)


class IsCommentCreator(permissions.BasePermission):
    """
    Custom permission to allow only card commentor to edit the comment and allows admin to delete
    the comment if not suitable
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        if request.method == 'PUT':
            return request.user == obj.commentor

        if request.method == 'DELETE':
            return request.user == obj.commentor or (request.user.moderator)
