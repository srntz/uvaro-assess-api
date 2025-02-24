export const assessemntEntity = `#graphql
    type Assessment {
        assessment_id: Int!
        start_date_time: String!
        end_date_time: String
        user_id: String!
    }

    type AssessmentWithChildren {
        assessment_id: Int!
        start_date_time: String!
        end_date_time: String
        user_id: String!
        answers: [AssessmentAnswer]!
        notes: [Note]!
    }

    type AssessmentAnswer {
        answer_id: Int!
        answer_text: String!
        weighting: Int!
        question_id: Int!
    }
`;
