import { UserRepository } from "../../repositories/implementations/UserRepository";
import { db } from "../../db/DatabaseConnection";
import { user as userTable } from "../../db/schemas";
import { eq } from "drizzle-orm";
import { User } from "../../models/User";
import { UserUpdateDTO } from "../../dto/UserUpdateDTO";

describe("UserRepository", () => {
  let userRepository: UserRepository;
  const testUserId = "test-user-123";
  const testUserEmail = "test@example.com";

  beforeAll(() => {
    userRepository = new UserRepository();
  });

  afterAll(async () => {
    // clean up test data
    await db.delete(userTable).where(eq(userTable.user_id, testUserId));
    await db.end();
  });

  describe("getById()", () => {
    it("should return a user when it exists", async () => {
      // create test user
      await db.insert(userTable).values({
        user_id: testUserId,
        email: testUserEmail,
        first_name: "Test",
        last_name: "User"
      });

      const result = await userRepository.getById(testUserId);

      expect(result).toBeDefined();
      expect(result.user_id).toBe(testUserId);
      expect(result.email).toBe(testUserEmail);
    });

    it("should return undefined when user doesn't exist", async () => {
      const result = await userRepository.getById("non-existent-user");
      expect(result).toBeUndefined();
    });
  });

  describe("updateUser()", () => {
    it("should update user information", async () => {
      // create test user
      await db.insert(userTable).values({
        user_id: testUserId,
        email: testUserEmail,
        first_name: "Original",
        last_name: "Name"
      });

      const updateDTO: UserUpdateDTO = {
        id: testUserId,
        firstName: "Updated",
        lastName: "User",
        email: "updated@example.com"
      };

      const result = await userRepository.updateUser(updateDTO);

      expect(result).toBeDefined();
      expect(result.first_name).toBe("Updated");
      expect(result.last_name).toBe("User");
      expect(result.email).toBe("updated@example.com");

      // verify update in database
      const [updatedUser] = await db
        .select()
        .from(userTable)
        .where(eq(userTable.user_id, testUserId));
      expect(updatedUser.first_name).toBe("Updated");
    });

    it("should throw error when updating non-existent user", async () => {
      const updateDTO: UserUpdateDTO = {
        id: "non-existent-user",
        firstName: "Test",
        lastName: "User",
        email: "test@example.com"
      };

      await expect(userRepository.updateUser(updateDTO)).rejects.toThrow();
    });
  });

  describe("insertUser()", () => {
    it("should create a new user", async () => {
      const newUser = new User(
        "new-user-456",
        "new@example.com",
        "New",
        "User"
      );

      const result = await userRepository.insertUser(newUser);

      expect(result).toBeInstanceOf(User);
      expect(result.user_id).toBe("new-user-456");
      expect(result.email).toBe("new@example.com");

      // clean up
      await db.delete(userTable).where(eq(userTable.user_id, "new-user-456"));
    });

    it("should throw error for invalid user data", async () => {
      const invalidUser = {
        user_id: "invalid-user",
        email: "invalid",
        first_name: "Invalid",
        last_name: "User"
      } as any; // force invalid type

      await expect(userRepository.insertUser(invalidUser)).rejects.toThrow();
    });
  });

  describe("deleteUser()", () => {
    it("should delete a user and return the deleted record", async () => {
      // create test user to delete
      const [userToDelete] = await db
        .insert(userTable)
        .values({
          user_id: "user-to-delete",
          email: "delete@example.com",
          first_name: "Delete",
          last_name: "Me"
        })
        .returning();

      const result = await userRepository.deleteUser("user-to-delete");

      expect(result).toBeInstanceOf(User);
      expect(result.user_id).toBe("user-to-delete");

      // verify deletion
      const deletedUser = await userRepository.getById("user-to-delete");
      expect(deletedUser).toBeUndefined();
    });

    it("should throw error when deleting non-existent user", async () => {
      await expect(userRepository.deleteUser("non-existent-user")).rejects.toThrow();
    });
  });

  describe("User.init()", () => {
    it("should properly initialize a User model", () => {
      const testData = {
        user_id: "test-init",
        email: "init@example.com",
        first_name: "Test",
        last_name: "Init"
      };

      const user = User.init(testData);
      
      expect(user).toBeInstanceOf(User);
      expect(user.user_id).toBe("test-init");
      expect(user.email).toBe("init@example.com");
    });

    it("should throw InvalidModelConstructionException for invalid data", () => {
      const invalidData = {
        user_id: 123, // invalid type
        email: "test@example.com",
        first_name: "Test",
        last_name: "User"
      };

      expect(() => User.init(invalidData as any)).toThrow("InvalidModelConstructionException");
    });
  });
});