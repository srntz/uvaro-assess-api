import { QuestionService } from "../../services/implementations/QuestionService";
import { MockQuestionRepository } from "../mocks/MockQuestionRepository";
import { IContext } from "../../context/IContext";

let context: IContext;
const mockRepo = new MockQuestionRepository();

describe("Question Service", () => {
  beforeAll(() => {
    context = {
      CategoryService: null,
      AssessmentService: null,
      LevelService: null, 
      UserService: null,
      QuestionService: new QuestionService(mockRepo),
      AnswerService: null,
      NotificationService: null,
    };
  });

  describe("getQuestionById", () => {
    test("returns correct question", async () => {
      const question = await context.QuestionService.getQuestionById(1);
      expect(question).toEqual({
        questionId: 1,
        questionText: "What is your experience level?",
        categoryId: 1,
        weightingCoefficient: 0.8,
        followUp: false
      });
    });

    test("returns null for non-existent ID", async () => {
      const question = await context.QuestionService.getQuestionById(999);
      expect(question).toBeNull();
    });
  });

  describe("getFollowupQuestionsByCategory", () => {
    test("returns only follow-up questions", async () => {
      const questions = await context.QuestionService.getFollowupQuestionsByCategory(1);
      expect(questions).toHaveLength(1);
      expect(questions[0].questionId).toBe(2);
    });
  });

  describe("getRegularQuestionsByCategory", () => {
    test("returns only regular questions", async () => {
      const questions = await context.QuestionService.getRegularQuestionsByCategory(1);
      expect(questions).toHaveLength(1);
      expect(questions[0].questionId).toBe(1);
    });
  });
});