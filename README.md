# ProManage - Full Stack Project Management

ProManage is a production-ready, full-stack project management application built to help users seamlessly track projects and tasks.

## 🚀 Tech Stack

**Backend:**
- Python 3
- Django REST Framework (DRF)
- PostgreSQL
- JWT Authentication (SimpleJWT)
- bcrypt (Password Hashing)

**Frontend:**
- React (Vite)
- TypeScript
- Tailwind CSS
- React Router DOM
- Axios (API Client)
- React Hook Form + Yup (Validation)
- Context API (State Management)
- Jest + React Testing Library (Unit Testing)

**DevOps:**
- Docker & Docker Compose

---

## 🏗️ Features

### Authentication
- User registration and login
- Secure JWT token management (Access & Refresh tokens)
- Protected frontend routes

### Project Management
- Dashboard with a list of user projects
- Create, Read, Update, Delete (CRUD) operations on projects
- Paginated and searchable project lists
- Strict ownership checks (users only see their own data)

### Task Management
- Nested tasks inside projects
- Track task status (`To Do`, `In Progress`, `Done`)
- Filter tasks by status
- Deadlines / Due dates

### UI / UX
- Premium dark-mode aesthetics using Tailwind CSS
- Responsive design (Mobile + Desktop)
- Smooth loading states and Toast error boundaries
- Intuitive card-based UI

---

## ⚙️ Setup Instructions

### Prerequisites
Make sure you have [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

### Run with Docker (Recommended)

1. Clone this repository.
2. Navigate to the root directory containing `docker-compose.yml`.
3. Run the following command to start the entire stack:
   ```bash
   docker-compose up --build
   ```
4. Access the app:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8000`

### Run Locally (Without Docker)

#### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `source venv/bin/activate` (Linux/Mac) or `venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Create a `.env` file from the provided `.env.example` (or use defaults in `settings.py` for SQLite).
6. Run migrations: `python manage.py makemigrations accounts projects tasks` and `python manage.py migrate`
7. Start server: `python manage.py runserver`

#### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite dev server: `npm run dev`

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user (Returns JWT access & refresh tokens)
- `GET /api/auth/profile/` - Get current authenticated user profile
- `POST /api/auth/token/refresh/` - Refresh JWT access token

### Projects
- `GET /api/projects/` - List user's projects (Supports `?search=` and `?page=`)
- `POST /api/projects/` - Create a project
- `GET /api/projects/:id/` - Retrieve project details
- `PUT /api/projects/:id/` - Update a project
- `DELETE /api/projects/:id/` - Delete a project

### Tasks
- `GET /api/tasks/` - List user's tasks (Supports `?project=ID`, `?status=`, `?search=`)
- `POST /api/tasks/` - Create a task
- `GET /api/tasks/:id/` - Retrieve task details
- `PUT /api/tasks/:id/` - Update a task
- `DELETE /api/tasks/:id/` - Delete a task
