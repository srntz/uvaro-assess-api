import { IContext } from "../../context/IContext";
import { validateArgs } from "../../validation/validation";
import { z } from 'zod';
import { IContextWithAuth } from "../../context/IContext";
import { withAuthenticationRequired } from "../middleware/withAuthenticationRequired";

// mutation schemas
const userInputSchema = z.object({
  user: z.object({
    first_name: z.string({
      required_error: "First name is required",
      invalid_type_error: "First name must be a string"
    }).min(1, "First name cannot be empty"),
    last_name: z.string({
      required_error: "Last name is required",
      invalid_type_error: "Last name must be a string"
    }).min(1, "Last name cannot be empty"),
    email: z.string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string"
    }).email("Invalid email format")
  })
});

const deleteUserSchema = z.object({
  user_id: z.string({
    required_error: "User ID is required",
    invalid_type_error: "User ID must be a string"
  }).min(1, "User ID cannot be empty")
});


const userResolvers = {
  Query: {
    getUser: withAuthenticationRequired(
      async (_, __, { UserService, AuthenticatedUser }: IContextWithAuth) => {
        return await UserService.getById(AuthenticatedUser.userId);
      },
    ),
  },
};

export default userResolvers;
