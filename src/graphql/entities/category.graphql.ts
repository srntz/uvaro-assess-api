export const categoryEntity = `#graphql
  type Category {
      category_id: Int!
      category_name: String!
  }

  type CategoryWithChildren {
      category_id: Int!
      category_name: String!
      questions: [QuestionWithChildren]!
      levels: [Level]!
  }
`
