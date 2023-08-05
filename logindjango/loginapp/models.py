from django.db import models
from datetime import datetime

# Create your models here.

class UserData(models.Model):
    name = models.CharField(max_length=30)
    address = models.TextField()
    
class AttendanceData(models.Model):
    PK_attendance_id = models.IntegerField(primary_key=True)
    FK_emp_id = models.IntegerField()
    FK_showroom_id = models.IntegerField()
    Date = models.DateTimeField()
    Login_Time = models.DateTimeField()
    Logout_Time =  models.DateTimeField(null=True, default=None)
    islate = models.BooleanField(default=None, null=True)
    IsExcused = models.BooleanField(default=None, null=True)
    IsNotPresent = models.BooleanField(default=False)
    Remarks = models.CharField(max_length=100, null=True, default=None)
    TransID = models.CharField(max_length=100, null=True, default=None)
    ISDELETED = models.BooleanField(default=None, null=True)
    FK_USER_DATE_SHIFT_ID = models.CharField(max_length=100, default=None, null=True)
    FK_emp_id1 = models.CharField(max_length=100, null=True, default=None)
    fk_emp_code = models.CharField(max_length=100, null=True, default=None)
    fk_branch_code = models.CharField(max_length=100, null=True, default=None)
    
class LoginLogout(models.Model):
    FK_emp_id = models.IntegerField()
    Login_Time = models.TimeField()
    Logout_Time =  models.TimeField(null=True, default=None)
    fk_emp_code = models.CharField(max_length=100, null=True, default=None)
    Late_Time = models.TimeField(null=True, default=None)
    Working_hours = models.TimeField(null=True, default=None)
    
    
    def save(self, *args, **kwargs):
        if self.Login_Time and self.Logout_Time:
            l_time = datetime.combine(datetime.today(), self.Login_Time)
            lout_time = datetime.combine(datetime.today(), self.Logout_Time)
            hours = lout_time - l_time
              
            self.Working_hours = str(hours)
            
            
        super().save(*args, **kwargs)
        



    