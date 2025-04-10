import { QuestionRepository } from "../../repositories/implementations/QuestionRepository";
import { db } from "../../db/DatabaseConnection";
import { question } from "../../db/schemas";
import { eq } from "drizzle-orm";
import { Question } from "../../models/Question";

describe("QuestionRepository", () => {
  let questionRepository: QuestionRepository;
  let testQuestionIds: number[] = [];
  const testCategoryId = 1;

  beforeAll(() => {
    questionRepository = new QuestionRepository();
  });

  afterAll(async () => {
    // clean up test data
    if (testQuestionIds.length > 0) {
      await db.delete(question).where(eq(question.question_id, testQuestionIds[0]));
      if (testQuestionIds.length > 1) {
        await db.delete(question).where(eq(question.question_id, testQuestionIds[1]));
      }
      if (testQuestionIds.length > 2) {
        await db.delete(question).where(eq(question.question_id, testQuestionIds[2]));
      }
    }
    await db.end();
  });

  describe("getQuestionsByCategory()", () => {
    it("should return questions for a category with correct follow-up flag", async () => {
      // create test questions
      const [mainQuestion] = await db
        .insert(question)
        .values({
          category_id: testCategoryId,
          question_text: "Main question",
          weighting_coefficient: 1.0,
          follow_up: false
        })
        .returning();
      
      const [followUpQuestion] = await db
        .insert(question)
        .values({
          category_id: testCategoryId,
          question_text: "Follow-up question",
          weighting_coefficient: 0.5,
          follow_up: true
        })
        .returning();

      testQuestionIds.push(mainQuestion.question_id, followUpQuestion.question_id);

      // test main questions
      const mainResults = await questionRepository.getQuestionsByCategory(testCategoryId, false);
      expect(mainResults).toHaveLength(1);
      expect(mainResults[0].question_id).toBe(mainQuestion.question_id);
      expect(mainResults[0].follow_up).toBe(false);

      // test follow-up questions
      const followUpResults = await questionRepository.getQuestionsByCategory(testCategoryId, true);
      expect(followUpResults).toHaveLength(1);
      expect(followUpResults[0].question_id).toBe(followUpQuestion.question_id);
      expect(followUpResults[0].follow_up).toBe(true);
    });

    it("should return empty array for category with no questions", async () => {
      const results = await questionRepository.getQuestionsByCategory(99999, false);
      expect(results).toEqual([]);
    });
  });

  describe("getQuestionById()", () => {
    it("should return a question when it exists", async () => {
      // create test question
      const [testQuestion] = await db
        .insert(question)
        .values({
          category_id: testCategoryId,
          question_text: "Test question",
          weighting_coefficient: 1.0,
          follow_up: false
        })
        .returning();

      testQuestionIds.push(testQuestion.question_id);

      const result = await questionRepository.getQuestionById(testQuestion.question_id);

      expect(result).toBeInstanceOf(Question);
      expect(result.question_id).toBe(testQuestion.question_id);
      expect(result.question_text).toBe("Test question");
      expect(result.weighting_coefficient).toBe(1.0);
    });

    it("should return null when question doesn't exist", async () => {
      const result = await questionRepository.getQuestionById(99999);
      expect(result).toBeNull();
    });
  });

  describe("getRequiredQuestionIdsByCategory()", () => {
    it("should return non-follow-up question IDs for a category", async () => {
      // create test questions
      const [requiredQuestion1] = await db
        .insert(question)
        .values({
          category_id: testCategoryId,
          question_text: "Required 1",
          weighting_coefficient: 1.0,
          follow_up: false
        })
        .returning();
      
      const [requiredQuestion2] = await db
        .insert(question)
        .values({
          category_id: testCategoryId,
          question_text: "Required 2",
          weighting_coefficient: 1.0,
          follow_up: false
        })
        .returning();

      // create a follow-up question that shouldn't be included
      const [followUpQuestion] = await db
        .insert(question)
        .values({
          category_id: testCategoryId,
          question_text: "Follow-up",
          weighting_coefficient: 0.5,
          follow_up: true
        })
        .returning();

      testQuestionIds.push(
        requiredQuestion1.question_id, 
        requiredQuestion2.question_id,
        followUpQuestion.question_id
      );

      const result = await questionRepository.getRequiredQuestionIdsByCategory(testCategoryId);

      expect(result).toBeInstanceOf(Set);
      expect(result.size).toBe(2);
      expect(result.has(requiredQuestion1.question_id)).toBe(true);
      expect(result.has(requiredQuestion2.question_id)).toBe(true);
      expect(result.has(followUpQuestion.question_id)).toBe(false);
    });

    it("should return empty set for category with no required questions", async () => {
      const result = await questionRepository.getRequiredQuestionIdsByCategory(99999);
      expect(result.size).toBe(0);
    });
  });

  describe("Question.init()", () => {
    it("should properly initialize a Question model", () => {
      const testData = {
        question_id: 1,
        category_id: 1,
        question_text: "Test question",
        weighting_coefficient: 1.0,
        follow_up: false
      };

      const question = Question.init(testData);
      
      expect(question).toBeInstanceOf(Question);
      expect(question.question_id).toBe(1);
      expect(question.question_text).toBe("Test question");
      expect(question.follow_up).toBe(false);
    });

    it("should throw InvalidModelConstructionException for invalid data", () => {
      const invalidData = {
        question_id: "not a number", // invalid type
        category_id: 1,
        question_text: "Test question",
        weighting_coefficient: 1.0,
        follow_up: false
      };

      expect(() => Question.init(invalidData as any)).toThrow("InvalidModelConstructionException");
    });
  });
});