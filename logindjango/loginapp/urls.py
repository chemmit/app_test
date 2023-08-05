from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
 
    path('', views.home, name='home'),
    path('signup', views.user_signup, name='signup'),
    path('logout',views.logout, name='logout'),
    path('attendence_data',views.attendence_data, name='attendenceData'),
     path('get_attendence_data/<str:emp_code>',views.get_attendence_data, name='getAttendenceData'),
    path('demo',views.demo,name='demo'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

]
