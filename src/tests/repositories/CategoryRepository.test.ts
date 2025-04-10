import { CategoryRepository } from "../../repositories/implementations/CategoryRepository";
import { db } from "../../db/DatabaseConnection";
import { category } from "../../db/schemas";
import { eq } from "drizzle-orm";
import { Category } from "../../models/Category";

describe("CategoryRepository", () => {
  let categoryRepository: CategoryRepository;
  let testCategoryIds: number[] = [];

  beforeAll(() => {
    categoryRepository = new CategoryRepository();
  });

  afterAll(async () => {
    // clean up test data
    if (testCategoryIds.length > 0) {
      await db.delete(category).where(eq(category.category_id, testCategoryIds[0]));
      if (testCategoryIds.length > 1) {
        await db.delete(category).where(eq(category.category_id, testCategoryIds[1]));
      }
    }
    await db.end();
  });

  describe("getAll()", () => {
    it("should return all categories", async () => {
      // create test categories
      const [category1] = await db
        .insert(category)
        .values({
          category_name: "Test Category 1",
          category_description: "Description 1",
          category_image: "image1.jpg"
        })
        .returning();
      
      const [category2] = await db
        .insert(category)
        .values({
          category_name: "Test Category 2",
          category_description: "Description 2",
          category_image: "image2.jpg"
        })
        .returning();

      testCategoryIds.push(category1.category_id, category2.category_id);

      const results = await categoryRepository.getAll();

      expect(results.length).toBeGreaterThanOrEqual(2);
      expect(results.some(c => c.category_id === category1.category_id)).toBe(true);
      expect(results.some(c => c.category_id === category2.category_id)).toBe(true);
      expect(results[0]).toBeInstanceOf(Category);
    });

    it("should return empty array when no categories exist", async () => {
      // temporarily delete all categories for this test
      await db.delete(category);
      
      const results = await categoryRepository.getAll();
      expect(results).toEqual([]);
      
      // note: might want to restore the database state here
      // or run this test first before creating test data
    });
  });

  describe("getById()", () => {
    it("should return a category when it exists", async () => {
      // create a test category
      const [testCategory] = await db
        .insert(category)
        .values({
          category_name: "Test Category",
          category_description: "Test Description",
          category_image: "test.jpg"
        })
        .returning();

      testCategoryIds.push(testCategory.category_id);

      const result = await categoryRepository.getById(testCategory.category_id);

      expect(result).toBeInstanceOf(Category);
      expect(result.category_id).toBe(testCategory.category_id);
      expect(result.category_name).toBe("Test Category");
      expect(result.category_description).toBe("Test Description");
      expect(result.category_image).toBe("test.jpg");
    });

    it("should return null when category does not exist", async () => {
      const result = await categoryRepository.getById(999999);
      expect(result).toBeNull();
    });
  });

  describe("Category.init()", () => {
    it("should properly initialize a Category model", () => {
      const testData = {
        category_id: 1,
        category_name: "Test",
        category_description: "Test Desc",
        category_image: "test.jpg"
      };

      const category = Category.init(testData);
      
      expect(category).toBeInstanceOf(Category);
      expect(category.category_id).toBe(1);
      expect(category.category_name).toBe("Test");
    });

    it("should throw InvalidModelConstructionException for invalid data", () => {
      const invalidData = {
        category_id: "not a number", // invalid type
        category_name: "Test",
        category_description: "Test Desc",
        category_image: "test.jpg"
      };

      expect(() => Category.init(invalidData as any)).toThrow("InvalidModelConstructionException");
    });
  });
});