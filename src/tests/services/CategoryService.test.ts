import { CategoryService } from "../../services/implementations/CategoryService";
import { MockCategoryRepository } from "../mocks/MockCategoryRepository";
import { mapCategoryEntityToCategoryResponseDTO } from "../../mappers/category/mapCategoryEntityToCategoryResponseDTO";
import { IContext } from "../../context/IContext";

let context: IContext;
const mockCategoryRepository = new MockCategoryRepository();

describe("Category Service", () => {
  beforeAll(async () => {
    context = {
      CategoryService: new CategoryService(mockCategoryRepository),
      AssessmentService: null,
      LevelService: null,
      UserService: null,
      QuestionService: null,
      AnswerService: null,
      NotificationService: null,
    };
  });

  test("getAll()", async () => {
    const returnedCategories = await context.CategoryService.getAll();

    mockCategoryRepository.storage.values().forEach((category) => {
      expect(returnedCategories).toContainEqual(
        mapCategoryEntityToCategoryResponseDTO(category),
      );
    });
  });

  test("getById(): Valid id", async () => {
    const category = await context.CategoryService.getById(1);

    expect(category).toEqual(
      mapCategoryEntityToCategoryResponseDTO(
        mockCategoryRepository.storage.get(1),
      ),
    );
  });

  test("getById(): Invalid id", async () => {
    const category = await context.CategoryService.getById(9999999);

    expect(category).toEqual(null);
  });
});
