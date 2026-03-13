const { z } = require("zod");

/**
 * Zod schema for creating a new student
 */
const createStudentSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters"),
    email: z.string().email("Invalid email format"),
    phone: z
      .string()
      .regex(/^\+?[\d\s-()]+$/, "Invalid phone number format"),
    gender: z.enum(["Male", "Female", "Other"], {
      errorMap: () => ({ message: "Invalid gender" }),
    }),
    dob: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date of birth",
    }),
    class: z.string().max(50, "Class must not exceed 50 characters"),
    section: z.string().max(50, "Section must not exceed 50 characters"),
    roll: z.number().int().positive("Roll must be a positive number").optional(),
    admissionDate: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid admission date",
      })
      .optional(),
    fatherName: z.string().max(50, "Father name must not exceed 50 characters"),
    fatherPhone: z
      .string()
      .regex(/^\+?[\d\s-()]+$/, "Invalid phone number format")
      .optional(),
    motherName: z.string().max(50, "Mother name must not exceed 50 characters"),
    motherPhone: z
      .string()
      .regex(/^\+?[\d\s-()]+$/, "Invalid phone number format")
      .optional(),
    guardianName: z.string().max(50, "Guardian name must not exceed 50 characters"),
    guardianPhone: z
      .string()
      .regex(/^\+?[\d\s-()]+$/, "Invalid phone number format"),
    relationOfGuardian: z.string().max(30, "Relation must not exceed 30 characters"),
    currentAddress: z.string().max(100, "Address must not exceed 100 characters"),
    permanentAddress: z.string().max(100, "Address must not exceed 100 characters"),
    systemAccess: z.boolean().optional(),
  }),
});

/**
 * Zod schema for updating a student
 */
const updateStudentSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters")
      .optional(),
    email: z.string().email("Invalid email format").optional(),
    phone: z
      .string()
      .regex(/^\+?[\d\s-()]+$/, "Invalid phone number format")
      .optional(),
    gender: z
      .enum(["Male", "Female", "Other"])
      .optional(),
    dob: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date of birth",
      })
      .optional(),
    class: z
      .string()
      .max(50, "Class must not exceed 50 characters")
      .optional(),
    section: z
      .string()
      .max(50, "Section must not exceed 50 characters")
      .optional(),
    roll: z.number().int().positive().optional(),
    admissionDate: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid admission date",
      })
      .optional(),
    fatherName: z
      .string()
      .max(50, "Father name must not exceed 50 characters")
      .optional(),
    fatherPhone: z
      .string()
      .regex(/^\+?[\d\s-()]+$/, "Invalid phone number format")
      .optional(),
    motherName: z
      .string()
      .max(50, "Mother name must not exceed 50 characters")
      .optional(),
    motherPhone: z
      .string()
      .regex(/^\+?[\d\s-()]+$/, "Invalid phone number format")
      .optional(),
    guardianName: z
      .string()
      .max(50, "Guardian name must not exceed 50 characters")
      .optional(),
    guardianPhone: z
      .string()
      .regex(/^\+?[\d\s-()]+$/, "Invalid phone number format")
      .optional(),
    relationOfGuardian: z
      .string()
      .max(30, "Relation must not exceed 30 characters")
      .optional(),
    currentAddress: z
      .string()
      .max(100, "Address must not exceed 100 characters")
      .optional(),
    permanentAddress: z
      .string()
      .max(100, "Address must not exceed 100 characters")
      .optional(),
  }),
});

/**
 * Zod schema for getting all students
 */
const getAllStudentsSchema = z.object({
  query: z.object({
    page: z
      .string()
      .transform((val) => parseInt(val))
      .refine((val) => !isNaN(val) && val > 0, "Page must be a positive number")
      .optional(),
    limit: z
      .string()
      .transform((val) => parseInt(val))
      .refine((val) => !isNaN(val) && val > 0 && val <= 100, "Limit must be between 1 and 100")
      .optional(),
    name: z.string().max(100).optional(),
    className: z.string().max(50).optional(),
    section: z.string().max(50).optional(),
    roll: z
      .string()
      .transform((val) => parseInt(val))
      .refine((val) => !isNaN(val) && val > 0, "Roll must be a positive number")
      .optional(),
  }),
});

/**
 * Zod schema for updating student status
 */
const studentStatusSchema = z.object({
  body: z.object({
    status: z.boolean({
      errorMap: () => ({ message: "Status must be a boolean value" }),
    }),
  }),
});

module.exports = {
  createStudentSchema,
  updateStudentSchema,
  getAllStudentsSchema,
  studentStatusSchema,
};