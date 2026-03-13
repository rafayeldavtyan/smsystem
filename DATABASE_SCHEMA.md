# Database Schema Documentation

## Overview

The Student Management System uses PostgreSQL with a comprehensive schema designed for educational institution management. This document outlines the database structure, relationships, and constraints.

## Core Tables

### users
Stores user account information.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255),
  last_login TIMESTAMP,
  role_id INTEGER REFERENCES roles(id),
  created_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_dt TIMESTAMP,
  leave_policy_id INTEGER REFERENCES leave_policies(id),
  is_active BOOLEAN DEFAULT false,
  reporter_id INTEGER,
  status_last_reviewed_dt TIMESTAMP,
  status_last_reviewer_id INTEGER REFERENCES users(id),
  is_email_verified BOOLEAN DEFAULT false
);
```

**Columns:**
- `id`: Unique user identifier
- `name`: User's full name
- `email`: Unique email address
- `password`: Hashed password
- `role_id`: Reference to user's role
- `is_active`: Account activation status
- `is_email_verified`: Email verification status

### user_profiles
Extended profile information for users.

```sql
CREATE TABLE user_profiles (
  user_id INTEGER PRIMARY KEY REFERENCES users(id),
  gender VARCHAR(10),
  dob DATE,
  phone VARCHAR(20),
  class_name VARCHAR(50) REFERENCES classes(name),
  section_name VARCHAR(50) REFERENCES sections(name),
  roll INTEGER,
  admission_dt DATE,
  father_name VARCHAR(50),
  father_phone VARCHAR(20),
  mother_name VARCHAR(50),
  mother_phone VARCHAR(20),
  guardian_name VARCHAR(50),
  guardian_phone VARCHAR(20),
  relation_of_guardian VARCHAR(30),
  current_address VARCHAR(100),
  permanent_address VARCHAR(100),
  created_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_dt TIMESTAMP
);
```

### roles
System roles for access control.

```sql
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE,
  is_active BOOLEAN DEFAULT true,
  is_editable BOOLEAN DEFAULT true
);
```

**Sample Data:**
```sql
INSERT INTO roles (name) VALUES ('Admin'), ('Student'), ('Teacher'), ('Staff');
```

### classes
Academic class definitions.

```sql
CREATE TABLE classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE,
  sections VARCHAR(50)
);
```

### sections
Class sections.

```sql
CREATE TABLE sections (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE
);
```

## Relationships

### User Hierarchy
```
users (1) ──── (1) user_profiles
users (n) ──── (1) roles
users (n) ──── (1) users (reporter_id)
```

### Academic Structure
```
user_profiles (n) ──── (1) classes
user_profiles (n) ──── (1) sections
```

## Indexes

For optimal query performance:

```sql
-- User queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Profile queries
CREATE INDEX idx_user_profiles_class ON user_profiles(class_name);
CREATE INDEX idx_user_profiles_section ON user_profiles(section_name);
CREATE INDEX idx_user_profiles_roll ON user_profiles(roll);

-- Timestamp queries
CREATE INDEX idx_users_created ON users(created_dt);
CREATE INDEX idx_profiles_created ON user_profiles(created_dt);
```

## Data Integrity

### Constraints

**Foreign Keys:**
- `user_profiles.user_id` → `users.id` (CASCADE DELETE)
- `users.role_id` → `roles.id`
- `user_profiles.class_name` → `classes.name`
- `user_profiles.section_name` → `sections.name`

**Unique Constraints:**
- `users.email` - Ensures unique email addresses
- `roles.name` - Ensures unique role names
- `classes.name` - Ensures unique class names
- `sections.name` - Ensures unique section names

**Not Null Constraints:**
- `users.name` - User must have a name
- `users.email` - Email is required
- `roles.name` - Role must have a name

## Best Practices

1. **Always use transactions** for multi-table operations
2. **Use parameterized queries** to prevent SQL injection
3. **Index frequently queried columns**
4. **Maintain referential integrity** with foreign keys
5. **Use appropriate data types** for each field
6. **Add timestamps** for audit trails

## Query Examples

### Get all active students
```sql
SELECT u.id, u.name, u.email, up.class_name, up.section_name
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN roles r ON u.role_id = r.id
WHERE r.name = 'Student' AND u.is_active = true
ORDER BY u.created_dt DESC;
```

### Get students in a specific class
```sql
SELECT u.id, u.name, up.roll, up.class_name, up.section_name
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE up.class_name = 'Grade 10'
ORDER BY up.roll;
```

### Count students by section
```sql
SELECT up.section_name, COUNT(*) as count
FROM user_profiles up
WHERE up.class_name = 'Grade 10'
GROUP BY up.section_name;
```