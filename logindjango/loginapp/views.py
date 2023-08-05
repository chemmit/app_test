from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
# from rest_framework_jwt.serializers import JSONWebTokenSerializer
# from rest_framework_jwt.views import ObtainJSONWebToken
from django.contrib.auth.models import User
from .models import AttendanceData,LoginLogout



from .serializer import *

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['name'] = user.username
        # ...

        return token


# Create your views here.



   

@api_view(['GET'])
def home(request):
    return Response({'message':'Homepage'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_signup(request):
    
    if request.method == 'POST':
        print(request.data)
        serializer_data = UserSerializer(data = request.data)
        
       
        if User.objects.filter(username=request.data['username']).exists():
             return Response({'error':'Already in use'}, status=200)
        if serializer_data.is_valid():
            serializer_data.save()
            return Response(serializer_data.data, status=201)
    
    return Response(serializer_data.errors, status=400)

@api_view(['GET'])
def attendence_data(request):
    try:
        data = AttendanceData.objects.all()
    except Exception as e:
        print('exception')
   
    # if(not data):   print("excep0tion")
    serializer = AttendenceSerializer(data, many=True)
    return Response(serializer.data, status=200)

@api_view(['GET'])
def get_attendence_data(request, emp_code):
    data = AttendanceData.objects.filter( fk_emp_code=emp_code)
    # print(data)
    
    serializer = AttendenceSerializer(data, many=True)
    return Response(serializer.data, status=200)

# @api_view(['GET'])
# def get_login_logout_time(request, emp_code):
#     try:
#         data = LoginLogout.objects.get(fk_emp_code=emp_code)
        
#     except:
#         return Response({'error':'nOt found'})
#     serializer = AttendenceSerializer(data, many=True)
#     return Response(serializer.data, status=200)
    

@api_view(['post'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        # print('in',request.data['refresh_token'])
        refresh_token = request.data['refresh_token']
        token = RefreshToken(refresh_token)
        # print('pass token')
        # print(token)
        token.blacklist()
        return Response({'message': 'Successfully logged out'})
    except Exception as e:
        return Response({'error': "Invalid token or token doesn't exists"})
        
        
@api_view(['POST'])    
def demo(request):
    if request.method == 'POST':
        # print(request.data)
        serializer_data = LoginLogoutSerializer(data = request.data, partial=True)
        # print('kll',serializer_data.is_valid())
        # print('kll',serializer_data.errors)
        
        if serializer_data.is_valid():
            # print('iam')
            serializer_data.save()
            return Response(serializer_data.data, status=201)
    
    return Response(serializer_data.errors, status=400)
    
    

