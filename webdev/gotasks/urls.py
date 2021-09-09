from os import name
from django.urls import path
from django.views.generic import base
from gotasks import views
from rest_framework.routers import DefaultRouter
from rest_framework_extensions.routers import ExtendedSimpleRouter
from django.urls import path, include

basic_router = DefaultRouter()
basic_router.register('projects', views.ProjectViewSet)
basic_router.register('users', views.UserViewSet, basename="users")
basic_router.register('dashboard/cards', views.DashboardCardViewset, basename="dash-card")
basic_router.register('dashboard/projects', views.DashboardProjectViewset, basename="dash-project")

router = ExtendedSimpleRouter()
(
    router.register('projects', views.ProjectViewSet, basename='projects').register('lists', views.ListViewSet, basename='projects-lists', parents_query_lookups=['project']).register('cards', views.CardViewSet, basename='lists-cards', parents_query_lookups=['list__project', 'list'])
)

urlpatterns = [
    path('gotasks/', include(router.urls)),
    path('gotasks/', include(basic_router.urls)),
    path('', views.responseGet),
    path('gotasks/login/', views.profile),
]
