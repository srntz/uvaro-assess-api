export const mutationEntity = `#graphql
    type Mutation {
        addUser(user: UserArgumentType!): User!
        addAssessment(user_id: String!): Assessment!
    }
`
