# TodoApp - Enterprise-Grade To-Do Application

A modern, full-stack SaaS To-Do application built with React, Node.js, Express, and PostgreSQL. Features teams, projects, task management, real-time collaboration, and enterprise-grade security.

## 🚀 Features

### Core Features
- **User Authentication** - Secure JWT-based authentication with password hashing
- **Team Management** - Create teams, manage members with role-based access control
- **Projects** - Organize tasks into projects with custom colors
- **Task Management** - Create, update, complete, and delete tasks with rich metadata
- **Task Details** - Priority levels, status tracking, due dates, assignments, comments
- **Task Search** - Full-text search across task titles and descriptions

### Advanced Features
- **Multi-user Collaboration** - Assign tasks, leave comments, track activity
- **Task Activities** - Audit trail of all task changes with user attribution
- **Priority & Status Management** - Multiple priority levels (low/medium/high/urgent) and statuses (todo/in_progress/in_review/done)
- **Due Date Management** - Track deadlines with date-based filtering
- **Role-Based Access** - Team owner, admin, and member roles
- **Rate Limiting** - API rate limiting to prevent abuse
- **Input Validation** - Comprehensive validation using Joi
- **Error Handling** - Proper error responses and logging

### SaaS Features
- **Multi-tenant Architecture** - Users can create and manage multiple teams
- **Team Collaboration** - Invite team members with granular permissions
- **Activity Tracking** - Complete audit trail for compliance
- **Task Comments** - Real-time team communication on tasks
- **Persistent Storage** - PostgreSQL database with optimized queries
- **Scalable API** - RESTful API design with proper pagination support

## 🏗️ Architecture

### Backend Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi
- **Security**: bcryptjs for password hashing, CORS, rate limiting

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **State Management**: Zustand
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 📁 Project Structure

```
todo-saas/
├── packages/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── index.ts                 # Main server file
│   │   │   ├── types/                   # TypeScript types and interfaces
│   │   │   ├── database/
│   │   │   │   ├── connection.ts        # Database connection pool
│   │   │   │   └── migrations.ts        # Database schema migrations
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts      # Authentication logic
│   │   │   │   ├── task.service.ts      # Task CRUD and operations
│   │   │   │   └── team.service.ts      # Team and project management
│   │   │   ├── routes/
│   │   │   │   ├── auth.routes.ts       # Auth endpoints
│   │   │   │   ├── task.routes.ts       # Task endpoints
│   │   │   │   └── team.routes.ts       # Team and project endpoints
│   │   │   └── middleware/
│   │   │       └── auth.middleware.ts   # JWT verification
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .env.example
│   │
│   └── frontend/
│       ├── src/
│       │   ├── main.tsx                 # React entry point
│       │   ├── App.tsx                  # Main app component
│       │   ├── index.css                # Global styles
│       │   ├── api/
│       │   │   ├── client.ts            # Axios instance with auth
│       │   │   ├── auth.ts              # Auth API calls
│       │   │   ├── teams.ts             # Teams API calls
│       │   │   └── tasks.ts             # Tasks API calls
│       │   ├── store/
│       │   │   ├── auth.ts              # Auth state (Zustand)
│       │   │   └── tasks.ts             # Tasks state (Zustand)
│       │   ├── components/
│       │   │   ├── Navbar.tsx           # Navigation bar
│       │   │   └── TaskCard.tsx         # Task display component
│       │   └── pages/
│       │       ├── LoginPage.tsx        # Login page
│       │       ├── RegisterPage.tsx     # Registration page
│       │       ├── DashboardPage.tsx    # Teams dashboard
│       │       ├── TeamPage.tsx         # Team detail view
│       │       └── ProjectPage.tsx      # Project/task board
│       ├── index.html
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       ├── tailwind.config.js
│       └── postcss.config.js
│
└── package.json                        # Monorepo root
```

## 🗄️ Database Schema

### Tables
- **users** - User accounts with authentication
- **teams** - Team/organization management
- **team_members** - Team membership with roles
- **projects** - Projects within teams
- **tasks** - Task/to-do items
- **task_labels** - Custom labels for tasks
- **task_label_assignments** - Many-to-many relationship for labels
- **task_comments** - Comments on tasks
- **task_activities** - Audit trail of task changes
- **recurring_tasks** - Configuration for recurring tasks
- **token_blacklist** - Revoked JWT tokens

