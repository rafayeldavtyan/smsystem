const { db } = require("../../config");
const { ApiError } = require("../../utils");

/**
 * Finds all students with optional filters and pagination
 * @param {Object} payload - { name, className, section, roll, limit, offset }
 * @returns {Object} - { students: array, total: number }
 */
const findAllStudents = async (payload) => {
  const { name, className, section, roll, limit, offset } = payload;

  try {
    let query = `
      SELECT u.id, u.name, u.email, u.is_active,
             u.created_dt, u.updated_dt,
             up.gender, up.dob, up.phone,
             up.class_name, up.section_name, up.roll,
             up.father_name, up.mother_name,
             r.name as role_name
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.role_id = (SELECT id FROM roles WHERE name = 'Student')
    `;

    const params = [];
    let paramCount = 1;

    if (name) {
      query += ` AND u.name ILIKE $${paramCount}`;
      params.push(`%${name}%`);
      paramCount++;
    }

    if (className) {
      query += ` AND up.class_name = $${paramCount}`;
      params.push(className);
      paramCount++;
    }

    if (section) {
      query += ` AND up.section_name = $${paramCount}`;
      params.push(section);
      paramCount++;
    }

    if (roll) {
      query += ` AND up.roll = $${paramCount}`;
      params.push(roll);
      paramCount++;
    }

    // Get total count
    const countQuery = query.replace(
      /SELECT.*?FROM/,
      "SELECT COUNT(*) as total FROM"
    );
    const countResult = await db.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total) || 0;

    // Get paginated results
    query += ` ORDER BY u.created_dt DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    return {
      students: result.rows || [],
      total,
    };
  } catch (error) {
    throw new ApiError(
      500,
      `Database error retrieving students: ${error.message}`
    );
  }
};

/**
 * Finds a specific student by ID
 * @param {number} id - Student ID
 * @returns {Object} - Student details
 */
const findStudentDetail = async (id) => {
  try {
    const query = `
      SELECT u.id, u.name, u.email, u.is_active, u.is_email_verified,
             u.created_dt, u.updated_dt, u.last_login,
             up.gender, up.dob, up.phone,
             up.class_name, up.section_name, up.roll,
             up.admission_dt, up.father_name, up.father_phone,
             up.mother_name, up.mother_phone,
             up.guardian_name, up.guardian_phone,
             up.relation_of_guardian,
             up.current_address, up.permanent_address,
             r.name as role_name
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.id = $1
    `;

    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    throw new ApiError(
      500,
      `Database error retrieving student detail: ${error.message}`
    );
  }
};

/**
 * Adds a new student or updates existing one
 * @param {Object} payload - Student data
 * @returns {Object} - { status: boolean, message: string, userId: number, data: object }
 */
const addOrUpdateStudent = async (payload) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const {
      userId,
      name,
      email,
      phone,
      gender,
      dob,
      class: className,
      section,
      roll,
      admissionDate,
      fatherName,
      fatherPhone,
      motherName,
      motherPhone,
      guardianName,
      guardianPhone,
      relationOfGuardian,
      currentAddress,
      permanentAddress,
      systemAccess,
    } = payload;

    let studentId = userId;

    if (!userId) {
      // Insert new user
      const userQuery = `
        INSERT INTO users (name, email, role_id, is_active, created_dt)
        SELECT $1, $2, id, $3, CURRENT_TIMESTAMP
        FROM roles WHERE name = 'Student'
        RETURNING id
      `;

      const userResult = await client.query(userQuery, [name, email, systemAccess || false]);
      studentId = userResult.rows[0].id;

      // Insert user profile
      const profileQuery = `
        INSERT INTO user_profiles (
          user_id, gender, dob, phone, class_name, section_name,
          roll, admission_dt, father_name, father_phone,
          mother_name, mother_phone, guardian_name, guardian_phone,
          relation_of_guardian, current_address, permanent_address
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      `;

      await client.query(profileQuery, [
        studentId, gender, dob, phone, className, section,
        roll, admissionDate, fatherName, fatherPhone,
        motherName, motherPhone, guardianName, guardianPhone,
        relationOfGuardian, currentAddress, permanentAddress,
      ]);
    } else {
      // Update existing user
      const updateUserQuery = `
        UPDATE users 
        SET name = COALESCE($1, name),
            email = COALESCE($2, email),
            updated_dt = CURRENT_TIMESTAMP
        WHERE id = $3
      `;

      await client.query(updateUserQuery, [name || null, email || null, studentId]);

      // Update user profile
      const updateProfileQuery = `
        UPDATE user_profiles 
        SET gender = COALESCE($1, gender),
            dob = COALESCE($2, dob),
            phone = COALESCE($3, phone),
            class_name = COALESCE($4, class_name),
            section_name = COALESCE($5, section_name),
            roll = COALESCE($6, roll),
            admission_dt = COALESCE($7, admission_dt),
            father_name = COALESCE($8, father_name),
            father_phone = COALESCE($9, father_phone),
            mother_name = COALESCE($10, mother_name),
            mother_phone = COALESCE($11, mother_phone),
            guardian_name = COALESCE($12, guardian_name),
            guardian_phone = COALESCE($13, guardian_phone),
            relation_of_guardian = COALESCE($14, relation_of_guardian),
            current_address = COALESCE($15, current_address),
            permanent_address = COALESCE($16, permanent_address),
            updated_dt = CURRENT_TIMESTAMP
        WHERE user_id = $17
      `;

      await client.query(updateProfileQuery, [
        gender || null, dob || null, phone || null, className || null,
        section || null, roll || null, admissionDate || null,
        fatherName || null, fatherPhone || null,
        motherName || null, motherPhone || null,
        guardianName || null, guardianPhone || null,
        relationOfGuardian || null, currentAddress || null,
        permanentAddress || null, studentId,
      ]);
    }

    await client.query("COMMIT");

    return {
      status: true,
      message: userId ? "Student updated successfully" : "Student added successfully",
      userId: studentId,
      data: null,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw new ApiError(
      500,
      `Database error: ${error.message}`
    );
  } finally {
    client.release();
  }
};

/**
 * Updates student status
 * @param {Object} payload - { userId, reviewerId, status }
 * @returns {number} - Number of affected rows
 */
const findStudentToSetStatus = async ({ userId, reviewerId, status }) => {
  try {
    const query = `
      UPDATE users
      SET is_active = $1,
          status_last_reviewed_dt = CURRENT_TIMESTAMP,
          status_last_reviewer_id = $2,
          updated_dt = CURRENT_TIMESTAMP
      WHERE id = $3
    `;

    const result = await db.query(query, [status, reviewerId, userId]);
    return result.rowCount;
  } catch (error) {
    throw new ApiError(500, `Database error updating status: ${error.message}`);
  }
};

/**
 * Deletes a student record
 * @param {number} id - Student ID
 * @returns {number} - Number of affected rows
 */
const deleteStudentById = async (id) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Delete user profile first
    await client.query("DELETE FROM user_profiles WHERE user_id = $1", [id]);

    // Delete user
    const result = await client.query("DELETE FROM users WHERE id = $1", [id]);

    await client.query("COMMIT");

    return result.rowCount;
  } catch (error) {
    await client.query("ROLLBACK");
    throw new ApiError(500, `Database error deleting student: ${error.message}`);
  } finally {
    client.release();
  }
};

module.exports = {
  findAllStudents,
  findStudentDetail,
  addOrUpdateStudent,
  findStudentToSetStatus,
  deleteStudentById,
};