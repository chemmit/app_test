from rest_framework import serializers 
# from django.db.models import fields
from django.contrib.auth.models import User
from .models import AttendanceData

from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'email', 'password']
        extra_kwargs = {
            'password':{
                "write_only":True,
                "required":True,
            }
        }
    def create(self, validated_data):
        password = validated_data.pop('password',None)
        
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
   
    
    
class AttendenceSerializer(serializers.ModelSerializer):
    login_required = serializers.SerializerMethodField()
    late_time = serializers.SerializerMethodField()
    working_hours =  serializers.SerializerMethodField()
    
    class Meta:
        model = AttendanceData
        fields = ['FK_emp_id', 'Date', 'Login_Time', 'Logout_Time', 'IsNotPresent', 'working_hours','late_time','login_required']
    def get_login_required(self,obj):
        if LoginLogout.objects.filter(FK_emp_id=obj.FK_emp_id):
            data = LoginLogout.objects.get(FK_emp_id=obj.FK_emp_id)
            return data.Login_Time
    def get_late_time(self, obj):
        if LoginLogout.objects.filter(FK_emp_id=obj.FK_emp_id):
            data = LoginLogout.objects.get(FK_emp_id=obj.FK_emp_id)
            return data.Late_Time
        
    def get_working_hours(self, obj):
        # if LoginLogout.objects.filter(FK_emp_id=obj.FK_emp_id):
        try:
            data = LoginLogout.objects.get(FK_emp_id=obj.FK_emp_id)
        except:
            return None
            
            
            
        return data.Working_hours
            
        
class LoginLogoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginLogout
        fields = ['FK_emp_id', 'Login_Time', 'Logout_Time', 'Late_Time']
        
