export class CategoryResponseDTO {
  constructor(
    readonly categoryId: number,
    readonly categoryName: string,
    readonly categoryDescription: string,
    readonly categoryImage: string,
  ) {}
}
