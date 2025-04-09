import { CategoryResponseDTO } from "../../dto/category/CategoryResponseDTO";
import { Category } from "../../models/Category";

export function mapCategoryEntityToCategoryResponseDTO(category: Category) {
  if (!category) {
    return category;
  }

  return new CategoryResponseDTO(
    category.category_id,
    category.category_name,
    category.category_description,
    category.category_image,
  );
}
