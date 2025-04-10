import { DatabaseConnection } from "../../db/DatabaseConnection";
import {
  answer,
  assessment,
  assessmentAnswer,
  assessmentLevel,
  question,
  user,
} from "../../db/schemas";
import { IContext } from "../../context/IContext";
import { AssessmentService } from "../../services/implementations/AssessmentService";
import { AssessmentRepository } from "../../repositories/implementations/AssessmentRepository";
import { LevelRepository } from "../../repositories/implementations/LevelRepository";
import { CategoryRepository } from "../../repositories/implementations/CategoryRepository";
import { AnswerRepository } from "../../repositories/implementations/AnswerRepository";
import { QuestionRepository } from "../../repositories/implementations/QuestionRepository";
import { AssessmentResponseDTO } from "../../dto/assessment/AssessmentResponseDTO";
import { AnswerResponseDTO } from "../../dto/answer/AnswerResponseDTO";
import { and, eq } from "drizzle-orm";
import { AnswerRequestDTO } from "../../dto/answer/AnswerRequestDTO";
import { LevelResponseDTO } from "../../dto/level/LevelResponseDTO";

describe("AssessmentService", () => {
  const db = DatabaseConnection.getInstance();

  const context: IContext = {
    AssessmentService: new AssessmentService(
      new AssessmentRepository(),
      new LevelRepository(),
      new CategoryRepository(),
      new AnswerRepository(),
      new QuestionRepository(),
    ),
    UserService: null,
    QuestionService: null,
    AnswerService: null,
    NotificationService: null,
    CategoryService: null,
    LevelService: null,
  };

  let assessmentId: number;

  beforeEach(async () => {
    await db.insert(user).values({
      user_id: "1",
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
    });

    const insertedAssessment = await db
      .insert(assessment)
      .values({
        user_id: "1",
      })
      .returning();
    assessmentId = insertedAssessment[0].assessment_id;
  });

  afterEach(async () => {
    await db.delete(assessment);
    await db.delete(user);
  });

  afterAll(async () => {
    await DatabaseConnection.getPool().end();
  });

  describe("getAssessmentById()", () => {
    test("Existing assessment", async () => {
      const assessment =
        await context.AssessmentService.getAssessmentById(assessmentId);

      expect(assessment).toBeInstanceOf(AssessmentResponseDTO);
      expect(assessment).toBeTruthy();
    });

    test("Non-existing assessment", async () => {
      const assessment =
        await context.AssessmentService.getAssessmentById(9999);

      expect(assessment).toBeNull();
    });
  });

  describe("getUserAssessments()", () => {
    test("Existing user, multiple assessments", async () => {
      await DatabaseConnection.getInstance()
        .insert(assessment)
        .values({ user_id: "1" });

      const assessments =
        await context.AssessmentService.getUserAssessments("1");

      expect(assessments.length).toBe(2);

      assessments.forEach((assessment) => {
        expect(assessment).toBeTruthy();
        expect(assessment).toBeInstanceOf(AssessmentResponseDTO);
      });
    });

    test("Existing user, no assessments", async () => {
      await db.insert(user).values({
        user_id: "2",
        first_name: "John",
        last_name: "Doe",
        email: "johndoe@example.com",
      });

      const assessments =
        await context.AssessmentService.getUserAssessments("2");

      expect(assessments.length).toBe(0);
      expect(assessments).toEqual([]);
    });

    test("Non-existing user", async () => {
      const assessments =
        await context.AssessmentService.getUserAssessments("9999999");

      expect(assessments.length).toBe(0);
      expect(assessments).toEqual([]);
    });
  });

  describe("addAssessment()", () => {
    test("Existing user", async () => {
      const assessment = await context.AssessmentService.addAssessment("1");

      expect(assessment).toBeTruthy();
      expect(assessment).toBeInstanceOf(AssessmentResponseDTO);
    });

    test("Non-existing user", async () => {
      await expect(
        async () => await context.AssessmentService.addAssessment("9999"),
      ).rejects.toThrow();
    });
  });

  describe("getAssessmentAnswers()", () => {
    test("Existing assessment, no answers", async () => {
      const answers =
        await context.AssessmentService.getAssessmentAnswers(assessmentId);

      expect(answers.length).toBe(0);
      expect(answers).toEqual([]);
    });

    test("Existing assessment, multiple answers", async () => {
      await db.insert(assessmentAnswer).values([
        {
          assessment_id: assessmentId,
          question_id: 1,
          answer_id: 1,
        },
        {
          assessment_id: assessmentId,
          question_id: 2,
          answer_id: 6,
        },
      ]);

      const answers =
        await context.AssessmentService.getAssessmentAnswers(assessmentId);

      expect(answers.length).toBe(2);

      answers.forEach((answer) => {
        expect(answer).toBeInstanceOf(AnswerResponseDTO);
      });
    });

    test("Non-existing assessment", async () => {
      const answers =
        await context.AssessmentService.getAssessmentAnswers(99999);

      expect(answers.length).toBe(0);
      expect(answers).toEqual([]);
    });
  });

  describe("calculateLevel()", () => {
    const WEIGHTING_ID = 1;
    const CATEGORY_ID = 1;
    let answerMap: Map<number, AnswerRequestDTO>;

    beforeAll(async () => {
      const questionsWithAnswers = await db
        .select()
        .from(question)
        .leftJoin(answer, eq(question.question_id, answer.question_id))
        .where(
          and(
            eq(question.category_id, CATEGORY_ID),
            eq(question.follow_up, false),
          ),
        );

      answerMap = new Map<number, AnswerRequestDTO>();

      questionsWithAnswers.forEach((group) => {
        if (
          !answerMap.has(group.question.question_id) &&
          group.answer.weighting_id === WEIGHTING_ID
        ) {
          answerMap.set(
            group.question.question_id,
            new AnswerRequestDTO(
              group.answer.answer_id,
              group.question.question_id,
            ),
          );
        }
      });
    });

    test("All required answers present", async () => {
      const level = await context.AssessmentService.calculateLevel(
        Array.from(answerMap.values()),
        CATEGORY_ID,
      );

      expect(level.weightingId).toBe(WEIGHTING_ID);
      expect(level.categoryId).toBe(CATEGORY_ID);
    });

    test("Not all required answers are present", async () => {
      const answerArray = Array.from(answerMap.values());
      await expect(
        async () =>
          await context.AssessmentService.calculateLevel(
            answerArray.slice(0, 1),
            CATEGORY_ID,
          ),
      ).rejects.toThrow();
    });

    test("No answers provided", async () => {
      const answerArray = Array.from(answerMap.values());
      await expect(
        async () =>
          await context.AssessmentService.calculateLevel(
            answerArray.slice(0, 0),
            CATEGORY_ID,
          ),
      ).rejects.toThrow();
    });

    test("Invalid category", async () => {
      const answerArray = Array.from(answerMap.values());
      await expect(
        async () =>
          await context.AssessmentService.calculateLevel(
            answerArray.slice(0, 1),
            9999,
          ),
      ).rejects.toThrow();
    });
  });

  describe("completeCategory()", () => {
    const WEIGHTING_ID = 1;
    const CATEGORY_ID = 1;
    let answerMap: Map<number, AnswerRequestDTO>;

    beforeAll(async () => {
      const questionsWithAnswers = await db
        .select()
        .from(question)
        .leftJoin(answer, eq(question.question_id, answer.question_id))
        .where(
          and(
            eq(question.category_id, CATEGORY_ID),
            eq(question.follow_up, false),
          ),
        );

      answerMap = new Map<number, AnswerRequestDTO>();

      questionsWithAnswers.forEach((group) => {
        if (
          !answerMap.has(group.question.question_id) &&
          group.answer.weighting_id === WEIGHTING_ID
        ) {
          answerMap.set(
            group.question.question_id,
            new AnswerRequestDTO(
              group.answer.answer_id,
              group.question.question_id,
            ),
          );
        }
      });
    });

    test("Existing assessment, all required questions are present", async () => {
      const level = await context.AssessmentService.completeCategory(
        CATEGORY_ID,
        assessmentId,
        Array.from(answerMap.values()),
      );

      expect(level).toBeTruthy();
      expect(level.weightingId).toBe(WEIGHTING_ID);
      expect(level.categoryId).toBe(CATEGORY_ID);
    });

    test("Existing assessment, not all required questions are present", async () => {
      await expect(
        async () =>
          await context.AssessmentService.completeCategory(
            CATEGORY_ID,
            assessmentId,
            Array.from(answerMap.values()).slice(0, 1),
          ),
      ).rejects.toThrow();
    });

    test("Existing assessment, no answers provided", async () => {
      await expect(
        async () =>
          await context.AssessmentService.completeCategory(
            CATEGORY_ID,
            assessmentId,
            Array.from(answerMap.values()).slice(0, 0),
          ),
      ).rejects.toThrow();
    });

    test("Non-existing assessment", async () => {
      await expect(
        async () =>
          await context.AssessmentService.completeCategory(
            CATEGORY_ID,
            999999,
            Array.from(answerMap.values()),
          ),
      ).rejects.toThrow();
    });

    test("Invalid category", async () => {
      await expect(
        async () =>
          await context.AssessmentService.completeCategory(
            999999,
            assessmentId,
            Array.from(answerMap.values()),
          ),
      ).rejects.toThrow();
    });
  });

  describe("endAssessment()", () => {
    const WEIGHTING_ID = 1;
    const categoryQuestionMap = new Map<
      number,
      Map<number, AnswerRequestDTO>
    >();

    beforeAll(async () => {
      const questionsWithAnswers = await db
        .select()
        .from(question)
        .leftJoin(answer, eq(question.question_id, answer.question_id))
        .where(eq(question.follow_up, false));

      for (let i = 0; i < questionsWithAnswers.length; i++) {
        if (
          categoryQuestionMap.has(questionsWithAnswers[i].question.category_id)
        ) {
          continue;
        }

        const questionMap = new Map<number, AnswerRequestDTO>();

        for (let j = 0; j < questionsWithAnswers.length; j++) {
          if (
            !questionMap.has(questionsWithAnswers[j].question.question_id) &&
            questionsWithAnswers[j].question.category_id ===
              questionsWithAnswers[i].question.category_id &&
            questionsWithAnswers[j].answer.weighting_id === WEIGHTING_ID
          ) {
            questionMap.set(
              questionsWithAnswers[j].question.question_id,
              new AnswerRequestDTO(
                questionsWithAnswers[j].answer.answer_id,
                questionsWithAnswers[j].question.question_id,
              ),
            );
          }
        }

        categoryQuestionMap.set(
          questionsWithAnswers[i].question.category_id,
          questionMap,
        );
      }
    });

    test("Existing assessment, all categories completed", async () => {
      const categoryMapArray = Array.from(categoryQuestionMap.entries());

      for (let i = 0; i < categoryMapArray.length; i++) {
        await context.AssessmentService.completeCategory(
          categoryMapArray[i][0],
          assessmentId,
          Array.from(categoryMapArray[i][1].values()),
        );
      }

      const levels =
        await context.AssessmentService.endAssessment(assessmentId);

      expect(levels.length).toBe(4);
      levels.forEach((level) => {
        expect(level).toBeInstanceOf(LevelResponseDTO);
        expect(level.weightingId).toBe(WEIGHTING_ID);
      });
    });

    test("Existing assessment, not all categories completed", async () => {
      const categoryMapArray = Array.from(categoryQuestionMap.entries());

      for (let i = 0; i < categoryMapArray.length - 1; i++) {
        await context.AssessmentService.completeCategory(
          categoryMapArray[i][0],
          assessmentId,
          Array.from(categoryMapArray[i][1].values()),
        );
      }

      await expect(
        async () => await context.AssessmentService.endAssessment(assessmentId),
      ).rejects.toThrow();
    });

    test("Non-existing assessment", async () => {
      const categoryMapArray = Array.from(categoryQuestionMap.entries());

      for (let i = 0; i < categoryMapArray.length; i++) {
        await context.AssessmentService.completeCategory(
          categoryMapArray[i][0],
          assessmentId,
          Array.from(categoryMapArray[i][1].values()),
        );
      }

      await expect(
        async () => await context.AssessmentService.endAssessment(999999),
      ).rejects.toThrow();
    });

    test("Finished assessment", async () => {
      await db
        .update(assessment)
        .set({ end_date_time: new Date() } as unknown)
        .where(eq(assessment.assessment_id, assessmentId));

      await expect(
        async () => await context.AssessmentService.endAssessment(999999),
      ).rejects.toThrow();
    });
  });
});
