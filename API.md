# TodoApp API Documentation

Complete API reference for the TodoApp enterprise SaaS application.

## Base URL
```
http://localhost:3001/api
```

## Authentication

All endpoints (except `/auth/register` and `/auth/login`) require an Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Response Format

All responses follow this format:
```json
{
  "success": true/false,
  "data": { /* response data */ },
  "error": "error message if applicable",
  "message": "additional info"
}
```

## Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

---

## Authentication Endpoints

### Register
Create a new user account.

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Validation:**
- Email must be valid and unique
- Username must be 3-30 alphanumeric characters
- Password must be at least 8 characters

---

### Login
Authenticate user and receive JWT token.

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Get Current User
Retrieve authenticated user's profile.

```http
GET /auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "avatar_url": "https://example.com/avatar.jpg",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### Logout
Invalidate current JWT token.

```http
POST /auth/logout
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Team Endpoints

### Create Team
Create a new team.

```http
POST /teams
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Marketing Team",
  "description": "Our marketing department"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Marketing Team",
    "description": "Our marketing department",
    "owner_id": "uuid",
    "avatar_url": null,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### Get User Teams
List all teams the user is a member of.

```http
GET /teams
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Marketing Team",
      "description": "Our marketing department",
      "owner_id": "uuid",
      "avatar_url": null,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Get Team Details
Retrieve team information, members, and projects.

```http
GET /teams/:teamId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "team": { /* team object */ },
    "members": [ /* member objects */ ],
    "projects": [ /* project objects */ ]
  }
}
```

---

### Update Team
Update team information.

```http
PATCH /teams/:teamId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Team Name",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* updated team object */ }
}
```

---

### Add Team Member
Invite a user to the team.

```http
POST /teams/:teamId/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "uuid",
  "role": "member"
}
```

**Roles:** `owner`, `admin`, `member`

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "team_id": "uuid",
    "user_id": "uuid",
    "role": "member",
    "joined_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### Get Team Members
List all members of a team.

```http
GET /teams/:teamId/members
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "team_id": "uuid",
      "user_id": "uuid",
      "role": "owner",
      "joined_at": "2024-01-15T10:30:00Z",
      "email": "user@example.com",
      "username": "johndoe",
      "avatar_url": null
    }
  ]
}
```

---

### Remove Team Member
Remove a user from the team.

```http
DELETE /teams/:teamId/members/:userId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Member removed"
}
```

---

### Update Member Role
Change a team member's role.

```http
PATCH /teams/:teamId/members/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "admin"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* updated member object */ }
}
```

---

## Project Endpoints

### Create Project
Create a new project in a team.

```http
POST /teams/:teamId/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Q1 Campaign",
  "description": "First quarter marketing campaign",
  "color": "#3b82f6"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "team_id": "uuid",
    "name": "Q1 Campaign",
    "description": "First quarter marketing campaign",
    "color": "#3b82f6",
    "owner_id": "uuid",
    "is_default": false,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### Get Team Projects
List all projects in a team.

```http
GET /teams/:teamId/projects
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [ /* project objects */ ]
}
```

---

### Get Project
Retrieve project details.

```http
GET /projects/:projectId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* project object */ }
}
```

---

### Update Project
Update project information.

```http
PATCH /projects/:projectId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Project Name",
  "color": "#ef4444"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* updated project object */ }
}
```

---

### Delete Project
Delete a project and all its tasks.

```http
DELETE /projects/:projectId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Project deleted"
}
```

---

## Task Endpoints

### Create Task
Create a new task in a project.

```http
POST /projects/:projectId/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Design homepage",
  "description": "Create responsive homepage design",
  "priority": "high",
  "status": "todo",
  "dueDate": "2024-01-30T23:59:59Z",
  "assignedTo": "uuid"
}
```

**Priority:** `low`, `medium`, `high`, `urgent`  
**Status:** `backlog`, `todo`, `in_progress`, `in_review`, `done`, `archived`

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "project_id": "uuid",
    "title": "Design homepage",
    "description": "Create responsive homepage design",
    "status": "todo",
    "priority": "high",
    "due_date": "2024-01-30T23:59:59Z",
    "assigned_to": "uuid",
    "created_by": "uuid",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "completed_at": null
  }
}
```

---

### Get Project Tasks
List tasks in a project with optional filtering.

```http
GET /projects/:projectId/tasks?status=in_progress&priority=high&assignedTo=uuid
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` - Filter by status
- `priority` - Filter by priority
- `assignedTo` - Filter by assigned user

**Response (200):**
```json
{
  "success": true,
  "data": [ /* task objects */ ]
}
```

---

### Get Task Details
Retrieve task details with comments and activity.

```http
GET /tasks/:taskId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "task": { /* task object */ },
    "comments": [ /* comment objects */ ],
    "activity": [ /* activity objects */ ]
  }
}
```

---

### Update Task
Update task information.

```http
PATCH /tasks/:taskId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "in_progress",
  "priority": "urgent",
  "assignedTo": "uuid"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* updated task object */ }
}
```

---

### Complete Task
Mark a task as done.

```http
POST /tasks/:taskId/complete
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* completed task object with status='done' */ }
}
```

---

### Delete Task
Delete a task permanently.

```http
DELETE /tasks/:taskId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task deleted"
}
```

---

### Add Task Comment
Add a comment to a task.

```http
POST /tasks/:taskId/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "This looks good, ready for review!"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "task_id": "uuid",
    "user_id": "uuid",
    "content": "This looks good, ready for review!",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### Search Tasks
Search for tasks by title or description.

```http
GET /projects/:projectId/search?q=homepage
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [ /* matching task objects */ ]
}
```

---

## Error Examples

### 400 - Bad Request
```json
{
  "error": "\"email\" must be a valid email"
}
```

### 401 - Unauthorized
```json
{
  "error": "Invalid or expired token"
}
```

### 404 - Not Found
```json
{
  "error": "Task not found"
}
```

### 409 - Conflict
```json
{
  "error": "Email or username already exists"
}
```

---

## Rate Limiting

The API implements rate limiting:
- **Limit:** 100 requests per 15 minutes per IP
- **Header:** `X-RateLimit-Remaining`

---

## Performance Considerations

- Use filtering to reduce result sets
- Implement pagination for large lists
- Cache user teams to reduce API calls
- Use search for finding specific tasks
- Task activity is automatically tracked

---

## Versioning

Current API version: `1.0.0`  
No breaking changes planned.
