import { UserService } from "../../services/implementations/UserService";
import { MockUserRepository } from "../mocks/MockUserRepository";
import { IContext } from "../../context/IContext";

let context: IContext;
const mockRepo = new MockUserRepository();

describe("User Service", () => {
  beforeAll(() => {
    context = {
      CategoryService: null,
      AssessmentService: null,
      LevelService: null, 
      UserService: new UserService(mockRepo),
      QuestionService: null,
      AnswerService: null,
      NotificationService: null,
    };
  });

  describe("getById", () => {
    test("returns user when exists", async () => {
      const user = await context.UserService.getById("user1");
      expect(user).toEqual({
        userId: "user1",
        email: "user1@example.com",
        firstName: "John",
        lastName: "Doe"
      });
    });
  });
});