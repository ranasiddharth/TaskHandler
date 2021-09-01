from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from gotasks.models import User, Projects, Lists, Cards
from gotasks.serializers import UserSerializer, ProjectsSerializer, ListsSerializer, CardsSerializer
from rest_framework import generics
from rest_framework.authentication import BasicAuthentication, SessionAuthentication, TokenAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser, IsAuthenticatedOrReadOnly

# Create your views here.


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]


class ProjectsList(generics.ListCreateAPIView):
    queryset = Projects.objects.all()
    serializer_class = ProjectsSerializer
    
    def perform_create(self, serializer):
        serializer.save(project_creator=self.request.user)

    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]


class ProjectsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Projects.objects.all()
    serializer_class = ProjectsSerializer
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]


class ListsList(generics.ListCreateAPIView):
    queryset = Lists.objects.all()
    serializer_class = ListsSerializer
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]


class ListsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Lists.objects.all()
    serializer_class = ListsSerializer
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]


class CardsList(generics.ListCreateAPIView):
    queryset =  Cards.objects.all()
    serializer_class =  CardsSerializer
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]


class CardsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset =  Cards.objects.all()
    serializer_class =  CardsSerializer
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]