from django.shortcuts import redirect
from django.contrib.auth import login
from rest_framework import serializers, views, viewsets, status
from rest_framework.response import Response
from gotasks.models import User, Projects, Lists, Cards
from gotasks.serializers import UserSerializer, ProjectsSerializer, ListsSerializer, CardsSerializer, DashboardProjectSerializer, DashboardCardSerializer
from rest_framework_extensions.mixins import NestedViewSetMixin
import requests
import json
from rest_framework.permissions import IsAuthenticated
from .permissions import IsProjectCreator_MemberOrReadOnly, IsListCreator_MemberOrReadOnly, IsCardCreator_MemberOrReadOnly, IsAdminPrivilege

import environ
env = environ.Env()
environ.Env.read_env()

# Create your views here.

def profile(request):
    return redirect(env('auth_url'))


def responseGet(request):
    code = request.GET.get('code', '')
    payload = {
        'client_id': env('client_id'), 
        'client_secret': env('client_secret'), 
        'grant_type': env('grant_type'), 
        'redirect_uri': env('redirect_uri'), 
        'code': code
    }
    res = requests.post(env('token_url'), data=payload)
    token_response = json.loads(res.content)
    res = requests.get(url=env('get_user_data'), headers={"Authorization": f"{token_response['token_type']} {token_response['access_token']}"})
    user_data = json.loads(res.content)
    username = user_data['username']
    fullname = user_data['person']['fullName']
    email = user_data['contactInformation']['instituteWebmailAddress']
    role = user_data['person']['roles'][1]['role']
    if str(role) == 'Maintainer':
        if User.objects.filter(username=username).count()==0:
            User.objects.create(username=username, fullname=fullname, email=email)
        if User.objects.get(username=username).is_banned == False:
            login(request, User.objects.get(username=username))
        else:
            return redirect('https://channeli.in/')
        return redirect('http://127.0.0.1:8000/gotasks/')
    else:
        return redirect('https://channeli.in/')


class UserViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    serializer_class = UserSerializer
    http_method_names = ['get', 'patch']

    def get_queryset(self, *args, **kwargs):
        userid = self.request.user.id
        queryset = User.objects.all().exclude(id=userid)
        return queryset

    # def partial_update(self, request, *args, **kwargs):
    #     user_object = self.get_object()
    #     data = request.data
    #     user_object.moderator = data.get("moderator", user_object.moderator)
    #     user_object.is_banned = data.get("is_banned", user_object.is_banned)
    #     user_object.save()
    #     serializer = UserSerializer(user_object)
    #     return Response(serializer.data)

    permission_classes = [IsAuthenticated, IsAdminPrivilege]



class ProjectViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = Projects.objects.all()
    serializer_class = ProjectsSerializer

    def perform_create(self, serializer):
        serializer.validated_data['project_members'].append(self.request.user)
        serializer.save(project_creator=self.request.user)

    permission_classes = [IsAuthenticated, IsProjectCreator_MemberOrReadOnly]



class ListViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = Lists.objects.all()
    serializer_class = ListsSerializer
    
    def create(self, request, *args, **kwargs):
        list_data = request.data
        id = self.kwargs.get("parent_lookup_project")
        project_instance = Projects.objects.get(id=id)

        if request.user.moderator or request.user in project_instance.project_members.all():
            obj = Lists.objects.create(list_name=list_data["list_name"], project=project_instance)
            obj.save()
            serializer = ListsSerializer(obj)
            return Response(serializer.data, status=status.HTTP_201_CREATED) 
        else:
            return Response("You do not have permission to perform this action", status=status.HTTP_403_FORBIDDEN)

    permission_classes = [IsAuthenticated, IsListCreator_MemberOrReadOnly]



class CardViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset =  Cards.objects.all()
    serializer_class =  CardsSerializer

    def create(self, request, *args, **kwargs):
        card_data = request.data
        id = self.kwargs.get("parent_lookup_list")
        user = User.objects.get(id=card_data["assigned"])
        list_instance = Lists.objects.get(id=id)

        if request.user.moderator or request.user in list_instance.project.project_members.all():
            if user in list_instance.project.project_members.all():
                obj = Cards.objects.create(card_name=card_data["card_name"], list=list_instance, assigned=user, due_date=card_data["due_date"])
                obj.save()
                serializer = CardsSerializer(obj)
                return Response(serializer.data, status=status.HTTP_201_CREATED) 
            else:
                return Response("Cards can be assigned to project members only", status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response("You do not have permission to perform this action", status=status.HTTP_403_FORBIDDEN)

    permission_classes = [IsAuthenticated, IsCardCreator_MemberOrReadOnly]



class DashboardProjectViewset(viewsets.ModelViewSet):
    serializer_class = DashboardProjectSerializer
    http_method_names=['get']

    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        queryset = Projects.objects.filter(project_members = user)
        return queryset

    permission_classes = [IsAuthenticated]



class DashboardCardViewset(viewsets.ModelViewSet):
    serializer_class = DashboardCardSerializer
    http_method_names=['get']

    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        queryset = Cards.objects.filter(assigned = user)
        return queryset

    permission_classes = [IsAuthenticated]