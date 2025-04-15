import { LevelService } from "../../services/implementations/LevelService";
import { IContext } from "../../context/IContext";
import { mapLevelEntityToLevelResponseDTO } from "../../mappers/level/mapLevelEntityToLevelResponseDTO";
import { LevelRepository } from "../../repositories/implementations/LevelRepository";
import { DatabaseConnection } from "../../db/DatabaseConnection";
import { level } from "../../db/schemas";
import { eq } from "drizzle-orm";

describe("Level Service", () => {
  let context: IContext;
  const db = DatabaseConnection.getInstance();

  beforeAll(() => {
    context = {
      CategoryService: null,
      AssessmentService: null,
      LevelService: new LevelService(new LevelRepository()),
      UserService: null,
      QuestionService: null,
      AnswerService: null,
      NotificationService: null,
    };
  });

  afterAll(async () => {
    await DatabaseConnection.getPool().end();
  });

  describe("getLevelsByCategory", () => {
    test("Existing category", async () => {
      const CATEGORY_ID = 1;

      const l = await context.LevelService.getLevelsByCategory(CATEGORY_ID);

      const dbLevels = await db
        .select()
        .from(level)
        .where(eq(level.category_id, CATEGORY_ID));

      expect(l.length).toEqual(dbLevels.length);
      expect(l).toEqual(
        dbLevels.map((l) => mapLevelEntityToLevelResponseDTO(l)),
      );
    });

    test("Non-existing category", async () => {
      const levels = await context.LevelService.getLevelsByCategory(99999);

      expect(levels).toEqual([]);
    });
  });
});
