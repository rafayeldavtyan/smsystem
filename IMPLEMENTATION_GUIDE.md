# Student Management CRUD Implementation Guide

## Overview

This guide provides complete documentation for the student management CRUD operations implementation following professional Node.js and Express standards.

## 📋 What's Included

### Controllers (`students-controller.js`)
- **handleGetAllStudents**: Retrieves paginated student list with filters
- **handleAddStudent**: Creates new student records
- **handleGetStudentDetail**: Retrieves single student details
- **handleUpdateStudent**: Updates existing student data
- **handleStudentStatus**: Changes student active/inactive status
- **handleDeleteStudent**: Deletes student records

### Services (`students-service.js`)
- Business logic separation
- Data validation
- Error handling
- Email verification
- Transaction management

### Repository (`students-repository.js`)
- Database abstraction
- Query optimization
- Parameterized queries (SQL injection prevention)
- Connection pooling

### Validation (`students-schema.js`)
- Zod schema validation
- Request validation
- Error messages

### Router (`students-router.js`)
- RESTful API endpoints
- Middleware integration
- Route protection

## 🚀 API Endpoints

### 1. GET /api/v1/students
**Get all students with filters and pagination**

```bash
curl -X GET "http://localhost:5007/api/v1/students?page=1&limit=10&name=John" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `name` (optional): Filter by name
- `className` (optional): Filter by class
- `section` (optional): Filter by section
- `roll` (optional): Filter by roll number

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
      "roll": 1,
      "is_active": true
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

### 2. POST /api/v1/students
**Create a new student**

```bash
curl -X POST "http://localhost:5007/api/v1/students" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "gender": "Male",
    "dob": "2005-01-15",
    "class": "Grade 10",
    "section": "A",
    "roll": 1,
    "admissionDate": "2020-01-01",
    "fatherName": "James Doe",
    "motherName": "Jane Doe",
    "guardianName": "James Doe",
    "guardianPhone": "+1234567890",
    "relationOfGuardian": "Father",
    "currentAddress": "123 Main St",
    "permanentAddress": "123 Main St"
  }'
```

**Request Body:**
- `name` (required): Student name
- `email` (required): Unique email address
- `phone` (required): Contact number
- `gender` (required): Male/Female/Other
- `dob` (required): Date of birth
- `class` (required): Class name
- `section` (required): Section
- `fatherName` (required): Father's name
- `motherName` (required): Mother's name
- `guardianName` (required): Guardian's name
- `guardianPhone` (required): Guardian's phone
- `relationOfGuardian` (required): Relation to student
- `currentAddress` (required): Current address
- `permanentAddress` (required): Permanent address

**Response:**
```json
{
  "success": true,
  "message": "Student added and verification](#)
