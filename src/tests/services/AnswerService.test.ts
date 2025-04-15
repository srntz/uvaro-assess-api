import { AnswerService } from "../../services/implementations/AnswerService";
import { IContext } from "../../context/IContext";
import { mapAnswerEntityToAnswerResponseDTO } from "../../mappers/answer/mapAnswerEntityToAnswerResponseDTO";
import { AnswerRepository } from "../../repositories/implementations/AnswerRepository";
import { answer } from "../../db/schemas";
import { DatabaseConnection } from "../../db/DatabaseConnection";
import { eq } from "drizzle-orm";

describe("AnswerService", () => {
  let context: IContext;
  const db = DatabaseConnection.getInstance();

  beforeAll(() => {
    context = {
      CategoryService: null,
      AssessmentService: null,
      LevelService: null,
      UserService: null,
      QuestionService: null,
      AnswerService: new AnswerService(new AnswerRepository()),
      NotificationService: null,
    };
  });

  afterAll(async () => {
    await DatabaseConnection.getPool().end();
  });

  describe("getById()", () => {
    test("Existing answer", async () => {
      const ANSWER_ID = 1;

      const a = await context.AnswerService.getById(ANSWER_ID);
      const dbAnswers = await db
        .select()
        .from(answer)
        .where(eq(answer.answer_id, ANSWER_ID));

      expect(a).toEqual(mapAnswerEntityToAnswerResponseDTO(dbAnswers[0]));
    });

    test("Non-existing answer", async () => {
      const answer = await context.AnswerService.getById(99999);

      expect(answer).toBeNull();
    });
  });

  describe("getByQuestionId()", () => {
    test("Existing question", async () => {
      const QUESTION_ID = 1;

      const a = await context.AnswerService.getByQuestionId(QUESTION_ID);

      const dbAnswers = await db
        .select()
        .from(answer)
        .where(eq(answer.question_id, QUESTION_ID));

      expect(a.length).toBe(dbAnswers.length);
      expect(a).toEqual(
        dbAnswers.map((a) => mapAnswerEntityToAnswerResponseDTO(a)),
      );
    });

    test("Non-existing question", async () => {
      const answers = await context.AnswerService.getByQuestionId(999999);

      expect(answers).toEqual([]);
    });
  });
});
