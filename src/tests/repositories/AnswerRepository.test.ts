import { AnswerRepository } from "../../repositories/implementations/AnswerRepository";
import { Answer } from "../../models/Answer";
import { db } from "../../db/DatabaseConnection";
import { answer, question, weighting, category } from "../../db/schemas";
import { eq } from "drizzle-orm";
import { AnswerWithWeightingAndCoefficientDTO } from "../../dto/answer/AnswerWithWeightingAndCoefficientDTO";
import { AnswerWithCategoryIdDTO } from "../../dto/answer/AnswerWithCategoryIdDTO";

describe("AnswerRepository", () => {
  let answerRepository: AnswerRepository;

  beforeAll(() => {
    answerRepository = new AnswerRepository();
  });

  afterAll(async () => {
    await db.end();
  });

  describe("getById()", () => {
    it("should return an answer when it exists", async () => {
      // insert a test answer
      const [testAnswer] = await db
        .insert(answer)
        .values({
          answer_text: "Test answer",
          weighting_id: 1,
          question_id: 1,
        })
        .returning();

      const result = await answerRepository.getById(testAnswer.answer_id);

      expect(result).toBeInstanceOf(Answer);
      expect(result?.answer_id).toBe(testAnswer.answer_id);
      expect(result?.answer_text).toBe(testAnswer.answer_text);

      // clean up
      await db.delete(answer).where(eq(answer.answer_id, testAnswer.answer_id));
    });

    it("should return null when answer does not exist", async () => {
      const result = await answerRepository.getById(99999);
      expect(result).toBeNull();
    });
  });

  describe("getByQuestionId()", () => {
    it("should return answers for an existing question", async () => {
      // insert test answers
      const [testAnswer1] = await db
        .insert(answer)
        .values({
          answer_text: "Test answer 1",
          weighting_id: 1,
          question_id: 1,
        })
        .returning();

      const [testAnswer2] = await db
        .insert(answer)
        .values({
          answer_text: "Test answer 2",
          weighting_id: 2,
          question_id: 1,
        })
        .returning();

      const results = await answerRepository.getByQuestionId(1);

      expect(results).toHaveLength(2);
      expect(results[0]).toBeInstanceOf(Answer);
      expect(results[1]).toBeInstanceOf(Answer);
      expect(results.some(a => a.answer_id === testAnswer1.answer_id)).toBe(true);
      expect(results.some(a => a.answer_id === testAnswer2.answer_id)).toBe(true);

      // clean up
      await db.delete(answer).where(eq(answer.answer_id, testAnswer1.answer_id));
      await db.delete(answer).where(eq(answer.answer_id, testAnswer2.answer_id));
    });

    it("should return empty array for non-existing question", async () => {
      const results = await answerRepository.getByQuestionId(99999);
      expect(results).toEqual([]);
    });
  });

  describe("getByCategoryId()", () => {
    it("should return answers for an existing category", async () => {
      // first create a test category and question
      const [testCategory] = await db
        .insert(category)
        .values({ category_name: "Test Category" })
        .returning();

      const [testQuestion] = await db
        .insert(question)
        .values({
          question_text: "Test Question",
          category_id: testCategory.category_id,
          weighting_coefficient: 1,
        })
        .returning();

      // then create test answers
      const [testAnswer] = await db
        .insert(answer)
        .values({
          answer_text: "Test answer",
          weighting_id: 1,
          question_id: testQuestion.question_id,
        })
        .returning();

      const results = await answerRepository.getByCategoryId(testCategory.category_id);

      expect(results).toHaveLength(1);
      expect(results[0]).toBeInstanceOf(Answer);
      expect(results[0].answer_id).toBe(testAnswer.answer_id);

      // clean up
      await db.delete(answer).where(eq(answer.answer_id, testAnswer.answer_id));
      await db.delete(question).where(eq(question.question_id, testQuestion.question_id));
      await db.delete(category).where(eq(category.category_id, testCategory.category_id));
    });

    it("should return empty array for non-existing category", async () => {
      const results = await answerRepository.getByCategoryId(99999);
      expect(results).toEqual([]);
    });
  });

  describe("getAnswersWithWeightingsAndCoefficientsByIds()", () => {
    it("should return answers with weightings and coefficients", async () => {
      // first create test data
      const [testQuestion] = await db
        .insert(question)
        .values({
          question_text: "Test Question",
          category_id: 1,
          weighting_coefficient: 0.5,
        })
        .returning();

      const [testWeighting] = await db
        .insert(weighting)
        .values({ weighting: 2 })
        .returning();

      const [testAnswer] = await db
        .insert(answer)
        .values({
          answer_text: "Test answer",
          weighting_id: testWeighting.weighting_id,
          question_id: testQuestion.question_id,
        })
        .returning();

      const results = await answerRepository.getAnswersWithWeightingsAndCoefficientsByIds([
        testAnswer.answer_id,
      ]);

      expect(results).toHaveLength(1);
      expect(results[0]).toBeInstanceOf(AnswerWithWeightingAndCoefficientDTO);
      expect(results[0].answer_id).toBe(testAnswer.answer_id);
      expect(results[0].weighting).toBe(testWeighting.weighting);
      expect(results[0].weighting_coefficient).toBe(testQuestion.weighting_coefficient);

      // clean up
      await db.delete(answer).where(eq(answer.answer_id, testAnswer.answer_id));
      await db.delete(question).where(eq(question.question_id, testQuestion.question_id));
      await db.delete(weighting).where(eq(weighting.weighting_id, testWeighting.weighting_id));
    });

    it("should return empty array when no answers match", async () => {
      const results = await answerRepository.getAnswersWithWeightingsAndCoefficientsByIds([
        99999,
      ]);
      expect(results).toEqual([]);
    });
  });

  describe("getAnswersWithCategoryIdsByIds()", () => {
    it("should return answers with category IDs", async () => {
      // first create test data
      const [testCategory] = await db
        .insert(category)
        .values({ category_name: "Test Category" })
        .returning();

      const [testQuestion] = await db
        .insert(question)
        .values({
          question_text: "Test Question",
          category_id: testCategory.category_id,
          weighting_coefficient: 1,
        })
        .returning();

      const [testAnswer] = await db
        .insert(answer)
        .values({
          answer_text: "Test answer",
          weighting_id: 1,
          question_id: testQuestion.question_id,
        })
        .returning();

      const results = await answerRepository.getAnswersWithCategoryIdsByIds([
        testAnswer.answer_id,
      ]);

      expect(results).toHaveLength(1);
      expect(results[0]).toBeInstanceOf(AnswerWithCategoryIdDTO);
      expect(results[0].answer_id).toBe(testAnswer.answer_id);
      expect(results[0].category_id).toBe(testCategory.category_id);

      // clean up
      await db.delete(answer).where(eq(answer.answer_id, testAnswer.answer_id));
      await db.delete(question).where(eq(question.question_id, testQuestion.question_id));
      await db.delete(category).where(eq(category.category_id, testCategory.category_id));
    });

    it("should return empty array when no answers match", async () => {
      const results = await answerRepository.getAnswersWithCategoryIdsByIds([99999]);
      expect(results).toEqual([]);
    });
  });
});