from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.http import HttpResponse, JsonResponse
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from gotasks.models import User, Projects, Lists, Cards
from gotasks.serializers import ListsShowSerializer, UserSerializer, ProjectsSerializer, ListsSerializer, CardsSerializer, CardsShowSerializer
from rest_framework_extensions.mixins import NestedViewSetMixin
import requests
import json
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser, IsAuthenticatedOrReadOnly

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
        login(request, User.objects.get(username=username))
        return redirect('http://127.0.0.1:8000/gotasks/projects')
    else:
        return HttpResponse('Not Authenticated')



class UserViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    http_method_names = ['get']
    permission_classes = [IsAuthenticated]


class ProjectViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = Projects.objects.all()
    serializer_class = ProjectsSerializer

    def perform_create(self, serializer):
        serializer.save(project_creator=self.request.user)

    permission_classes = [IsAuthenticated]


class ListList(viewsets.ModelViewSet):
    queryset = Lists.objects.all()
    serializer_class = ListsShowSerializer
    http_method_names = ['get']
    permission_classes = [IsAuthenticated]


class ListViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = Lists.objects.all()
    serializer_class = ListsSerializer

    def perform_create(self, serializer):
        id = self.kwargs.get("parent_lookup_project")
        project_instance = Projects.objects.get(id=id)
        serializer.save(project=project_instance)

    permission_classes = [IsAuthenticated]


class CardList(viewsets.ModelViewSet):
    queryset = Cards.objects.all()
    serializer_class = CardsShowSerializer
    http_method_names = ['get']
    permission_classes = [IsAuthenticated]


class CardViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset =  Cards.objects.all()
    serializer_class =  CardsSerializer

    def perform_create(self, serializer):
        id = self.kwargs.get("parent_lookup_list")
        list_instance = Lists.objects.get(id=id)
        serializer.save(list=list_instance)

    permission_classes = [IsAuthenticated]