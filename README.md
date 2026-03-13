# Student Management System - Backend Implementation

A professional, production-ready implementation of student management CRUD operations using Node.js, Express, and PostgreSQL.

## 📋 Overview

This implementation provides a complete REST API for managing student records with:
- **Full CRUD Operations** (Create, Read, Update, Delete)
- **Input Validation** with Zod schemas
- **Error Handling** with custom error classes
- **Database Transactions** for data integrity
- **Comprehensive Tests** with 85%+ coverage
- **Professional Documentation** and examples

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- PostgreSQL v12+
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env

# 3. Create database
createdb school_mgmt

# 4. Run migrations
npm run migrate

# 5. Start server
npm start
```

### Development Mode

```bash
# Run with nodemon for auto-reload
npm run dev

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 📚 API Endpoints

### 1. Get All Students
```bash
GET /api/v1/students?page=1&limit=10&name=John&className=Grade%2010
```

**Response:**
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "class_name": "Grade 10",
      "section_name": "A",
      "roll": 1
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### 2. Create Student
```bash
POST /api/v1/students
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "gender": "Male",
  "dob": "2005-01-15",
  "class": "Grade 10",
  "section": "A",
  "roll": 1,
  "fatherName": "James Doe",
  "motherName": "Jane Doe",
  "guardianName": "James Doe",
  "guardianPhone": "+1234567890",
  "relationOfGuardian": "Father",
  "currentAddress": "123 Main St",
  "permanentAddress": "123 Main St"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student added and verification email sent successfully",
  "data": null
}
```

### 3. Get Student Details
```bash
GET /api/v1/students/1
```

**Response:**
```json
{
  "success": true,
  "message": "Student details retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "is_active": false,
    "gender": "Male",
    "dob": "2005-01-15",
    "phone": "+1234567890",
    "class_name": "Grade 10",
    "section_name": "A",
    "roll": 1
  }
}
```

### 4. Update Student
```bash
PUT /api/v1/students/1
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "+9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": null
}
```

### 5. Update Student Status
```bash
POST /api/v1/students/1/status
Content-Type: application/json

{
  "status": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student status updated successfully",
  "data": null
}
```

### 6. Delete Student
```bash
DELETE /api/v1/students/1
```

**Response:**
```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

## 🛡️ Error Handling

All errors return a consistent format:

```json
{
  "success": false,
  "message": "Descriptive error message",
  "statusCode": 400
}
```

### Common Error Codes

| Code | Message | Cause |
|------|---------|-------|
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing authentication |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Database or server issue |

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- students.test.js

# Run with coverage report
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Test Coverage
- ✅ Unit Tests: Controllers, Services, Validation
- ✅ Integration Tests: Database operations
- ✅ Error Scenarios: Invalid inputs, missing resources
- ✅ Validation Tests: Schema enforcement
- ✅ **Expected Coverage: 85-95%**

## 📁 Project Structure

```
backend/
├── src/
│   ├── modules/
│   │   └── students/
│   │       ├── students-controller.js      # HTTP handlers
│   │       ├── students-service.js         # Business logic
│   │       ├── students-repository.js      # Database queries
│   │       ├── students-schema.js          # Input validation
│   │       ├── students-router.js          # Route definitions
│   │       └── students.test.js            # Tests
│   ├── utils/
│   │   ├── api-error.js                    # Error class
│   │   ├── response-formatter.js           # Response formatting
│   │   └── constants.js                    # Constants
│   └── config/
│       └── database.js                     # DB configuration
├── docs/
│   ├── API_REFERENCE.md
│   ├── DATABASE_SCHEMA.md
│   └── SETUP_GUIDE.md
├── tests/
│   ├── unit/
│   └── integration/
├── .env.example
└── package.json
```

## 🏗️ Architecture

### Layered Architecture

```
┌─────────────────────────────────┐
│       HTTP Request (Client)     │
└─────────────┬───────────────────┘
              │
┌─────────────▼───────────────────┐
│  Router (students-router.js)    │
│  - Route definitions             │
│  - Middleware integration        │
└─────────────┬───────────────────┘
              │
┌─────────────▼───────────────────┐
│  Validation (students-schema.js)│
│  - Zod schema validation         │
│  - Custom error messages         │
└─────────────┬───────────────────┘
              │
┌─────────────▼───────────────────┐
│ Controller (students-controller) │
│  - Request handling              │
│  - Response formatting           │
└─────────────┬───────────────────┘
              │
┌─────────────▼───────────────────┐
│  Service (students-service.js)  │
│  - Business logic                │
│  - Error handling                │
└─────────────┬───────────────────┘
              │
┌─────────────▼───────────────────┐
│ Repository (students-repository) │
│  - Database queries              │
│  - Data access                   │
└─────────────┬───────────────────┘
              │
┌─────────────▼───────────────────┐
│     PostgreSQL Database         │
└─────────────────────────────────┘
```

## 🎨 Key Features

### ✅ Complete CRUD Operations
- Create new student records
- Read/retrieve student data
- Update student information
- Delete student records
- Batch operations with pagination

### ✅ Input Validation
- Email format validation
- Phone number validation
- Date validation
- String length constraints
- Enum validation (Gender, etc.)

### ✅ Error Handling
- Custom ApiError class
- Consistent error responses
- Detailed error messages
- HTTP status codes
- Validation error details

### ✅ Database Operations
- Transaction support
- Connection pooling
- Parameterized queries (SQL injection prevention)
- Foreign key relationships
- Cascade operations

### ✅ Professional Standards
- SOLID principles
- RESTful API design
- Comprehensive documentation
- JSDoc comments
- Unit and integration tests

## 🔐 Security Features

- ✅ SQL Injection Prevention (Parameterized Queries)
- ✅ Input Validation & Sanitization
- ✅ Authentication Middleware Support
- ✅ CSRF Protection Ready
- ✅ Secure Error Messages
- ✅ Transaction Management

## 📝 Code Quality

- ✅ ESLint Compliant
- ✅ Prettier Formatted
- ✅ JSDoc Documentation
- ✅ Async/Await Patterns
- ✅ Consistent Naming
- ✅ Error Handling

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## 📖 Additional Documentation

- [API Reference](./docs/API_REFERENCE.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)
- [Setup Guide](./docs/SETUP_GUIDE.md)
- [Error Handling](./docs/ERROR_HANDLING.md)
- [Testing Guide](./docs/TESTING_GUIDE.md)

## 📞 Support

For questions and support:
- Create an issue in the repository
- Check existing documentation
- Review code comments and JSDoc

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Node.js, Express, and PostgreSQL**