export const typedefs =  `#graphql
    type Category {
        category_id: Int!
        category_name: String!
        questions: [Question!]!
        levels: [Level!]!
    }
    
    type Question {
        question_id: Int!
        question_text: String!
        category_id: Int!
        category: Category!
        answers: [Answer!]!
    }

    type Answer {
        answer_id: Int!
        answer_text: String!
        weighting: Int!
        question_id: Int!
        question: Question!
    }

    type Level {
        level_id: Int!
        level_name: String!
        level_statement: String!
        required_weighting: Int!
        category_id: Int!
        category: Category!
    }
`