## 🔐 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT-based authentication with expiry
- ✅ CORS protection
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ SQL injection prevention (parameterized queries)
- ✅ Input validation with Joi
- ✅ Token blacklist for logout
- ✅ Role-based access control

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Teams
- `POST /api/teams` - Create team
- `GET /api/teams` - Get user's teams
- `GET /api/teams/:teamId` - Get team details
- `PATCH /api/teams/:teamId` - Update team
- `POST /api/teams/:teamId/members` - Add team member
- `GET /api/teams/:teamId/members` - Get team members
- `DELETE /api/teams/:teamId/members/:userId` - Remove member
- `PATCH /api/teams/:teamId/members/:userId` - Update member role

### Projects
- `POST /api/teams/:teamId/projects` - Create project
- `GET /api/teams/:teamId/projects` - Get team projects
- `GET /api/projects/:projectId` - Get project
- `PATCH /api/projects/:projectId` - Update project
- `DELETE /api/projects/:projectId` - Delete project

### Tasks
- `POST /api/projects/:projectId/tasks` - Create task
- `GET /api/projects/:projectId/tasks` - Get project tasks
- `GET /api/tasks/:taskId` - Get task details with comments
- `PATCH /api/tasks/:taskId` - Update task
- `DELETE /api/tasks/:taskId` - Delete task
- `POST /api/tasks/:taskId/complete` - Mark task complete
- `POST /api/tasks/:taskId/comments` - Add comment
- `GET /api/projects/:projectId/search` - Search tasks

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- PostgreSQL 13+
- npm or yarn

### Installation & Setup

1. **Clone and navigate to project**
```bash
cd /home/user/projects-testing
```

2. **Install dependencies**
```bash
npm install
npm install --workspace=packages/backend
npm install --workspace=packages/frontend
```

3. **Set up PostgreSQL database**
```bash
# Create database
createdb todo_app

# Run migrations
cd packages/backend
npm run db:migrate
```

4. **Configure environment variables**
```bash
# Backend (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/todo_app
JWT_SECRET=your-super-secret-key-change-in-production
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

5. **Start development servers**
```bash
# From root directory - runs both backend and frontend
npm run dev

# Or separately:
npm run dev --workspace=packages/backend
npm run dev --workspace=packages/frontend
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Health Check: http://localhost:3001/health

## 📝 Usage Examples

### Create a Team
```
POST /api/teams
{ "name": "Marketing Team", "description": "Marketing department" }
```

### Create a Project
```
POST /api/teams/{teamId}/projects
{ "name": "Q1 Campaign", "color": "#3b82f6" }
```

### Create a Task
```
POST /api/projects/{projectId}/tasks
{
  "title": "Design landing page",
  "description": "Create responsive design",
  "priority": "high",
  "dueDate": "2024-01-30"
}
```

### Complete a Task
```
POST /api/tasks/{taskId}/complete
```

### Search Tasks
```
GET /api/projects/{projectId}/search?q=landing
```

## 🧪 Testing

Backend tests:
```bash
npm test --workspace=packages/backend
```

Frontend tests:
```bash
npm test --workspace=packages/frontend
```

## 📦 Build & Deployment

Build for production:
```bash
npm run build
```

This will compile both backend and frontend for production deployment.

## 🔄 Real-time Collaboration

The application is designed with real-time collaboration in mind:
- Multiple users can work on the same team
- Task activity tracking shows who made changes
- Comments enable team communication
- Activity history provides audit trail

## 🎯 Future Enhancements

- WebSocket support for real-time updates
- Recurring task automation
- Advanced filtering and sorting
- Task dependencies and subtasks
- File attachments
- Notifications system
- Calendar view
- Timeline/Gantt chart view
- Mobile app (React Native)
- Advanced analytics and reporting

## 📄 License

This project is provided as-is for educational and development purposes.

## 🤝 Contributing

This is an enterprise-grade application following best practices:
- Type-safe code with TypeScript
- Comprehensive error handling
- RESTful API design
- Scalable architecture
- Security-first approach
