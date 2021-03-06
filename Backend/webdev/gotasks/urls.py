from os import name

from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_extensions.routers import ExtendedSimpleRouter

from gotasks import views

basic_router = DefaultRouter()
basic_router.register('projects', views.ProjectViewSet)
basic_router.register('users', views.UserViewSet, basename="users")
basic_router.register(
    'dashboard/cards', views.DashboardCardViewset, basename="dash-card")
basic_router.register('dashboard/projects',
                      views.DashboardProjectViewset, basename="dash-project")
basic_router.register('comments', views.CommentViewSet, basename="comments")
basic_router.register('usershow', views.UserShowViewSet, basename="usershow")
basic_router.register('loggeduser', views.LoggedinViewSet,
                      basename="loggeduser")

router = ExtendedSimpleRouter()
(
    router.register('projects', views.ProjectViewSet, basename='projects').register('lists', views.ListViewSet, basename='projects-lists', parents_query_lookups=['project']).register(
        'cards', views.CardViewSet, basename='lists-cards', parents_query_lookups=['list__project', 'list']).register('comments', views.CommentViewSet, basename='cards-comments', parents_query_lookups=['card__list__project', 'card__list', 'card'])
)

urlpatterns = [
    path('gotasks/', include(router.urls)),
    path('gotasks/', include(basic_router.urls)),
    path('', views.responseGet),
    path('gotasks/login/', views.profile),
    path('gotasks/logout/', views.log_out),
    path('gotasks/login_check/', views.check_auth),

    path('gotasks/chat/', views.index, name='index'),
    path('gotasks/chat/<str:room_name>/', views.room, name='room'),
]
