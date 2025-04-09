import { LevelService } from "../../services/implementations/LevelService";
import { MockLevelRepository } from "../mocks/MockLevelRepository";
import { IContext } from "../../context/IContext";
import { mapLevelEntityToLevelResponseDTO } from "../../mappers/level/mapLevelEntityToLevelResponseDTO";
import { Level } from "../../models/Level";

let context: IContext;
const mockLevelRepository = new MockLevelRepository();

describe("Level Service", () => {
  beforeAll(() => {
    context = {
      CategoryService: null,
      AssessmentService: null,
      LevelService: new LevelService(mockLevelRepository),
      UserService: null,
      QuestionService: null,
      AnswerService: null,
      NotificationService: null,
    };
  });

  describe("getLevelsByCategory", () => {
    test("returns levels for category 1", async () => {
      const levels = await context.LevelService.getLevelsByCategory(1);
      expect(levels).toHaveLength(2);
      expect(levels).toEqual([
        mapLevelEntityToLevelResponseDTO(mockLevelRepository.storage.get(1)),
        mapLevelEntityToLevelResponseDTO(mockLevelRepository.storage.get(2))
      ]);
    });

    test("returns empty array for non-existent category", async () => {
      const levels = await context.LevelService.getLevelsByCategory(999);
      expect(levels).toEqual([]);
    });
  });

  describe("getLevelById", () => {
    test("returns level when exists", async () => {
      const level = await mockLevelRepository.getLevelById(1);
      expect(level).toEqual(
        new Level(
          "Beginner",
          "Starting level",
          "beginner.jpg",
          1,
          1,
          1
        )
      );
    });

    test("returns null when not exists", async () => {
      const level = await mockLevelRepository.getLevelById(999);
      expect(level).toBeNull();
    });
  });
});