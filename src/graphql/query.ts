export const queryType = `#graphql
    type Query {
        categories: [Category]
        category(id: Int!): Category
    }
`
