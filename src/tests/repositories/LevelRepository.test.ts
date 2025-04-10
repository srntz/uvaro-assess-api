import { LevelRepository } from "../../repositories/implementations/LevelRepository";
import { db } from "../../db/DatabaseConnection";
import { level, weighting } from "../../db/schemas";
import { eq } from "drizzle-orm";
import { Level } from "../../models/Level";
import { LevelWithWeightingDTO } from "../../dto/level/LevelWithWeightingDTO";

describe("LevelRepository", () => {
  let levelRepository: LevelRepository;
  let testLevelIds: number[] = [];
  let testWeightingId: number;
  const testCategoryId = 1;

  beforeAll(async () => {
    levelRepository = new LevelRepository();
    
    // create test weighting
    const [testWeighting] = await db
      .insert(weighting)
      .values({ weighting: 5 })
      .returning();
    testWeightingId = testWeighting.weighting_id;
  });

  afterAll(async () => {
    // clean up test data
    if (testLevelIds.length > 0) {
      await db.delete(level).where(eq(level.level_id, testLevelIds[0]));
      if (testLevelIds.length > 1) {
        await db.delete(level).where(eq(level.level_id, testLevelIds[1]));
      }
    }
    await db.delete(weighting).where(eq(weighting.weighting_id, testWeightingId));
    await db.end();
  });

  describe("getLevelsByCategory()", () => {
    it("should return levels for a category", async () => {
      // create test levels
      const [level1] = await db
        .insert(level)
        .values({
          level_name: "Beginner",
          level_statement: "Beginner level",
          level_image: "beginner.jpg",
          weighting_id: testWeightingId,
          category_id: testCategoryId
        })
        .returning();
      
      const [level2] = await db
        .insert(level)
        .values({
          level_name: "Intermediate",
          level_statement: "Intermediate level",
          level_image: "intermediate.jpg",
          weighting_id: testWeightingId,
          category_id: testCategoryId
        })
        .returning();

      testLevelIds.push(level1.level_id, level2.level_id);

      const results = await levelRepository.getLevelsByCategory(testCategoryId);

      expect(results).toHaveLength(2);
      expect(results[0]).toBeInstanceOf(Level);
      expect(results[1]).toBeInstanceOf(Level);
      expect(results.some(l => l.level_id === level1.level_id)).toBe(true);
      expect(results.some(l => l.level_id === level2.level_id)).toBe(true);
    });

    it("should return empty array for category with no levels", async () => {
      const results = await levelRepository.getLevelsByCategory(99999);
      expect(results).toEqual([]);
    });
  });

  describe("getLevelsWithWeightingByCategoryId()", () => {
    it("should return levels with weighting data", async () => {
      // create test level
      const [testLevel] = await db
        .insert(level)
        .values({
          level_name: "Advanced",
          level_statement: "Advanced level",
          level_image: "advanced.jpg",
          weighting_id: testWeightingId,
          category_id: testCategoryId
        })
        .returning();
      
      testLevelIds.push(testLevel.level_id);

      const results = await levelRepository.getLevelsWithWeightingByCategoryId(testCategoryId);

      expect(results).toHaveLength(1);
      expect(results[0]).toBeInstanceOf(LevelWithWeightingDTO);
      expect(results[0].levelName).toBe("Advanced");
      expect(results[0].weighting).toBe(5);
      expect(results[0].levelId).toBe(testLevel.level_id);
    });

    it("should handle levels without weighting", async () => {
      // create level without weighting
      const [levelNoWeighting] = await db
        .insert(level)
        .values({
          level_name: "No Weighting",
          level_statement: "No weighting level",
          level_image: "noweight.jpg",
          weighting_id: null,
          category_id: testCategoryId
        })
        .returning();

      testLevelIds.push(levelNoWeighting.level_id);

      const results = await levelRepository.getLevelsWithWeightingByCategoryId(testCategoryId);

      const levelWithNullWeighting = results.find(l => l.levelId === levelNoWeighting.level_id);
      expect(levelWithNullWeighting).toBeDefined();
      expect(levelWithNullWeighting.weighting).toBeNull();
    });
  });

  describe("getLevelById()", () => {
    it("should return a level when it exists", async () => {
      // create test level
      const [testLevel] = await db
        .insert(level)
        .values({
          level_name: "Test Level",
          level_statement: "Test statement",
          level_image: "test.jpg",
          weighting_id: testWeightingId,
          category_id: testCategoryId
        })
        .returning();

      testLevelIds.push(testLevel.level_id);

      const result = await levelRepository.getLevelById(testLevel.level_id);

      expect(result).toBeInstanceOf(Level);
      expect(result.level_id).toBe(testLevel.level_id);
      expect(result.level_name).toBe("Test Level");
      expect(result.level_statement).toBe("Test statement");
    });

    it("should throw error when level doesn't exist", async () => {
      await expect(levelRepository.getLevelById(99999)).rejects.toThrow();
    });
  });

  describe("Level.init()", () => {
    it("should properly initialize a Level model", () => {
      const testData = {
        level_id: 1,
        level_name: "Test Level",
        level_statement: "Test statement",
        level_image: "test.jpg",
        weighting_id: 1,
        category_id: 1
      };

      const level = Level.init(testData);
      
      expect(level).toBeInstanceOf(Level);
      expect(level.level_id).toBe(1);
      expect(level.level_name).toBe("Test Level");
      expect(level.weighting_id).toBe(1);
    });

    it("should handle null weighting_id", () => {
      const testData = {
        level_id: 1,
        level_name: "Test Level",
        level_statement: "Test statement",
        level_image: "test.jpg",
        weighting_id: null,
        category_id: 1
      };

      const level = Level.init(testData);
      expect(level.weighting_id).toBeNull();
    });
  });
});