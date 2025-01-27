export const userEntity = `#graphql
    input UserArgumentType {
        first_name: String!
        last_name: String!
        email: String!
    }
    
    type User {
        user_id: String!
        first_name: String!
        last_name: String!
        email: String!
    }
`
