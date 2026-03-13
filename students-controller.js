const asyncHandler = require("express-async-handler");
const {
  getAllStudents,
  addNewStudent,
  getStudentDetail,
  setStudentStatus,
  updateStudent,
  deleteStudent,
} = require("./students-service");
const { ApiError } = require("../../utils");

/**
 * @route   GET /api/v1/students
 * @desc    Retrieve all students with optional filters
 * @access  Private (requires authentication)
 * @query   {number} page - Page number (default: 1)
 * @query   {number} limit - Items per page (default: 10)
 * @query   {string} name - Filter by student name
 * @query   {string} className - Filter by class name
 * @query   {string} section - Filter by section
 * @query   {number} roll - Filter by roll number
 * @return  {Object} { success: boolean, data: array, pagination: object }
 */
const handleGetAllStudents = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    name,
    className,
    section,
    roll,
  } = req.query;

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const offset = (pageNum - 1) * limitNum;

  const payload = {
    name: name || null,
    className: className || null,
    section: section || null,
    roll: roll ? parseInt(roll) : null,
    limit: limitNum,
    offset,
  };

  const result = await getAllStudents(payload);

  return res.status(200).json({
    success: true,
    message: "Students retrieved successfully",
    data: result.students,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: result.total,
      totalPages: Math.ceil(result.total / limitNum),
    },
  });
});

/**
 * @route   POST /api/v1/students
 * @desc    Create a new student
 * @access  Private (requires authentication)
 * @body    {Object} Student data (name, email, phone, class, section, etc.)
 * @return  {Object} { success: boolean, message: string, data: object }
 */
const handleAddStudent = asyncHandler(async (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new ApiError(400, "Request body cannot be empty");
  }

  const result = await addNewStudent(req.body);

  return res.status(201).json({
    success: true,
    message: result.message,
    data: result.data || null,
  });
});

/**
 * @route   GET /api/v1/students/:id
 * @desc    Get detailed information about a specific student
 * @access  Private (requires authentication)
 * @params  {number} id - Student ID
 * @return  {Object} { success: boolean, data: object }
 */
const handleGetStudentDetail = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    throw new ApiError(400, "Valid student ID is required");
  }

  const student = await getStudentDetail(parseInt(id));

  return res.status(200).json({
    success: true,
    message: "Student details retrieved successfully",
    data: student,
  });
});

/**
 * @route   PUT /api/v1/students/:id
 * @desc    Update student information
 * @access  Private (requires authentication)
 * @params  {number} id - Student ID
 * @body    {Object} Updated student data
 * @return  {Object} { success: boolean, message: string }
 */
const handleUpdateStudent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    throw new ApiError(400, "Valid student ID is required");
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    throw new ApiError(400, "Request body cannot be empty");
  }

  const payload = {
    ...req.body,
    userId: parseInt(id),
  };

  const result = await updateStudent(payload);

  return res.status(200).json({
    success: true,
    message: result.message,
    data: result.data || null,
  });
});

/**
 * @route   POST /api/v1/students/:id/status
 * @desc    Update student status (activate/deactivate)
 * @access  Private (requires authentication + admin)
 * @params  {number} id - Student ID
 * @body    {Object} { status: boolean }
 * @return  {Object} { success: boolean, message: string }
 */
const handleStudentStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || isNaN(parseInt(id))) {
    throw new ApiError(400, "Valid student ID is required");
  }

  if (typeof status !== "boolean") {
    throw new ApiError(400, "Status must be a boolean value");
  }

  const reviewerId = req.user?.id;
  if (!reviewerId) {
    throw new ApiError(401, "Unauthorized: User ID not found");
  }

  const payload = {
    userId: parseInt(id),
    reviewerId,
    status,
  };

  const result = await setStudentStatus(payload);

  return res.status(200).json({
    success: true,
    message: result.message,
    data: result.data || null,
  });
});

/**
 * @route   DELETE /api/v1/students/:id
 * @desc    Delete a student record
 * @access  Private (requires authentication + admin)
 * @params  {number} id - Student ID
 * @return  {Object} { success: boolean, message: string }
 */
const handleDeleteStudent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    throw new ApiError(400, "Valid student ID is required");
  }

  const result = await deleteStudent(parseInt(id));

  return res.status(200).json({
    success: true,
    message: result.message,
  });
});

module.exports = {
  handleGetAllStudents,
  handleGetStudentDetail,
  handleAddStudent,
  handleUpdateStudent,
  handleStudentStatus,
  handleDeleteStudent,
};