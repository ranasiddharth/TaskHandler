from django.http.response import HttpResponse
from django.shortcuts import redirect
from django.contrib.auth import login, logout
from rest_framework import serializers, views, viewsets, status
from rest_framework.response import Response
from gotasks.models import User, Projects, Lists, Cards, Comment
from gotasks.serializers import UserSerializer, ProjectsSerializer, ListsSerializer, CardsSerializer, DashboardProjectSerializer, DashboardCardSerializer, CommentSerializer, UserShowSerializer
from rest_framework.authtoken.views import Token
from rest_framework.decorators import api_view, authentication_classes
from django.contrib.auth.decorators import login_required
from rest_framework_extensions.mixins import NestedViewSetMixin
import requests
import json
from django.middleware import csrf
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .permissions import IsProjectCreator_MemberOrReadOnly, IsListCreator_MemberOrReadOnly, IsCardCreator_MemberOrReadOnly, IsAdminPrivilege, IsCommentCreator
from django.conf import settings
from django.core.mail import send_mail


import environ
env = environ.Env()
environ.Env.read_env()

# Create your views here.

def profile(request):
    """
    url for making a request at channeli omniport.
    """
    return redirect(env('auth_url'))


@api_view(['GET'])
def responseGet(request):
    """
    If user is maintainer, create user object, if absent, and login.
    """
    code = request.GET.get('code', '')
    # data = json.loads(request.body.decode('utf-8'))
    # auth_code = data['code']
    # print(code)
    payload = {
        'client_id': env('client_id'), 
        'client_secret': env('client_secret'), 
        'grant_type': env('grant_type'), 
        'redirect_uri': 'http://localhost:3000/gotasks/oauth/',
        'code': code
    }
    # print(payload)
    res = requests.post(env('token_url'), data=payload)
    token_response = json.loads(res.content)
    # print(token_response)
    res = requests.get(url=env('get_user_data'), headers={"Authorization": f"{token_response['token_type']} {token_response['access_token']}"})
    user_data = json.loads(res.content)
    username = user_data['username']
    fullname = user_data['person']['fullName']
    email = user_data['contactInformation']['instituteWebmailAddress']
    role = user_data['person']['roles'][1]['role']
    if str(role) == 'Maintainer':
        if User.objects.filter(username=username).count()==0:
            user = User.objects.create(username=username, fullname=fullname, email=email)
            Token.objects.create(user=user)

        if User.objects.get(username=username).is_banned == False:
            user = User.objects.get(username=username)
            token_obj = Token.objects.get(user=user)
            login(request, User.objects.get(username=username))
            res = Response({"csrftoken": csrf.get_token(request), "mytoken": token_obj.key, "sessionid": request.session._session_key}, status=status.HTTP_200_OK)
            res['Access-Control-Allow-Origin'] = 'http://localhost:3000'
            res['Access-Control-Allow-Credentials'] = 'true'
            return res
        else:
            res = Response('You are banned', status=status.HTTP_400_BAD_REQUEST)
            res['Access-Control-Allow-Origin'] = 'http://localhost:3000'
            res['Access-Control-Allow-Credentials'] = 'true'
            return res
    else:
        res = Response('Only site maintainers can access this app', status=status.HTTP_400_BAD_REQUEST)
        res['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        res['Access-Control-Allow-Credentials'] = 'true'
        return res


@api_view(['GET'])
def check_auth(request):
    msg = {
        "loggedin": False
    }
    if request.user.is_authenticated:
        msg["loggedin"] = True
        res = Response(msg, status=status.HTTP_200_OK)
        res['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        res['Access-Control-Allow-Credentials'] = 'true'
        return res
    else:
        res = Response(msg, status=status.HTTP_200_OK)
        res['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        res['Access-Control-Allow-Credentials'] = 'true'
        return res


@api_view(['GET'])
def log_out(request):
    logout(request)
    res = Response("Logged out successfully", status=status.HTTP_200_OK)
    res['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    res['Access-Control-Allow-Credentials'] = 'true'
    return res


class UserViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    """
    Only admins have access to other users data and can change their
    moderator or is_banned status.  
    """
    serializer_class = UserSerializer
    http_method_names = ['get', 'patch']

    def get_queryset(self, *args, **kwargs):
        userid = self.request.user.id
        queryset = User.objects.all().exclude(id=userid)
        return queryset

    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated, IsAdminPrivilege]



class UserShowViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserShowSerializer
    http_method_names='get'
    
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]



class ProjectViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    """
    Only an admin or a project member can modify project details. Non-members 
    can only see the work of other projects and not make changes in it.
    """
    queryset = Projects.objects.all()
    serializer_class = ProjectsSerializer

    def perform_create(self, serializer):
        serializer.validated_data['project_members'].append(self.request.user)
        serializer.save(project_creator=self.request.user)

    def perform_update(self, serializer):
        project_instance = self.get_object()
        leader = project_instance.project_creator
        serializer.validated_data['project_members'].append(leader)
        serializer.save()

    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated, IsProjectCreator_MemberOrReadOnly]



class ListViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    """
    Only admins or members of project can create/edit a list and
    any other authenticated user has view access to the project lists.
    """
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

    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated, IsListCreator_MemberOrReadOnly]



class CardViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    """
    Only project members, admins can edit/create a card and the card must be
    assigned to a project member. Any authenticated user can view the cards.
    """
    queryset =  Cards.objects.all()
    serializer_class =  CardsSerializer

    def create(self, request, *args, **kwargs):
        card_data = request.data
        id = self.kwargs.get("parent_lookup_list")
        user = User.objects.get(fullname=card_data["assigned"])
        list_instance = Lists.objects.get(id=id)

        if request.user.moderator or request.user in list_instance.project.project_members.all():
            if user in list_instance.project.project_members.all():
                obj = Cards.objects.create(card_name=card_data["card_name"], description=card_data["description"], list=list_instance, assigned=user, due_date=card_data["due_date"])
                obj.save()
                subject = 'Gotasks App Card Assignment'
                message = f'Hi {card_data["assigned"]}, you have been assigned the card {card_data["card_name"]} inside the list name {list_instance.list_name} under the project name {list_instance.project}. Due date of the card is {card_data["due_date"]}'
                email_from = settings.EMAIL_HOST_USER
                recipient_list = [user.email, ]
                send_mail( subject, message, email_from, recipient_list )
                serializer = CardsSerializer(obj)
                return Response(serializer.data, status=status.HTTP_201_CREATED) 
            else:
                return Response("Cards can be assigned to project members only", status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response("You do not have permission to perform this action", status=status.HTTP_403_FORBIDDEN)

    def update(self, request, *args, **kwargs):
        card_object = Cards.objects.get(id=self.kwargs.get("pk"))
        card_data = request.data
        id = self.kwargs.get("parent_lookup_list")
        list_instance = Lists.objects.get(id=id)
        assigned_instance = User.objects.get(fullname=card_data["assigned"])

        if request.user.moderator or request.user in list_instance.project.project_members.all():
            card_object.card_name = card_data["card_name"]
            card_object.description = card_data["description"]
            card_object.list = list_instance
            card_object.assigned = assigned_instance
            card_object.due_date = card_data["due_date"]
            card_object.save()
            subject = 'Gotasks App Card Assignment'
            message = f'Hi {card_data["assigned"]}, you have been assigned the card {card_data["card_name"]} inside the list name {list_instance.list_name} under the project name {list_instance.project}. Due date of the card is {card_data["due_date"]}'
            email_from = settings.EMAIL_HOST_USER
            recipient_list = [assigned_instance.email, ]
            send_mail( subject, message, email_from, recipient_list )
            serializer = CardsSerializer(card_object)
            return Response(serializer.data)
            
        else:
            return Response("You do not have permission to perform this action", status=status.HTTP_403_FORBIDDEN)

    def destroy(self, request, *args, **kwargs):
        card_data = self.get_object()
        id = self.kwargs.get("parent_lookup_list")
        list_instance = Lists.objects.get(id=id)
        assigned_instance = card_data.assigned

        if request.user.moderator or request.user in list_instance.project.project_members.all():
            subject = 'Gotasks App Card Assignment'
            message = f'Hi {card_data.assigned.fullname}, the card {card_data.card_name} inside the list name {list_instance.list_name} under the project name {list_instance.project} has been deleted.'
            email_from = settings.EMAIL_HOST_USER
            recipient_list = [assigned_instance.email, ]
            send_mail( subject, message, email_from, recipient_list )
            card_data.delete()
            return Response("message: card has been deleted")

        else:
            return Response("You do not have permission to perform this action", status=status.HTTP_403_FORBIDDEN)

    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated, IsCardCreator_MemberOrReadOnly]



class CommentViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    """
    Comments can be made by any authenticated user, only commentor can
    edit his comment and admin has the right to delete the comment.
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def create(self, request, *args, **kwargs):
        comment_data = request.data
        id = self.kwargs.get("parent_lookup_card")
        card_instance = Cards.objects.get(id=id)

        obj = Comment.objects.create(body=comment_data["body"], commentor=request.user, card=card_instance)
        obj.save()
        serializer = CommentSerializer(obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED) 
        
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated, IsCommentCreator]



class DashboardProjectViewset(viewsets.ModelViewSet):
    """
    Shows the list of projects a user is part of
    """
    serializer_class = DashboardProjectSerializer
    http_method_names=['get']

    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        queryset = Projects.objects.filter(project_members = user)
        return queryset

    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]



class DashboardCardViewset(viewsets.ModelViewSet):
    """
    Shows the cards assigned to a user.
    """
    serializer_class = DashboardCardSerializer
    http_method_names=['get']

    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        queryset = Cards.objects.filter(assigned = user)
        return queryset

    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]