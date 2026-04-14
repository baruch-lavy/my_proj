# Project: TaskFlow — Task Management REST API

A real-world NestJS project built in progressive phases. Each phase introduces new NestJS concepts while building a fully functional task management system (like a simplified Trello/Jira).

---

## Tech Stack

- **Runtime:** NestJS + TypeScript
- **Database:** MongoDB with Mongoose (`@nestjs/mongoose`)
- **Auth:** JWT with Passport (`@nestjs/passport`, `@nestjs/jwt`)
- **Validation:** class-validator + class-transformer
- **Config:** @nestjs/config (`.env` files)
- **Docs:** Swagger (`@nestjs/swagger`)

---

## Phase 1 — Project Foundation & CRUD

**Goal:** Set up the project structure and build basic CRUD for tasks.

### Requirements

1. Create a `tasks` module with controller, service, and Mongoose schema.
2. Task schema fields:
   - `title` (string, required)
   - `description` (string, optional)
   - `status` (enum: `OPEN`, `IN_PROGRESS`, `DONE`, default `OPEN`)
   - `priority` (enum: `LOW`, `MEDIUM`, `HIGH`, default `MEDIUM`)
   - `dueDate` (Date, optional)
   - `createdAt` (Date, auto)
   - `updatedAt` (Date, auto)
3. Implement these endpoints:
   - `POST /tasks` — create a task
   - `GET /tasks` — get all tasks
   - `GET /tasks/:id` — get a single task
   - `PATCH /tasks/:id` — update a task
   - `DELETE /tasks/:id` — delete a task
4. Create DTOs: `CreateTaskDto`, `UpdateTaskDto` with class-validator decorators.
5. Use `ValidationPipe` globally in `main.ts`.
6. Connect to MongoDB using `@nestjs/mongoose` and `@nestjs/config` for the connection string (store in `.env`).

### Concepts Practiced

- Modules, Controllers, Services
- Mongoose schemas and models
- DTOs with validation
- Global pipes
- Environment configuration

---

## Phase 2 — Filtering, Pagination & Search

**Goal:** Make the GET /tasks endpoint production-ready.

### Requirements

1. Add query parameters to `GET /tasks`:
   - `status` — filter by status
   - `priority` — filter by priority
   - `search` — search in title and description (case-insensitive partial match)
   - `page` (default 1) and `limit` (default 10) — pagination
   - `sortBy` (default `createdAt`) and `order` (`asc`/`desc`)
2. Create a `GetTasksFilterDto` for query validation.
3. Return paginated response shape:
   ```json
   {
     "data": [...],
     "total": 42,
     "page": 1,
     "limit": 10,
     "totalPages": 5
   }
   ```

### Concepts Practiced

- Query parameter parsing
- Mongoose query building (`.find()`, `.skip()`, `.limit()`, `.sort()`)
- DTO validation for query strings

---

## Phase 3 — Authentication

**Goal:** Add user registration and JWT-based login.

### Requirements

1. Create a `users` module with controller, service, and Mongoose schema.
2. User schema fields:
   - `username` (string, unique, required)
   - `email` (string, unique, required)
   - `password` (string, hashed, required)
3. Create an `auth` module with:
   - `POST /auth/register` — register a new user (hash password with bcrypt)
   - `POST /auth/login` — validate credentials, return a JWT access token
4. Implement Passport JWT strategy (`@nestjs/passport`).
5. Create a custom `@GetUser()` parameter decorator that extracts the user from the request.
6. Protect all `/tasks` endpoints with `AuthGuard('jwt')`.

### Concepts Practiced

- Multiple modules working together
- Passport strategies
- JWT tokens
- Password hashing (bcrypt)
- Custom parameter decorators
- Auth guards

---

## Phase 4 — Task Ownership & Authorization

**Goal:** Users can only manage their own tasks.

### Requirements

1. Add an `owner` field to the Task schema (reference to User).
2. When creating a task, automatically assign the logged-in user as owner.
3. Users can only see, update, and delete their own tasks.
4. Add a `role` field to User (`USER`, `ADMIN`).
5. Create a `RolesGuard` and a custom `@Roles()` decorator.
6. Admins can see and delete any task.
7. Create a `GET /admin/tasks` endpoint (admin only) that returns all tasks from all users.

### Concepts Practiced

- Document references / relations in Mongoose
- Custom decorators (`@Roles()`, `@GetUser()`)
- Role-based access control (RBAC)
- Guards (combining AuthGuard + RolesGuard)

---

## Phase 5 — Error Handling & Interceptors

**Goal:** Add consistent API responses and proper error handling.

### Requirements

1. Create a global `HttpExceptionFilter` that formats all error responses as:
   ```json
   {
     "statusCode": 404,
     "message": "Task not found",
     "error": "Not Found",
     "timestamp": "2026-04-14T12:00:00.000Z",
     "path": "/tasks/abc123"
   }
   ```
2. Create a `TransformInterceptor` that wraps all successful responses:
   ```json
   {
     "statusCode": 200,
     "data": { ... },
     "timestamp": "2026-04-14T12:00:00.000Z"
   }
   ```
3. Create a `LoggingInterceptor` that logs:
   - HTTP method and URL
   - Response time in ms
   - User ID (if authenticated)
