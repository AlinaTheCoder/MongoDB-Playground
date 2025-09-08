📝 Task Manager API

A Node.js + Express backend with MongoDB (Mongoose) for managing tasks and user authentication.
Includes secure JWT-based authentication, role-based authorization, logging middleware, and advanced task search & filter functionality.

⚡ Features

🔑 Authentication & Authorization

Register & Login users with bcrypt password hashing

Issue Access & Refresh tokens

Token refresh with rotation & validation

Logout (invalidate refresh tokens)

Middleware-protected routes

Role-based access (admin, user)

👤 User Management

Register, login, and delete users

Cascade delete: when a user is removed → their tasks and refresh tokens are deleted automatically

✅ Task Management

CRUD operations for tasks

Each task owned by a user

Admin can manage all tasks, users manage their own

Search & filter tasks by title, status, etc.

⚙️ Admin Features

View all users

Delete a user (with cascade delete of tasks & tokens)

View all tasks

Delete any task

🛡️ Security

Password hashing with bcrypt

Access tokens (1h expiry)

Refresh tokens (7d expiry, stored in DB)

Middleware for token validation

🧰 Custom Middlewares

Logger → Logs each request (method | url | timestamp) to requests_logs.txt

Role Authorizer → Ensures only admin can access admin routes

📂 Project Structure
.
├── models/
│ ├── User.js # User schema & cascade delete hooks
│ ├── Task.js # Task schema
│ └── Token.js # Refresh token schema
├── controllers/
│ ├── authController.js # register, login, refresh, logout
│ ├── taskController.js # CRUD + search & filter
│ └── adminController.js # admin-specific routes
├── middleware/
│ ├── authMiddleware.js # Validates JWT access token
│ ├── authorize_role.js # Restricts routes to admin only
│ └── logger.js # Custom request logger
├── routes/
│ ├── auth.routes.js
│ ├── task.routes.js
│ └── admin.routes.js
├── config/
│ └── db.js # DB connection
├── server.js # Entry point
├── .env.example # Example env vars
└── README.md

📌 API Endpoints
Auth

POST /api/auth/register → Register a new user

POST /api/auth/login → Login and receive tokens

POST /api/auth/refresh → Refresh access token

POST /api/auth/logout → Logout (invalidate refresh tokens)

Tasks

POST /api/tasks → Create a task

GET /api/tasks → Get all tasks (with search & filter support)

PUT /api/tasks/:id → Update a task

DELETE /api/tasks/:id → Delete a task

Admin (requires role = admin)

GET /api/admin/users → View all users

DELETE /api/admin/users/:id → Delete a user (cascade deletes tasks & refresh tokens)

GET /api/admin/tasks → View all tasks

DELETE /api/admin/tasks/:id → Delete any task

📖 Tech Stack

Node.js (Express)

MongoDB (Mongoose)

JWT for authentication

bcrypt for password hashing

pnpm / npm for package management

✅ Future Improvements

Store refresh tokens per device/session (instead of single token per user)

Email verification & password reset flow

Docker support for deployment

👨‍💻 Author

Developed with ❤️ by Alina Mukhtar

https://github.com/AlinaTheCoder

## 📬 API Testing

A Postman collection is included for easy testing:  
[Download Collection](./docs/TaskManager Api.postman_collection.json)

🔗 [View Live API Docs (Postman)](https://documenter.getpostman.com/view/45948319/2sB3HnJKD1)
