# Calendar Booking Service

A simple backend service for scheduling meetings with conflict prevention built using Node.js, Express, Sequelize, and PostgreSQL.

## 📋 Features

- ✅ User management (Create and retrieve users)
- ✅ Meeting scheduling with automatic conflict detection
- ✅ Prevent overlapping time slots
- ✅ Filter meetings by user, date range
- ✅ Update and delete meetings
- ✅ RESTful API design
- ✅ Input validation
- ✅ Centralized error handling
- ✅ Database indexing for performance

## 🛠️ Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Sequelize
- **Database:** PostgreSQL
- **Language:** JavaScript

## 📁 Project Structure

```
src/
├── modules/
│   ├── meeting/
│   │   ├── index/
│   │   │   └── index.js
│   │   ├── interface/
│   │   │   └── MeetingController.js
│   │   ├── dto/
│   │   │   └── MeetingDto.js
│   │   ├── model/
│   │   │   └── Meeting.js
│   │   ├── service/
│   │   │   └── MeetingService.js
│   │   └── routes/
│   │       └── meetingRoutes.js
│   └── user/
│       ├── index/
│       │   └── index.js
│       ├── interface/
│       │   └── UserController.js
│       ├── dto/
│       │   └── CreateUserDto.js
│       ├── model/
│       │   └── User.js
│       ├── service/
│       │   └── UserService.js
│       └── routes/
│           └── userRoutes.js
├── middlewares/
│   ├── errorHandler.js
│   └── notFoundHandler.js
├── config/
│   └── database.js
├── utils/
│   └── dbSync.js
└── app.js
server.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd calendar-booking-service
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up PostgreSQL database**

Create a new PostgreSQL database:
```sql
CREATE DATABASE calendar_booking_db;
```

4. **Configure environment variables**

Copy `.env.example` to `.env` and update the values:
```bash
cp .env.example .env
```

Update `.env` file with your database credentials:
```
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=calendar_booking_db
DB_USER=postgres
DB_PASSWORD=your_password_here
```

5. **Start the server**

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### User APIs

#### 1. Create User
**POST** `/users`

Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

Success Response (201):
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-02-11T10:30:00.000Z"
  }
}
```

#### 2. Get User by ID
**GET** `/users/:id`

Success Response (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-02-11T10:30:00.000Z"
  }
}
```

### Meeting APIs

#### 1. Create Meeting
**POST** `/meetings`

Request Body:
```json
{
  "userId": 1,
  "title": "Team Standup",
  "description": "Daily standup meeting",
  "startTime": "2024-02-11T09:00:00.000Z",
  "endTime": "2024-02-11T09:30:00.000Z"
}
```

Success Response (201):
```json
{
  "success": true,
  "message": "Meeting created successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "title": "Team Standup",
    "description": "Daily standup meeting",
    "startTime": "2024-02-11T09:00:00.000Z",
    "endTime": "2024-02-11T09:30:00.000Z",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-02-11T08:45:00.000Z"
  }
}
```

Conflict Response (400):
```json
{
  "success": false,
  "message": "Time slot already booked"
}
```

#### 2. Get All Meetings
**GET** `/meetings`

Optional Query Parameters:
- `userId` - Filter by user ID
- `startDate` - Filter meetings starting after this date
- `endDate` - Filter meetings ending before this date

Examples:
```
GET /meetings
GET /meetings?userId=1
GET /meetings?startDate=2024-02-11T00:00:00.000Z
GET /meetings?userId=1&startDate=2024-02-11T00:00:00.000Z&endDate=2024-02-12T00:00:00.000Z
```

Success Response (200):
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "title": "Team Standup",
      "description": "Daily standup meeting",
      "startTime": "2024-02-11T09:00:00.000Z",
      "endTime": "2024-02-11T09:30:00.000Z",
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-02-11T08:45:00.000Z"
    }
  ]
}
```

#### 3. Get Meeting by ID
**GET** `/meetings/:id`