4. Handle MongoDB duplicate key errors (e.g., duplicate username) gracefully.

### Concepts Practiced

- Exception filters
- Interceptors (response transformation, logging, timing)
- `APP_FILTER`, `APP_INTERCEPTOR` providers
- NestJS execution lifecycle order

---

## Phase 6 — Middleware & Rate Limiting

**Goal:** Add request-level concerns.

### Requirements

1. Create a `LoggerMiddleware` that logs every incoming request (method, URL, IP, user-agent).
2. Apply it globally using the module `configure()` method.
3. Add rate limiting using `@nestjs/throttler`:
   - Global: 100 requests per 60 seconds
   - Login endpoint: 5 requests per 60 seconds (stricter)
4. Add a `CorrelationIdMiddleware` that assigns a unique ID to each request (`X-Correlation-Id` header) for tracing.

### Concepts Practiced

- Middleware (class-based and functional)
- `NestModule.configure()` and route-specific middleware
- ThrottlerModule / rate limiting
- Request tracing

---

## Phase 7 — Swagger API Documentation

**Goal:** Auto-generate interactive API docs.

### Requirements

1. Set up Swagger at `/api/docs`.
2. Add `@ApiTags()`, `@ApiOperation()`, `@ApiResponse()` decorators to all endpoints.
3. Document all DTOs with `@ApiProperty()`.
4. Show the `Authorization: Bearer <token>` option in Swagger UI.
5. Group endpoints by module (tasks, auth, admin).

### Concepts Practiced

- @nestjs/swagger decorators
- API documentation best practices
- Bearer auth in Swagger

---

## Phase 8 — Testing

**Goal:** Write meaningful tests.

### Requirements

1. **Unit tests** for:
   - `TasksService` — mock the Mongoose model, test CRUD logic
   - `AuthService` — mock UserModel, test register/login logic
   - `RolesGuard` — test role checking logic
2. **E2E tests** for:
   - Full auth flow: register → login → create task → get tasks
   - Unauthorized access returns 401
   - Forbidden access (wrong role) returns 403
   - Validation errors return 400
3. Use an in-memory MongoDB for tests (`mongodb-memory-server`).

### Concepts Practiced

- Jest with NestJS (`@nestjs/testing`)
- Mocking services and models
- `Test.createTestingModule()`
- E2E testing with `supertest`

---

## Bonus Phase — Advanced Features (Optional)

Pick any of these to keep learning:

1. **WebSockets:** Real-time task updates when a task status changes (`@nestjs/websockets`).
2. **File Upload:** Attach files to tasks using `@nestjs/platform-express` + Multer.
3. **Caching:** Cache `GET /tasks` responses with `@nestjs/cache-manager`.
4. **Queue:** Send email notifications when a task is assigned using `@nestjs/bull` + Redis.
5. **CQRS:** Refactor task creation to use commands and events (`@nestjs/cqrs`).
6. **GraphQL:** Add a parallel GraphQL API for tasks (`@nestjs/graphql`).
7. **Microservices:** Extract the notification system into a separate NestJS microservice.
8. **Docker:** Containerize the app + MongoDB with `docker-compose`.

---

## Folder Structure (Target)

```
src/
├── main.ts
├── app.module.ts
├── config/
│   └── configuration.ts
├── common/
│   ├── decorators/
│   │   ├── get-user.decorator.ts
│   │   └── roles.decorator.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── guards/
│   │   └── roles.guard.ts
│   ├── interceptors/
│   │   ├── logging.interceptor.ts
│   │   └── transform.interceptor.ts
│   └── middleware/
│       ├── logger.middleware.ts
│       └── correlation-id.middleware.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── dto/
│   │   ├── register.dto.ts
│   │   └── login.dto.ts
│   └── strategies/
│       └── jwt.strategy.ts
├── users/
│   ├── users.module.ts
│   ├── users.service.ts
│   └── schemas/
│       └── user.schema.ts
└── tasks/
    ├── tasks.module.ts
    ├── tasks.controller.ts
    ├── tasks.service.ts
    ├── dto/
    │   ├── create-task.dto.ts
    │   ├── update-task.dto.ts
    │   └── get-tasks-filter.dto.ts
    ├── enums/
    │   ├── task-status.enum.ts
    │   └── task-priority.enum.ts
    └── schemas/
        └── task.schema.ts
```

---

## Rules

- Build each phase fully before moving to the next.
- Every endpoint must have proper validation.
- Never store plain-text passwords.
- Every error should return a meaningful message.
- Use environment variables for all secrets and config.
- Write clean, modular code — one concern per file.
- If you get stuck, re-read the NestJS docs for that specific feature before asking for help.

---

## Getting Started

```bash
# Install core dependencies
npm i @nestjs/mongoose mongoose
npm i @nestjs/config
npm i @nestjs/passport passport passport-jwt @nestjs/jwt
npm i bcrypt
npm i class-validator class-transformer
npm i @nestjs/swagger
npm i @nestjs/throttler

# Install dev dependencies
npm i -D @types/passport-jwt @types/bcrypt
npm i -D mongodb-memory-server

# Create .env file
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mr14t.mongodb.net/taskflow
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=3600s
```

Start with Phase 1. Good luck!
