from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.contrib.auth.hashers import make_password
from django.db import models
from django.core.exceptions import ValidationError

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.password = make_password(password) 
        
        if extra_fields.get('role') == 'PARENT' and not extra_fields.get('linked_student_id'):
            raise ValidationError('Parent must have a linked student ID')
            
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'SCHOOL')  
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    ROLES = (
        ('SCHOOL', 'School'),
        ('PARENT', 'Parent'),
        ('STUDENT', 'Student'),
    )

    username = None
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLES)
    linked_student_id = models.IntegerField(null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['role']

    objects = CustomUserManager()

    def save(self, *args, **kwargs):
        if not self.pk and self.role == 'STUDENT':
            last_student = User.objects.filter(role='STUDENT').order_by('-id').first()
            self.id = (last_student.id + 1 if last_student else 101)
            
        super().save(*args, **kwargs)

        if self.role == 'STUDENT':
            self.linked_student_id = self.id
            super().save(*args, **kwargs)

    def clean(self):
        if self.role == 'PARENT' and not self.linked_student_id:
            raise ValidationError('Parent must have a linked student ID')

    def __str__(self):
        return self.email

class Achievement(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    school_name = models.CharField(max_length=255)
    achievement = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date_created']