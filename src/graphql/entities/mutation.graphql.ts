export const mutationEntity = `#graphql
    type Mutation {
        addUser(user: UserArgumentType!): User!
        addAssessment(user_id: String!): Assessment!
        saveNote(assessment_id: Int!, category_id: Int!, note_text: String!): Note!
    }
`;
