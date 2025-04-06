import { CategoryResponseDTO } from "../../dto/category/CategoryResponseDTO.js";
import { Category } from "../../models/Category.js";

export function mapCategoryEntityToCategoryResponseDTO(category: Category) {
  return new CategoryResponseDTO(
    category.category_id,
    category.category_name,
    category.category_description,
    category.category_image,
  );
}
