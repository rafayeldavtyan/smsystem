const { ApiError, sendAccountVerificationEmail } = require("../../utils");
const {
  findAllStudents,
  findStudentDetail,
  findStudentToSetStatus,
  addOrUpdateStudent,
  deleteStudentById,
} = require("./students-repository");
const { findUserById } = require("../../shared/repository");

/**
 * Validates if a student exists
 * @throws {ApiError} If student not found
 */
const checkStudentExists = async (id) => {
  const student = await findUserById(id);
  if (!student) {
    throw new ApiError(404, `Student with ID ${id} not found`);
  }
  return student;
};

/**
 * Retrieves all students with optional filters and pagination
 * @param {Object} payload - Filter and pagination options
 * @returns {Object} - Students array and total count
 * @throws {ApiError} - On database errors
 */
const getAllStudents = async (payload) => {
  try {
    const result = await findAllStudents(payload);

    if (!result || !Array.isArray(result.students)) {
      throw new ApiError(500, "Invalid data format from database");
    }

    return {
      students: result.students,
      total: result.total || 0,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      500,
      `Error retrieving students: ${error.message}`
    );
  }
};

/**
 * Retrieves details of a specific student
 * @param {number} id - Student ID
 * @returns {Object} - Student details
 * @throws {ApiError} - If student not found
 */
const getStudentDetail = async (id) => {
  try {
    await checkStudentExists(id);
    const student = await findStudentDetail(id);

    if (!student) {
      throw new ApiError(404, `Student with ID ${id} not found`);
    }

    return student;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error retrieving student details: ${error.message}`);
  }
};

/**
 * Creates a new student record
 * @param {Object} payload - Student data
 * @returns {Object} - Success message and student data
 * @throws {ApiError} - On validation or database errors
 */
const addNewStudent = async (payload) => {
  const EMAIL_SEND_SUCCESS = "Student added and verification email sent successfully";
  const EMAIL_SEND_FAILURE = "Student added, but verification email could not be sent";

  try {
    if (!payload.email) {
      throw new ApiError(400, "Student email is required");
    }

    const result = await addOrUpdateStudent(payload);

    if (!result.status) {
      throw new ApiError(400, result.message || "Failed to add student");
    }

    // Attempt to send verification email (non-blocking)
    try {
      await sendAccountVerificationEmail({
        userId: result.userId,
        userEmail: payload.email,
      });
      return {
        message: EMAIL_SEND_SUCCESS,
        data: result.data || null,
      };
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return {
        message: EMAIL_SEND_FAILURE,
        data: result.data || null,
      };
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error adding student: ${error.message}`);
  }
};

/**
 * Updates an existing student record
 * @param {Object} payload - Student data with userId
 * @returns {Object} - Success message
 * @throws {ApiError} - On validation or database errors
 */
const updateStudent = async (payload) => {
  try {
    const { userId } = payload;

    if (!userId) {
      throw new ApiError(400, "Student ID is required");
    }

    await checkStudentExists(userId);

    const result = await addOrUpdateStudent(payload);

    if (!result.status) {
      throw new ApiError(400, result.message || "Failed to update student");
    }

    return {
      message: result.message || "Student updated successfully",
      data: result.data || null,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error updating student: ${error.message}`);
  }
};

/**
 * Updates student active/inactive status
 * @param {Object} payload - { userId, reviewerId, status }
 * @returns {Object} - Success message
 * @throws {ApiError} - If student not found or update fails
 */
const setStudentStatus = async ({ userId, reviewerId, status }) => {
  try {
    if (!userId || !reviewerId) {
      throw new ApiError(400, "User ID and Reviewer ID are required");
    }

    if (typeof status !== "boolean") {
      throw new ApiError(400, "Status must be a boolean value");
    }

    await checkStudentExists(userId);

    const affectedRows = await findStudentToSetStatus({
      userId,
      reviewerId,
      status,
    });

    if (affectedRows <= 0) {
      throw new ApiError(500, "Failed to update student status");
    }

    return {
      message: "Student status updated successfully",
      data: null,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error updating student status: ${error.message}`);
  }
};

/**
 * Deletes a student record
 * @param {number} id - Student ID
 * @returns {Object} - Success message
 * @throws {ApiError} - If student not found or deletion fails
 */
const deleteStudent = async (id) => {
  try {
    await checkStudentExists(id);

    const affectedRows = await deleteStudentById(id);

    if (affectedRows <= 0) {
      throw new ApiError(500, "Failed to delete student");
    }

    return {
      message: "Student deleted successfully",
      data: null,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error deleting student: ${error.message}`);
  }
};

module.exports = {
  getAllStudents,
  getStudentDetail,
  addNewStudent,
  updateStudent,
  setStudentStatus,
  deleteStudent,
};