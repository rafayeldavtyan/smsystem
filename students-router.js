const express = require("express");
const router = express.Router();
const studentController = require("./students-controller");
const { validateRequest } = require("../../utils");
const {
  createStudentSchema,
  updateStudentSchema,
  getAllStudentsSchema,
  studentStatusSchema,
} = require("./students-schema");

/**
 * GET /api/v1/students
 * Get all students with optional filters
 */
router.get(
  "",
  validateRequest(getAllStudentsSchema),
  studentController.handleGetAllStudents
);

/**
 * POST /api/v1/students
 * Create a new student
 */
router.post(
  "",
  validateRequest(createStudentSchema),
  studentController.handleAddStudent
);

/**
 * GET /api/v1/students/:id
 * Get student details
 */
router.get("/:id", studentController.handleGetStudentDetail);

/**
 * PUT /api/v1/students/:id
 * Update student information
 */
router.put(
  "/:id",
  validateRequest(updateStudentSchema),
  studentController.handleUpdateStudent
);

/**
 * POST /api/v1/students/:id/status
 * Update student status
 */
router.post(
  "/:id/status",
  validateRequest(studentStatusSchema),
  studentController.handleStudentStatus
);

/**
 * DELETE /api/v1/students/:id
 * Delete a student
 */
router.delete("/:id", studentController.handleDeleteStudent);

module.exports = { studentsRoutes: router };