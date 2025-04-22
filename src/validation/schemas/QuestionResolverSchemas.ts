import z from "zod";

// Input validation schemas for endpoints found in question.resolver.ts

export const getFollowUpQuestionsByCategorySchema = z.object({
  categoryId: z
    .number({
      required_error: "Category ID is required",
      invalid_type_error: "Category ID must be a number",
    })
    .int()
    .min(1)
    .positive("Category ID must be a positive integer"),
});
