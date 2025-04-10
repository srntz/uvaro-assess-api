import { CategoryService } from "../../services/implementations/CategoryService";
import { IContext } from "../../context/IContext";
import { CategoryRepository } from "../../repositories/implementations/CategoryRepository";
import { CategoryResponseDTO } from "../../dto/category/CategoryResponseDTO";
import { DatabaseConnection } from "../../db/DatabaseConnection";

const categoryJestSchema: CategoryResponseDTO = {
  categoryId: expect.any(Number),
  categoryName: expect.any(String),
  categoryDescription: expect.any(String),
  categoryImage: expect.any(String),
};

let context: IContext;

describe("Category Service", () => {
  beforeAll(() => {
    context = {
      CategoryService: new CategoryService(new CategoryRepository()),
      AssessmentService: null,
      LevelService: null,
      UserService: null,
      QuestionService: null,
      AnswerService: null,
      NotificationService: null,
    };
  });

  afterAll(async () => {
    await DatabaseConnection.getPool().end();
  });

  test("getAll()", async () => {
    const returnedCategories = await context.CategoryService.getAll();

    returnedCategories.forEach((category) => {
      expect(category).toBeTruthy();
      expect(category).toEqual(categoryJestSchema);
    });
  });

  test("getById(): Valid id", async () => {
    const category = await context.CategoryService.getById(1);

    expect(category).toBeTruthy();
    expect(category).toEqual(categoryJestSchema);
  });

  test("getById(): Invalid id", async () => {
    const category = await context.CategoryService.getById(9999999);

    expect(category).toEqual(null);
  });
});
