import { DatabaseConnection } from "../../db/DatabaseConnection";
import { assessment, user } from "../../db/schemas";
import { IContext } from "../../context/IContext";
import { AssessmentService } from "../../services/implementations/AssessmentService";
import { AssessmentRepository } from "../../repositories/implementations/AssessmentRepository";
import { LevelRepository } from "../../repositories/implementations/LevelRepository";
import { CategoryRepository } from "../../repositories/implementations/CategoryRepository";
import { AnswerRepository } from "../../repositories/implementations/AnswerRepository";
import { QuestionRepository } from "../../repositories/implementations/QuestionRepository";
import { AssessmentResponseDTO } from "../../dto/assessment/AssessmentResponseDTO";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

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

  beforeAll(async () => {
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

  afterAll(async () => {
    await db.delete(assessment);
    await db.delete(user);

    await DatabaseConnection.getPool().end();
  });
});
