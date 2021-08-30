from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from gotasks.models import Members, Projects, Lists, Cards
from gotasks.serializers import ProjectsSerializer, ListsSerializer, CardsSerializer
from rest_framework import generics
# from rest_framework.authentication import BasicAuthentication, SessionAuthentication, TokenAuthentication
# from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser, IsAuthenticatedOrReadOnly

# Create your views here.

class ProjectsList(generics.ListCreateAPIView):
    queryset = Projects.objects.all()
    serializer_class = ProjectsSerializer
    # authentication_classes = [BasicAuthentication]
    # permission_classes = [IsAuthenticated]

class ProjectsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Projects.objects.all()
    serializer_class = ProjectsSerializer
    # authentication_classes = [BasicAuthentication]
    # permission_classes = [IsAuthenticated]

class ListsList(generics.ListCreateAPIView):
    queryset = Lists.objects.all()
    serializer_class = ListsSerializer
    # authentication_classes = [BasicAuthentication]
    # permission_classes = [IsAuthenticated]


class ListsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Lists.objects.all()
    serializer_class = ListsSerializer
    # authentication_classes = [BasicAuthentication]
    # permission_classes = [IsAuthenticated]

class CardsList(generics.ListCreateAPIView):
    queryset =  Cards.objects.all()
    serializer_class =  CardsSerializer
    # authentication_classes = [BasicAuthentication]
    # permission_classes = [IsAuthenticated]


class CardsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset =  Cards.objects.all()
    serializer_class =  CardsSerializer
    # authentication_classes = [BasicAuthentication]
    # permission_classes = [IsAuthenticated]