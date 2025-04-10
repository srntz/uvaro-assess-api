import { AssessmentRepository } from "../../repositories/implementations/AssessmentRepository";
import { db } from "../../db/DatabaseConnection";
import { assessment, assessmentAnswer, assessmentLevel, level, note, answer, question } from "../../db/schemas";
import { eq } from "drizzle-orm";
import { Assessment } from "../../models/Assessment";
import { Answer } from "../../models/Answer";
import { Note } from "../../models/Note";
import { Level } from "../../models/Level";
import { AssessmentAnswer } from "../../models/AssessmentAnswer";
import { AssessmentLevel } from "../../models/AssessmentLevel";
import { AssessmentAnswerInsertDTO } from "../../dto/assessmentAnswer/AssessmentAnswerInsertDTO";

describe("AssessmentRepository", () => {
  let assessmentRepository: AssessmentRepository;
  let testUserId: string = "test-user-123";
  let testAssessmentId: number;

  beforeAll(async () => {
    assessmentRepository = new AssessmentRepository();
    
    // create a test assessment to use in tests
    const [testAssessment] = await db
      .insert(assessment)
      .values({ user_id: testUserId })
      .returning();
    testAssessmentId = testAssessment.assessment_id;
  });

  afterAll(async () => {
    // clean up test data
    await db.delete(assessment).where(eq(assessment.user_id, testUserId));
    await db.end();
  });

  describe("addAssessment()", () => {
    it("should create a new assessment for a user", async () => {
      const newUserId = "new-user-456";
      const result = await assessmentRepository.addAssessment(newUserId);

      expect(result).toBeInstanceOf(Assessment);
      expect(result.user_id).toBe(newUserId);
      expect(result.start_date_time).toBeInstanceOf(Date);
      expect(result.end_date_time).toBeNull();

      // clean up
      await db.delete(assessment).where(eq(assessment.user_id, newUserId));
    });

    it("should throw error for non-existent user", async () => {
      const nonExistentUserId = "non-existent-user";
      await expect(assessmentRepository.addAssessment(nonExistentUserId))
        .rejects
        .toThrow("User with the specified does not exist");
    });
  });

  describe("getAssessmentById()", () => {
    it("should return assessment when it exists", async () => {
      const result = await assessmentRepository.getAssessmentById(testAssessmentId);
      
      expect(result).toBeInstanceOf(Assessment);
      expect(result.assessment_id).toBe(testAssessmentId);
    });

    it("should return null when assessment doesn't exist", async () => {
      const result = await assessmentRepository.getAssessmentById(999999);
      expect(result).toBeNull();
    });
  });

  describe("getUserAssessments()", () => {
    it("should return assessments for a user", async () => {
      // add another assessment for the same user
      const [anotherAssessment] = await db
        .insert(assessment)
        .values({ user_id: testUserId })
        .returning();

      const results = await assessmentRepository.getUserAssessments(testUserId);

      expect(results).toHaveLength(2);
      expect(results[0]).toBeInstanceOf(Assessment);
      expect(results.some(a => a.assessment_id === testAssessmentId)).toBe(true);
      expect(results.some(a => a.assessment_id === anotherAssessment.assessment_id)).toBe(true);

      // clean up
      await db.delete(assessment).where(eq(assessment.assessment_id, anotherAssessment.assessment_id));
    });

    it("should return empty array for user with no assessments", async () => {
      const results = await assessmentRepository.getUserAssessments("no-assessments-user");
      expect(results).toEqual([]);
    });
  });

  describe("endAssessment()", () => {
    it("should set end date time for assessment", async () => {
      const beforeUpdate = new Date();
      const result = await assessmentRepository.endAssessment(testAssessmentId);
      const afterUpdate = new Date();

      expect(result).toBeInstanceOf(Assessment);
      expect(result.end_date_time).toBeInstanceOf(Date);
      expect(result.end_date_time.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
      expect(result.end_date_time.getTime()).toBeLessThanOrEqual(afterUpdate.getTime());
    });

    it("should throw error for non-existent assessment", async () => {
      await expect(assessmentRepository.endAssessment(999999))
        .rejects
        .toThrow();
    });
  });

  describe("getAssessmentAnswers()", () => {
    it("should return answers for an assessment", async () => {
      // create test answer and link to assessment
      const [testAnswer] = await db
        .insert(answer)
        .values({
          answer_text: "Test answer",
          weighting_id: 1,
          question_id: 1,
        })
        .returning();

      await db.insert(assessmentAnswer).values({
        assessment_id: testAssessmentId,
        question_id: 1,
        answer_id: testAnswer.answer_id,
      });

      const results = await assessmentRepository.getAssessmentAnswers(testAssessmentId);

      expect(results).toHaveLength(1);
      expect(results[0]).toBeInstanceOf(Answer);
      expect(results[0].answer_id).toBe(testAnswer.answer_id);

      // clean up
      await db.delete(assessmentAnswer).where(eq(assessmentAnswer.assessment_id, testAssessmentId));
      await db.delete(answer).where(eq(answer.answer_id, testAnswer.answer_id));
    });

    it("should return empty array for assessment with no answers", async () => {
      const results = await assessmentRepository.getAssessmentAnswers(testAssessmentId);
      expect(results).toEqual([]);
    });
  });

  describe("getAssessmentAnswerQuestionPairs()", () => {
    it("should return answer-question pairs for an assessment", async () => {
      // create test data
      const [testQuestion] = await db
        .insert(question)
        .values({
          question_text: "Test question",
          category_id: 1,
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

      await db.insert(assessmentAnswer).values({
        assessment_id: testAssessmentId,
        question_id: testQuestion.question_id,
        answer_id: testAnswer.answer_id,
      });

      const results = await assessmentRepository.getAssessmentAnswerQuestionPairs(testAssessmentId);

      expect(results).toHaveLength(1);
      expect(results[0].answer).toBeInstanceOf(Answer);
      expect(results[0].question).toBeInstanceOf(Question);
      expect(results[0].answer.answer_id).toBe(testAnswer.answer_id);
      expect(results[0].question.question_id).toBe(testQuestion.question_id);

      // clean up
      await db.delete(assessmentAnswer).where(eq(assessmentAnswer.assessment_id, testAssessmentId));
      await db.delete(answer).where(eq(answer.answer_id, testAnswer.answer_id));
      await db.delete(question).where(eq(question.question_id, testQuestion.question_id));
    });
  });

  describe("getAssessmentLevels()", () => {
    it("should return levels for an assessment", async () => {
      // create test level and link to assessment
      const [testLevel] = await db
        .insert(level)
        .values({ level_name: "Test Level" })
        .returning();

      await db.insert(assessmentLevel).values({
        assessment_id: testAssessmentId,
        category_id: 1,
        level_id: testLevel.level_id,
      });

      const results = await assessmentRepository.getAssessmentLevels(testAssessmentId);

      expect(results).toHaveLength(1);
      expect(results[0]).toBeInstanceOf(Level);
      expect(results[0].level_id).toBe(testLevel.level_id);

      // clean up
      await db.delete(assessmentLevel).where(eq(assessmentLevel.assessment_id, testAssessmentId));
      await db.delete(level).where(eq(level.level_id, testLevel.level_id));
    });
  });

  describe("getNotes()", () => {
    it("should return notes for an assessment", async () => {
      // create test note
      const [testNote] = await db
        .insert(note)
        .values({
          assessment_id: testAssessmentId,
          category_id: 1,
          note_text: "Test note",
        })
        .returning();

      const results = await assessmentRepository.getNotes(testAssessmentId);

      expect(results).toHaveLength(1);
      expect(results[0]).toBeInstanceOf(Note);
      expect(results[0].note_text).toBe("Test note");

      // clean up
      await db.delete(note).where(eq(note.assessment_id, testAssessmentId));
    });
  });

  describe("insertNote()", () => {
    it("should insert or update a note", async () => {
      const testNote = new Note(testAssessmentId, 1, "Test note");
      const result = await assessmentRepository.insertNote(testNote);

      expect(result).toBeInstanceOf(Note);
      expect(result.assessment_id).toBe(testAssessmentId);
      expect(result.note_text).toBe("Test note");

      // test update
      const updatedNote = new Note(testAssessmentId, 1, "Updated note");
      const updatedResult = await assessmentRepository.insertNote(updatedNote);

      expect(updatedResult.note_text).toBe("Updated note");

      // clean up
      await db.delete(note).where(eq(note.assessment_id, testAssessmentId));
    });
  });

  describe("insertAnswer()", () => {
    it("should insert or update an assessment answer", async () => {
      // create test answer
      const [testAnswer] = await db
        .insert(answer)
        .values({
          answer_text: "Test answer",
          weighting_id: 1,
          question_id: 1,
        })
        .returning();

      const testAssessmentAnswer = new AssessmentAnswer(testAssessmentId, 1, testAnswer.answer_id);
      const result = await assessmentRepository.insertAnswer(testAssessmentAnswer);

      expect(result).toBeInstanceOf(AssessmentAnswer);
      expect(result.answer_id).toBe(testAnswer.answer_id);

      // test update with different answer
      const [anotherAnswer] = await db
        .insert(answer)
        .values({
          answer_text: "Another answer",
          weighting_id: 2,
          question_id: 1,
        })
        .returning();

      const updatedAssessmentAnswer = new AssessmentAnswer(testAssessmentId, 1, anotherAnswer.answer_id);
      const updatedResult = await assessmentRepository.insertAnswer(updatedAssessmentAnswer);

      expect(updatedResult.answer_id).toBe(anotherAnswer.answer_id);

      // clean up
      await db.delete(assessmentAnswer).where(eq(assessmentAnswer.assessment_id, testAssessmentId));
      await db.delete(answer).where(eq(answer.answer_id, testAnswer.answer_id));
      await db.delete(answer).where(eq(answer.answer_id, anotherAnswer.answer_id));
    });
  });

  describe("insertAnswersInBatch()", () => {
    it("should insert multiple answers with conflict handling", async () => {
      // create test answers
      const [answer1] = await db
        .insert(answer)
        .values({
          answer_text: "Answer 1",
          weighting_id: 1,
          question_id: 1,
        })
        .returning();

      const [answer2] = await db
        .insert(answer)
        .values({
          answer_text: "Answer 2",
          weighting_id: 2,
          question_id: 2,
        })
        .returning();

      const answersToInsert: AssessmentAnswerInsertDTO[] = [
        { assessmentId: testAssessmentId, questionId: 1, answerId: answer1.answer_id },
        { assessmentId: testAssessmentId, questionId: 2, answerId: answer2.answer_id },
      ];

      const results = await assessmentRepository.insertAnswersInBatch(answersToInsert);

      expect(results).toHaveLength(2);
      expect(results[0]).toBeInstanceOf(AssessmentAnswer);
      expect(results[1]).toBeInstanceOf(AssessmentAnswer);

      // clean up
      await db.delete(assessmentAnswer).where(eq(assessmentAnswer.assessment_id, testAssessmentId));
      await db.delete(answer).where(eq(answer.answer_id, answer1.answer_id));
      await db.delete(answer).where(eq(answer.answer_id, answer2.answer_id));
    });
  });

  describe("insertLevel()", () => {
    it("should insert or update an assessment level", async () => {
      // create test level
      const [testLevel] = await db
        .insert(level)
        .values({ level_name: "Test Level" })
        .returning();

      const testAssessmentLevel = new AssessmentLevel(testAssessmentId, 1, testLevel.level_id);
      const result = await assessmentRepository.insertLevel(testAssessmentLevel);

      expect(result).toBeInstanceOf(AssessmentLevel);
      expect(result.level_id).toBe(testLevel.level_id);

      // test update with different level
      const [anotherLevel] = await db
        .insert(level)
        .values({ level_name: "Another Level" })
        .returning();

      const updatedAssessmentLevel = new AssessmentLevel(testAssessmentId, 1, anotherLevel.level_id);
      const updatedResult = await assessmentRepository.insertLevel(updatedAssessmentLevel);

      expect(updatedResult.level_id).toBe(anotherLevel.level_id);

      // clean up
      await db.delete(assessmentLevel).where(eq(assessmentLevel.assessment_id, testAssessmentId));
      await db.delete(level).where(eq(level.level_id, testLevel.level_id));
      await db.delete(level).where(eq(level.level_id, anotherLevel.level_id));
    });
  });
});