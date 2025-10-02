# Notes Management Dashboard API Documentation

## Overview

The Notes Management Dashboard API provides a complete backend solution for managing notes, user authentication, and profile management. Built with Next.js 14 App Router and Prisma ORM.

**Base URL:** `http://localhost:3000/api` (development)

## Authentication

The API uses JWT tokens stored in HTTP-only cookies for authentication. All protected routes require a valid JWT token.

### Token Management

- **Storage:** HTTP-only cookies (secure, prevents XSS)
- **Expiration:** 24 hours
- **Name:** `token`
- **Security:** `httpOnly`, `secure` (in production), `sameSite: lax`

---

## 🔐 Authentication Endpoints

### Register User

Creates a new user account and returns authentication token.

```http
POST /api/auth/signup
```

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!"
}
```

**Response (201 Created):**

```json
{
  "message": "User created successfully",
  "user": {
    "id": "clp123456",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Validation Rules:**

- `firstName`: Required, 1-50 characters
- `lastName`: Required, 1-50 characters
- `email`: Valid email format, unique
- `password`: Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special character
- `confirmPassword`: Must match password

**Error Responses:**

- `400` - Validation failed or user already exists
- `500` - Internal server error

### Login User

Authenticates user and returns JWT token in cookie.

```http
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**

```json
{
  "message": "Login successful",
  "user": {
    "id": "clp123456",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

- `401` - Invalid email or password
- `400` - Validation failed
- `500` - Internal server error

### Get Current User

Returns current authenticated user information.

```http
GET /api/auth/me
```

**Headers:**

```
Cookie: token=<jwt_token>
```

**Response (200 OK):**

```json
{
  "user": {
    "id": "clp123456",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "bio": "Software developer passionate about clean code",
    "role": "USER",
    "avatar": null,
    "interests": "JavaScript, React, Node.js",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

- `401` - Authentication required or invalid token
- `404` - User not found
- `500` - Internal server error

### Logout User

Logs out user by clearing authentication cookie.

```http
POST /api/auth/logout
```

**Response (200 OK):**

```json
{
  "message": "Logout successful"
}
```

**Error Responses:**

- `500` - Internal server error

---

## 👤 Profile Management

### Get Profile

Retrieves user profile information.

```http
GET /api/auth/profile
```

**Headers:**

```
Cookie: token=<jwt_token>
```

**Response (200 OK):**

```json
{
  "user": {
    "id": "clp123456",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "bio": "Software developer passionate about clean code",
    "role": "USER",
    "avatar": null,
    "interests": "JavaScript, React, Node.js",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-16T14:22:00.000Z"
  }
}
```

### Update Profile

Updates user profile information.

```http
PUT /api/auth/profile
```

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "bio": "Full-stack developer with 5+ years experience",
  "interests": "JavaScript, TypeScript, React, Node.js, PostgreSQL"
}
```

**Response (200 OK):**

```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "clp123456",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "bio": "Full-stack developer with 5+ years experience",
    "role": "USER",
    "avatar": null,
    "interests": "JavaScript, TypeScript, React, Node.js, PostgreSQL",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-16T15:30:00.000Z"
  }
}
```

**Validation Rules:**

- `firstName`: Required, 1-50 characters
- `lastName`: Required, 1-50 characters
- `email`: Valid email format, unique across users
- `bio`: Optional, max 500 characters
- `interests`: Optional, max 200 characters

**Error Responses:**

- `401` - Unauthorized
- `400` - Validation failed
- `409` - Email already in use
- `500` - Internal server error

### Change Password

Updates user password with current password verification.

```http
PUT /api/auth/password
```

**Request Body:**

```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewSecurePassword456!",
  "confirmPassword": "NewSecurePassword456!"
}
```

**Response (200 OK):**

```json
{
  "message": "Password changed successfully"
}
```

**Validation Rules:**

- `currentPassword`: Required, must match existing password
- `newPassword`: Same rules as registration, must be different from current
- `confirmPassword`: Must match newPassword

**Error Responses:**

- `401` - Unauthorized
- `400` - Current password incorrect or validation failed
- `500` - Internal server error

### Delete Account

Permanently deletes user account and all associated data.

```http
DELETE /api/auth/profile
```

**Response (200 OK):**

```json
{
  "message": "Account deleted successfully"
}
```

**Error Responses:**

- `401` - Unauthorized
- `404` - User not found
- `500` - Internal server error

---

## 📝 Notes Management

### Get All Notes

Retrieves all notes for the authenticated user.

```http
GET /api/notes
```

**Headers:**

```
Cookie: token=<jwt_token>
```

**Response (200 OK):**

```json
{
  "notes": [
    {
      "id": "note_123456",
      "title": "Project Planning",
      "content": "Plan the new dashboard project...",
      "category": "work",
      "tags": ["planning", "project", "dashboard"],
      "priority": "high",
      "dueDate": "2024-01-20T00:00:00.000Z",
      "isPinned": true,
      "isArchived": false,
      "workspace": "development",
      "userId": "clp123456",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-16T14:22:00.000Z"
    }
  ]
}
```

**Sorting:** Notes are returned sorted by:

1. Pinned notes first (`isPinned: desc`)
2. Most recently updated (`updatedAt: desc`)

### Get Single Note

Retrieves a specific note by ID.

```http
GET /api/notes/{id}
```

**Parameters:**

- `id` (path): Note ID

**Response (200 OK):**

```json
{
  "note": {
    "id": "note_123456",
    "title": "Project Planning",
    "content": "Plan the new dashboard project...",
    "category": "work",
    "tags": ["planning", "project", "dashboard"],
    "priority": "high",
    "dueDate": "2024-01-20T00:00:00.000Z",
    "isPinned": true,
    "isArchived": false,
    "workspace": "development",
    "userId": "clp123456",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-16T14:22:00.000Z"
  }
}
```

**Error Responses:**

- `401` - Unauthorized
- `404` - Note not found
- `500` - Internal server error

### Create Note

Creates a new note for the authenticated user.

```http
POST /api/notes
```

**Request Body:**

```json
{
  "title": "Meeting Notes",
  "content": "Discussion points from today's meeting...",
  "category": "work",
  "tags": ["meeting", "work", "notes"],
  "priority": "medium",
  "dueDate": "2024-01-25T15:30:00.000Z",
  "isPinned": false,
  "isArchived": false,
  "workspace": "default"
}
```

**Response (201 Created):**

```json
{
  "note": {
    "id": "note_789012",
    "title": "Meeting Notes",
    "content": "Discussion points from today's meeting...",
    "category": "work",
    "tags": ["meeting", "work", "notes"],
    "priority": "medium",
    "dueDate": "2024-01-25T15:30:00.000Z",
    "isPinned": false,
    "isArchived": false,
    "workspace": "default",
    "userId": "clp123456",
    "createdAt": "2024-01-16T16:00:00.000Z",
    "updatedAt": "2024-01-16T16:00:00.000Z"
  }
}
```

**Field Specifications:**

- `title`: Required, minimum 1 character
- `content`: Optional string
- `category`: Optional string
- `tags`: Optional array of strings, defaults to empty array
- `priority`: Optional enum (`"low"`, `"medium"`, `"high"`, `"urgent"`)
- `dueDate`: Optional ISO date string
- `isPinned`: Optional boolean, defaults to `false`
- `isArchived`: Optional boolean, defaults to `false`
- `workspace`: Optional string, defaults to `"default"`

### Update Note

Updates an existing note.

```http
PUT /api/notes
```

**Request Body:**

```json
{
  "noteId": "note_123456",
  "title": "Updated Project Planning",
  "content": "Updated content with new requirements...",
  "tags": ["planning", "project", "dashboard", "requirements"],
  "priority": "urgent",
  "isPinned": true
}
```

**Response (200 OK):**

```json
{
  "note": {
    "id": "note_123456",
    "title": "Updated Project Planning",
    "content": "Updated content with new requirements...",
    "category": "work",
    "tags": ["planning", "project", "dashboard", "requirements"],
    "priority": "urgent",
    "dueDate": "2024-01-20T00:00:00.000Z",
    "isPinned": true,
    "isArchived": false,
    "workspace": "development",
    "userId": "clp123456",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-16T16:15:00.000Z"
  }
}
```

**Notes:**

- Only provided fields will be updated (partial update)
- `noteId` is required in request body
- User can only update their own notes

**Error Responses:**

- `401` - Unauthorized
- `400` - Note ID required or validation failed
- `404` - Note not found
- `500` - Internal server error

### Delete Note

Deletes a note permanently.

```http
DELETE /api/notes?id={noteId}
```

**Query Parameters:**

- `id`: Note ID to delete

**Response (200 OK):**

```json
{
  "message": "Note deleted successfully"
}
```

**Error Responses:**

- `401` - Unauthorized
- `400` - Note ID required
- `404` - Note not found
- `500` - Internal server error

---

## 🔄 Bulk Operations

### Bulk Note Operations

Performs bulk operations on multiple notes.

```http
POST /api/notes/bulk
```

**Request Body (Archive):**

```json
{
  "noteIds": ["note_123456", "note_789012", "note_345678"],
  "operation": "archive"
}
```

**Request Body (Delete):**

```json
{
  "noteIds": ["note_123456", "note_789012"],
  "operation": "delete"
}
```

**Request Body (Update Workspace):**

```json
{
  "noteIds": ["note_123456", "note_789012"],
  "operation": "updateWorkspace",
  "data": {
    "workspace": "personal"
  }
}
```

**Request Body (Update Category):**

```json
{
  "noteIds": ["note_123456", "note_789012"],
  "operation": "updateCategory",
  "data": {
    "category": "important"
  }
}
```

**Available Operations:**

- `archive` - Archive selected notes
- `unarchive` - Unarchive selected notes
- `delete` - Permanently delete selected notes
- `updateWorkspace` - Move notes to specified workspace
- `updateCategory` - Update category for selected notes

**Response (200 OK) - Update Operations:**

```json
{
  "message": "3 notes archived",
  "updatedCount": 3
}
```

**Response (200 OK) - Delete Operation:**

```json
{
  "message": "2 notes deleted",
  "deletedCount": 2
}
```

**Required Data Fields:**

- `updateWorkspace`: Requires `data.workspace`
- `updateCategory`: Requires `data.category`
- Other operations: No additional data required

**Error Responses:**

- `401` - Unauthorized
- `400` - Validation failed or missing required data
- `404` - Some notes not found or don't belong to user
- `500` - Internal server error

---

## 📊 Data Models

### User Model

```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string; // Hashed with bcrypt
  bio?: string;
  role: "USER" | "ADMIN";
  avatar?: string;
  interests?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Note Model

```typescript
interface Note {
  id: string;
  title: string;
  content?: string;
  category?: string;
  tags: string[];
  priority?: "low" | "medium" | "high" | "urgent";
  dueDate?: Date;
  isPinned: boolean;
  isArchived: boolean;
  workspace: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### JWT Payload

```typescript
interface JWTPayload {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  iat: number;
  exp: number;
}
```

---

## 🛡️ Security Features

### Password Security

- **Hashing:** bcrypt with 12 salt rounds
- **Requirements:** Minimum 8 characters, mixed case, numbers, special characters
- **Validation:** Server-side validation with Zod schemas

### Authentication Security

- **JWT Tokens:** Signed with secret key, 24-hour expiration
- **HTTP-Only Cookies:** Prevents XSS attacks
- **Secure Cookies:** HTTPS only in production
- **SameSite Protection:** CSRF protection

### Data Security

- **User Isolation:** Users can only access their own data
- **Input Validation:** All inputs validated with Zod schemas
- **SQL Injection Prevention:** Prisma ORM provides protection
- **Rate Limiting:** Recommended for production deployment

---

## 🚀 Status Codes

| Code  | Description                             |
| ----- | --------------------------------------- |
| `200` | OK - Request successful                 |
| `201` | Created - Resource created successfully |
| `400` | Bad Request - Invalid request data      |
| `401` | Unauthorized - Authentication required  |
| `403` | Forbidden - Access denied               |
| `404` | Not Found - Resource not found          |
| `409` | Conflict - Resource already exists      |
| `500` | Internal Server Error - Server error    |

---

## 🧪 Testing the API

### Using cURL

**Register a new user:**

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "SecurePassword123!",
    "confirmPassword": "SecurePassword123!"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123!"
  }'
```

**Create a note:**

```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "My First Note",
    "content": "This is a test note",
    "tags": ["test", "api"],
    "priority": "medium"
  }'
```

**Get all notes:**

```bash
curl -X GET http://localhost:3000/api/notes \
  -b cookies.txt
```

### Environment Variables

Required environment variables for the API:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/notes_db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"

# Node Environment
NODE_ENV="development"
```

---

## 📋 Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": "Error message description",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Common Error Types

1. **Validation Errors (400)**

   - Invalid input format
   - Missing required fields
   - Invalid data types

2. **Authentication Errors (401)**

   - Missing authentication token
   - Invalid or expired token
   - Incorrect credentials

3. **Authorization Errors (403)**

   - Access to resource denied
   - Insufficient permissions

4. **Not Found Errors (404)**

   - Resource doesn't exist
   - User not found

5. **Conflict Errors (409)**

   - Email already exists
   - Duplicate resource

6. **Server Errors (500)**
   - Database connection issues
   - Unexpected server errors

---

## 🔄 API Versioning

Current API version: **v1** (implicit)

Future versions will be accessible via:

- `/api/v2/notes`
- `/api/v2/auth`

---

## 📚 Additional Resources

- **Frontend Integration:** See the React hooks in `/src/hooks/` for client-side usage
- **Database Schema:** Check `/prisma/schema.prisma` for complete data model
- **Validation Schemas:** Located in `/src/lib/schema/` for request validation
- **JWT Utilities:** JWT helper functions in `/src/lib/jwt.ts`

---

**API Documentation Version:** 1.0  
**Last Updated:** October 2024  
**Maintained by:** Development Team
