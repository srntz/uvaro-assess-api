import { AnswerService } from "../../services/implementations/AnswerService";
import { MockAnswerRepository } from "../mocks/MockAnswerRepository";
import { IContext } from "../../context/IContext";
import { mapAnswerEntityToAnswerResponseDTO } from "../../mappers/answer/mapAnswerEntityToAnswerResponseDTO";
import { Assessment } from '../../models/Assessment';

let context: IContext;
const mockAnswerRepository = new MockAnswerRepository();

describe("Answer Service", () => {
  beforeAll(() => {
    context = {
      CategoryService: null,
      AssessmentService: null,
      LevelService: null,
      UserService: null,
      QuestionService: null,
      AnswerService: new AnswerService(mockAnswerRepository),
      NotificationService: null,
    };
  });

  describe("getById", () => {
    test("returns answer when exists", async () => {
      const answer = await context.AnswerService.getById(1);
      expect(answer).toEqual(
        mapAnswerEntityToAnswerResponseDTO(mockAnswerRepository.storage.get(1))
      );
    });

    test("returns null when not exists", async () => {
      const answer = await context.AnswerService.getById(999);
      expect(answer).toBeNull();
    });
  });

  describe("getByQuestionId", () => {
    test("returns answers for existing question", async () => {
      const answers = await context.AnswerService.getByQuestionId(1);
      expect(answers.length).toBe(2);
    });

    test("returns empty array for non-existent question", async () => {
      const answers = await context.AnswerService.getByQuestionId(999);
      expect(answers).toEqual([]);
    });
  });

  describe("getByCategoryId", () => {
    test("returns answers for existing category", async () => {
      const answers = await mockAnswerRepository.getByCategoryId(1);
      expect(answers.length).toBeGreaterThan(0);
    });
  });
});