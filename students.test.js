const request = require("supertest");
const app = require("../../../app");

describe("Students Module - CRUD Operations", () => {
  let studentId;
  const validStudentData = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    gender: "Male",
    dob: "2005-01-15",
    class: "Grade 10",
    section: "A",
    roll: 1,
    admissionDate: "2020-01-01",
    fatherName: "James Doe",
    motherName: "Jane Doe",
    guardianName: "James Doe",
    guardianPhone: "+1234567890",
    relationOfGuardian: "Father",
    currentAddress: "123 Main St",
    permanentAddress: "123 Main St",
  };

  describe("POST /api/v1/students - Create Student", () => {
    it("should create a new student successfully", async () => {
      const response = await request(app)
        .post("/api/v1/students")
        .send(validStudentData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("added successfully");
    });

    it("should reject request with missing email", async () => {
      const invalidData = { ...validStudentData };
      delete invalidData.email;

      const response = await request(app)
        .post("/api/v1/students")
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject request with invalid email format", async () => {
      const invalidData = { ...validStudentData, email: "invalid-email" };

      const response = await request(app)
        .post("/api/v1/students")
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/v1/students - Get All Students", () => {
    it("should retrieve all students", async () => {
      const response = await request(app)
        .get("/api/v1/students")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should filter students by name", async () => {
      const response = await request(app)
        .get("/api/v1/students?name=John")
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it("should support pagination", async () => {
      const response = await request(app)
        .get("/api/v1/students?page=1&limit=5")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.pagination.page).toBe(1);
    });
  });

  describe("GET /api/v1/students/:id - Get Student Details", () => {
    it("should return 404 for non-existent student", async () => {
      const response = await request(app)
        .get("/api/v1/students/99999")
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/v1/students/:id - Delete Student", () => {
    it("should reject invalid student ID", async () => {
      const response = await request(app)
        .delete("/api/v1/students/invalid")
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});