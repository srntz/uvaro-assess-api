import { z } from "zod";

export const getAssessmentByIdSchema = z.object({
  id: z
    .number({
      required_error: "Assessment ID is required",
      invalid_type_error: "Assessment ID must be a number",
    })
    .int()
    .min(1)
    .positive("Assessment ID must be a positive integer"),
});

export const endAssessmentSchema = z.object({
  assessmentId: z
    .number({
      required_error: "Assessment ID is required",
      invalid_type_error: "Assessment ID must be a number",
    })
    .int()
    .min(0)
    .positive("Assessment ID must be a positive integer"),
});

export const insertNoteSchema = z.object({
  assessmentId: z
    .number({
      required_error: "Assessment ID is required",
      invalid_type_error: "Assessment ID must be a number",
    })
    .int()
    .min(1)
    .positive("Assessment ID must be a positive integer"),
  categoryId: z
    .number({
      required_error: "Category ID is required",
      invalid_type_error: "Category ID must be a number",
    })
    .int()
    .min(1)
    .positive("Category ID must be a positive integer"),
  noteText: z
    .string({
      required_error: "Note text is required",
      invalid_type_error: "Note text must be a string",
    })
    .min(1, "Note text cannot be empty"),
});