Success Response (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "title": "Team Standup",
    "description": "Daily standup meeting",
    "startTime": "2024-02-11T09:00:00.000Z",
    "endTime": "2024-02-11T09:30:00.000Z",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-02-11T08:45:00.000Z"
  }
}
```

#### 4. Update Meeting
**PUT** `/meetings/:id`

Request Body (all fields optional):
```json
{
  "title": "Updated Team Standup",
  "description": "Updated description",
  "startTime": "2024-02-11T10:00:00.000Z",
  "endTime": "2024-02-11T10:30:00.000Z"
}
```

Success Response (200):
```json
{
  "success": true,
  "message": "Meeting updated successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "title": "Updated Team Standup",
    "description": "Updated description",
    "startTime": "2024-02-11T10:00:00.000Z",
    "endTime": "2024-02-11T10:30:00.000Z",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "updatedAt": "2024-02-11T09:00:00.000Z"
  }
}
```

#### 5. Delete Meeting
**DELETE** `/meetings/:id`

Success Response (200):
```json
{
  "success": true,
  "message": "Meeting deleted successfully"
}
```

## ⚙️ Business Rules

### Conflict Detection

The service prevents overlapping meetings for the same user using the following logic:

```
Conflict exists if:
existing.startTime < new.endTime AND existing.endTime > new.startTime
```

**Examples:**

✅ **No Conflict:**
- Existing: 9:00 AM - 10:00 AM
- New: 10:00 AM - 11:00 AM
- Result: Allowed (meetings are back-to-back)

❌ **Conflict:**
- Existing: 9:00 AM - 10:00 AM
- New: 9:30 AM - 10:30 AM
- Result: Rejected (overlaps by 30 minutes)

❌ **Conflict:**
- Existing: 9:00 AM - 11:00 AM
- New: 9:30 AM - 10:00 AM
- Result: Rejected (new meeting is fully inside existing)

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Meetings Table
```sql
CREATE TABLE meetings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes for performance
  INDEX idx_user_time (user_id, start_time, end_time),
  INDEX idx_time_range (start_time, end_time)
);
```

## 🧪 Testing with Postman

### Setup
1. Import the collection into Postman
2. Set base URL: `http://localhost:3000`

### Test Scenarios

#### Scenario 1: Create User and Meeting
```
1. POST /users (create John Doe)
2. POST /meetings (create meeting 9:00-10:00)
3. GET /meetings (verify meeting created)
```

#### Scenario 2: Test Conflict Prevention
```
1. POST /meetings (create meeting 9:00-10:00)
2. POST /meetings (try to create 9:30-10:30)
   → Should return 400 "Time slot already booked"
```

#### Scenario 3: Update Meeting
```
1. POST /meetings (create meeting 9:00-10:00)
2. PUT /meetings/1 (update to 11:00-12:00)
   → Should succeed (no conflict)
3. PUT /meetings/1 (try to update to overlap existing)
   → Should return 400 "Time slot already booked"
```

#### Scenario 4: Filter Meetings
```
1. POST /meetings (create multiple meetings for user 1)
2. GET /meetings?userId=1
3. GET /meetings?startDate=2024-02-11T00:00:00.000Z
4. GET /meetings?userId=1&startDate=2024-02-11&endDate=2024-02-12
```

## 🐛 Error Handling

The API uses standard HTTP status codes:

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error or conflict) |
| 404 | Resource Not Found |
| 409 | Conflict (duplicate email) |
| 500 | Internal Server Error |

## 📝 Validation Rules

### User
- Name: Required, 2-100 characters
- Email: Required, valid email format, unique

### Meeting
- User ID: Required, must exist
- Title: Required, not empty
- Start Time: Required, valid ISO 8601 date
- End Time: Required, valid ISO 8601 date
- Start Time must be before End Time
- No overlapping meetings for the same user

## 🔧 Architecture

The project follows a clean layered architecture:

1. **Routes Layer** - Defines API endpoints
2. **Controller Layer** - Handles HTTP requests/responses and validation
3. **Service Layer** - Contains business logic (conflict checking)
4. **Model Layer** - Defines database schema and relationships

**Data Flow:**
```
Request → Routes → Controller → Service → Model → Database
Response ← Routes ← Controller ← Service ← Model ← Database
```

## 📦 Key Dependencies

```json
{
  "express": "^4.18.2",      // Web framework
  "sequelize": "^6.35.0",    // ORM
  "pg": "^8.11.3",           // PostgreSQL driver
  "dotenv": "^16.3.1",       // Environment variables
  "nodemon": "^3.0.2"        // Dev auto-reload
}
```

## 🎯 Learning Outcomes

This project demonstrates:
- RESTful API design
- Clean architecture with separation of concerns
- Database relationships (One-to-Many)
- Complex query logic (conflict detection)
- Input validation with DTOs
- Error handling best practices
- Environment configuration
- Database indexing for performance

## 👨‍💻 Author

Created as an internship assignment project.

## 📄 License

This project is created for educational purposes.