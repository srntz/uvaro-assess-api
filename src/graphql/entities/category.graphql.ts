export const categoryEntity = `#graphql
  type Category {
      category_id: Int!
      category_name: String!
      category_description: String!
      category_image: String!
  }

  type CategoryWithChildren {
      category_id: Int!
      category_name: String!
      category_description: String!
      category_image: String!
      questions: [QuestionWithChildren]!
      levels: [Level]!
  }
`;
