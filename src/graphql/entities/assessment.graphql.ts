export const assessmentEntity = `#graphql
    type Assessment {
        assessment_id: Int!,
        start_date_time: String!,
        end_date_time: String!,
        notes: String!,
        user_id: String!,
    }
    
    type AssessmentWithChildren {
        assessment_id: Int!,
        start_date_time: String!,
        end_date_time: String!,
        notes: String!,
        user_id: String!,
        answers: [Answer]!
    }
`
