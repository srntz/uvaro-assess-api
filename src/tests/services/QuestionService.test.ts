import { QuestionService } from "../../services/implementations/QuestionService";
import { MockQuestionRepository } from "../mocks/MockQuestionRepository";
import { IContext } from "../../context/IContext";
import { QuestionRepository } from "../../repositories/implementations/QuestionRepository";
import { DatabaseConnection } from "../../db/DatabaseConnection";
import { QuestionResponseDTO } from "../../dto/question/QuestionResponseDTO";
import { question } from "../../db/schemas";
import { and, eq } from "drizzle-orm";
import { mapQuestionEntityToQuestionResponseDTO } from "../../mappers/question/mapQuestionEntityToQuestionResponseDTO";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

describe("Question Service", () => {
  let context: IContext;
  const db = DatabaseConnection.getInstance();

  beforeAll(() => {
    context = {
      CategoryService: null,
      AssessmentService: null,
      LevelService: null,
      UserService: null,
      QuestionService: new QuestionService(new QuestionRepository()),
      AnswerService: null,
      NotificationService: null,
    };
  });

  describe("getQuestionById()", () => {
    test("Existing question", async () => {
      const QUESTION_ID = 1;

      const q = await context.QuestionService.getQuestionById(QUESTION_ID);
      const dbQuestion = await db
        .select()
        .from(question)
        .where(eq(question.question_id, QUESTION_ID));

      expect(q).toBeTruthy();
      expect(q).toBeInstanceOf(QuestionResponseDTO);
      expect(q).toEqual(mapQuestionEntityToQuestionResponseDTO(dbQuestion[0]));
    });

    test("Non-existing question", async () => {
      const question = await context.QuestionService.getQuestionById(999999);

      expect(question).toBeNull();
    });
  });

  describe("getFollowupQuestionsByCategory()", () => {
    test("Existing category", async () => {
      const CATEGORY_ID = 1;

      const q = await context.QuestionService.getFollowupQuestionsByCategory(1);

      const dbQuestions = await db
        .select()
        .from(question)
        .where(
          and(
            eq(question.category_id, CATEGORY_ID),
            eq(question.follow_up, true),
          ),
        );

      expect(q.length).toEqual(dbQuestions.length);
      expect(q).toEqual(
        dbQuestions.map((q) => mapQuestionEntityToQuestionResponseDTO(q)),
      );
    });

    test("Non-existing category", async () => {
      const q =
        await context.QuestionService.getFollowupQuestionsByCategory(999999);

      expect(q).toHaveLength(0);
      expect(q).toEqual([]);
    });
  });

  describe("getRegularQuestionsByCategory()", () => {
    test("Existing category", async () => {
      const CATEGORY_ID = 1;

      const q =
        await context.QuestionService.getRegularQuestionsByCategory(
          CATEGORY_ID,
        );

      const dbQuestions = await db
        .select()
        .from(question)
        .where(
          and(
            eq(question.category_id, CATEGORY_ID),
            eq(question.follow_up, false),
          ),
        );

      expect(q.length).toEqual(dbQuestions.length);
      expect(q).toEqual(
        dbQuestions.map((q) => mapQuestionEntityToQuestionResponseDTO(q)),
      );
    });

    test("Non-existing category", async () => {
      const q =
        await context.QuestionService.getRegularQuestionsByCategory(999999);

      expect(q).toHaveLength(0);
      expect(q).toEqual([]);
    });
  });
});
