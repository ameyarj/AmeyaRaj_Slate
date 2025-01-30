from rest_framework import status, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate, get_user_model
from django.shortcuts import get_object_or_404
from slate_backend import settings
from .models import User, Achievement
from .serializers import UserSerializer, LoginSerializer, AchievementSerializer
from django.core.mail import send_mail
import jwt
from datetime import datetime, timedelta

class IsSchoolUser(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'GET':
            return True
        return request.user.role == 'SCHOOL'

class IsParentOrStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['PARENT', 'STUDENT']

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    print("Request data:", request.data)
    serializer = LoginSerializer(data=request.data)
    print("Serializer valid:", serializer.is_valid())
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        role = serializer.validated_data['role']
        
        user = authenticate(email=email, password=password)
        
        if user is not None and user.role == role:
            refresh = RefreshToken.for_user(user)
            return Response({
                'token': str(refresh.access_token),
                'role': user.role
            })
        
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = serializer.save()
            return Response({
                'message': 'User created successfully',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_students(request):
    students = User.objects.filter(role='STUDENT')
    print(students)
    return Response(UserSerializer(students, many=True).data)

@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password_view(request):
    email = request.data.get('email')
    try:
        user = User.objects.get(email=email)
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, settings.SECRET_KEY, algorithm='HS256')
        
        reset_link = f"http://localhost:3000/reset-password/{token}"
        send_mail(
            'Password Reset',
            f'Click here to reset your password: {reset_link}',
            'noreply@slate.com',
            [email],
            fail_silently=False,
        )
        return Response({'message': 'Password reset email sent'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password_view(request, token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user = User.objects.get(id=payload['user_id'])
        user.set_password(request.data.get('password'))
        user.save()
        return Response({'message': 'Password updated successfully'})
    except (jwt.ExpiredSignatureError, jwt.DecodeError, User.DoesNotExist):
        return Response({'error': 'Invalid token'}, status=400)


class AchievementViewSet(viewsets.ModelViewSet):
    serializer_class = AchievementSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [IsAuthenticated, IsSchoolUser]
        else:
            permission_classes = [IsAuthenticated]  
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'SCHOOL':
            return Achievement.objects.all()
        elif user.role == 'PARENT':
            student = User.objects.get(id=user.linked_student_id)
            return Achievement.objects.filter(student=student)
        elif user.role == 'STUDENT':
            return Achievement.objects.filter(student=user)
        return Achievement.objects.none()

    def perform_create(self, serializer):
        if not self.request.user.role == 'SCHOOL':
            raise permissions.PermissionDenied("Only schools can create achievements")
        serializer.save()

    def create(self, request, *args, **kwargs):
        try:
            print("Request data:", request.data)  
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                print("Validation errors:", serializer.errors) 
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return super().create(request, *args, **kwargs)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)