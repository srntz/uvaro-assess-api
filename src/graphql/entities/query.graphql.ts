export const queryEntity = `#graphql
    type Query {
        allCategories: [CategoryWithChildren]
        getAssessments(user_id: String!): [AssessmentWithChildren]
        category(id: Int!): CategoryWithChildren
        levelsFromCategory(category_id: Int!): [Level]
        level(id: Int!): Level
        question(id: Int!): QuestionWithChildren
        questionsFromCategory(category_id: Int!): [QuestionWithChildren]
        answer(id: Int!): Answer
        answersFromQuestion(question_id: Int!): [Answer]
    }
`;
