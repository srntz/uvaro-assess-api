export const questionEntity = `#graphql
  type Question {
      question_id: Int!
      question_text: String!
      category_id: Int!
      category: Category!
  }

  type QuestionWithChildren {
      question_id: Int!
      question_text: String!
      category_id: Int!
      category: Category!
      answers: [Answer]!
  }
`
