# Slate Backend - Role-Based Authentication System

A Django-based authentication system with role-based access control for schools, parents, and students.

## Features

- Role-based login system (School/Parent/Student)
- JWT authentication
- Student achievement management
- Password reset functionality
- Role-specific dashboards
- Secure API endpoints

## Tech Stack

- Backend: Django + Django REST Framework
- Database: PostgreSQL
- Authentication: JWT (Simple JWT)
- Frontend: React + Material-UI

## For the Forget and Reset Password
I have coded that part but for that to run I need to register the app on gmail or any other email service to get the email working 
add redirect urls and get client id and secret. Also needed to create app password. 
If you want u change add the email and password in setting.py  and it should work

## Extra abilities
signup for different roles.

## Setup Instructions

### Prerequisites
- Python 3.8+
- PostgreSQL
- Node.js 14+
- npm/yarn

### Backend Setup

1. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  
venv\Scripts\activate     
```

2. Install dependencies:
```bash
cd backend/slate_backend
pip install -r requirements.txt
```

3. Configure PostgreSQL:
```sql
CREATE DATABASE slate_db;
CREATE USER slate WITH PASSWORD 'slatepostgres';
GRANT ALL PRIVILEGES ON DATABASE slate_db TO slate;
```

4. Run migrations:
```bash
# in /backend/slate_backend/slate_backend
python manage.py migrate
```

5. Start development server:
```bash
# in /backend/slate_backend/slate_backend
python manage.py runserver
```

### Frontend Setup

1. Install dependencies:
```bash
cd slate_frontend
npm install
```

2. Start development server:
```bash
npm run dev
```



## API Endpoints

### Authentication
- `POST /auth/login/` - User login
- `POST /auth/signup/` - User registration
- `POST /auth/forgot-password/` - Request password reset
- `POST /auth/reset-password/<token>/` - Reset password

### Student Achievements
- `GET /student/achievements/` - List achievements
- `POST /student/achievements/` - Create achievement (School only)
- `GET /student/achievements/{id}/` - View specific achievement

## Database Schema

### User Model
```python
class User(AbstractUser):
    email = EmailField(unique=True)
    role = CharField(choices=['SCHOOL', 'PARENT', 'STUDENT'])
    linked_student_id = IntegerField(null=True)
```

### Achievement Model
```python
class Achievement(Model):
    student = ForeignKey(User)
    name = CharField()
    school_name = CharField()
    achievement = TextField()
    date_created = DateTimeField()
```

## Role-Based Access

- **School Users:**
  - Can create and manage student achievements
  - Full access to achievement records

- **Parent Users:**
  - Can view linked student's achievements
  - Must have linked_student_id

- **Student Users:**
  - Can view their own achievements
  - Auto-assigned student ID on creation

## Security Features

- Password hashing using Django's default PBKDF2
- JWT token authentication
- Role-based authorization
- CORS configuration for frontend access
- Password reset via email(just code for this part is available if you want u change add the email and password in setting.py  and it should work)

