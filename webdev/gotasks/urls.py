from django.urls import path
from gotasks import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('users/', views.UserList.as_view()),
    path('users/<int:pk>/', views.UserDetail.as_view()),
    path('gotasks/', views.ProjectsList.as_view()),
    path('gotasks/<int:pk>/', views.ProjectsDetail.as_view()),
    path('getlist/', views.ListsList.as_view()),
    path('getlist/<int:pk>/', views.ListsDetail.as_view()),
    path('getcards/', views.CardsList.as_view()),
    path('getcards/<int:pk>/', views.CardsDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)