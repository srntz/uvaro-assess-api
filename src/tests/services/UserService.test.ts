import { UserService } from "../../services/implementations/UserService";
import { MockUserRepository } from "../mocks/MockUserRepository";
import { IContext } from "../../context/IContext";
import { UserRepository } from "../../repositories/implementations/UserRepository";
import { user } from "../../db/schemas";
import { DatabaseConnection } from "../../db/DatabaseConnection";
import { eq } from "drizzle-orm";
import { mapUserEntityToUserResponseDTO } from "../../mappers/user/mapUserEntityToUserResponseDTO";

describe("User Service", () => {
  let context: IContext;
  const db = DatabaseConnection.getInstance();

  const USER_ID = "abcd1234";

  beforeAll(() => {
    context = {
      CategoryService: null,
      AssessmentService: null,
      LevelService: null,
      UserService: new UserService(new UserRepository()),
      QuestionService: null,
      AnswerService: null,
      NotificationService: null,
    };
  });

  beforeEach(async () => {
    await db.insert(user).values({
      user_id: USER_ID,
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
    });
  });

  afterEach(async () => {
    await db.delete(user);
  });

  describe("getById()", () => {
    test("Existing user", async () => {
      const u = await context.UserService.getById(USER_ID);

      const dbUser = await db
        .select()
        .from(user)
        .where(eq(user.user_id, USER_ID));

      expect(u).toEqual(mapUserEntityToUserResponseDTO(dbUser[0]));
    });

    test("Non-existing user", async () => {
      const u = await context.UserService.getById("999999999");

      expect(u).toEqual(null);
    });
  });
});
