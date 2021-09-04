from os import name
from django.urls import path
from gotasks import views
from rest_framework.routers import DefaultRouter
from rest_framework_extensions.routers import ExtendedSimpleRouter
from django.urls import path, include

basic_router = DefaultRouter()
basic_router.register('projects', views.ProjectViewSet)
basic_router.register('users', views.UserViewSet)
basic_router.register('lists', views.ListList)
basic_router.register('cards', views.CardList)

router = ExtendedSimpleRouter()
(
    router.register('projects', views.ProjectViewSet, basename='projects').register('lists', views.ListViewSet, basename='projects-lists', parents_query_lookups=['project']).register('cards', views.CardViewSet, basename='lists-cards', parents_query_lookups=['list__project', 'list'])
)

urlpatterns = [
    path('gotasks/', include(router.urls)),
    path('gotasks/', include(basic_router.urls)),
    path('', views.responseGet),
    path('login/', views.profile),
]
