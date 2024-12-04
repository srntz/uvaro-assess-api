import {ICategory} from "../db/schemas";

export const resolvers = {
  Query: {
    categories: () => {
      const categories: ICategory[] = [
        {
          category_id: 1,
          category_name: "Category 1",
          questions: [],
          levels: []
        },
        {
          category_id: 2,
          category_name: "Category 2",
          questions: [],
          levels: []
        }
      ]

      return categories;
    }
  }
}
