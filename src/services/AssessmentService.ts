import { Assessment } from "../models/Assessment";
import { Service } from "./Service";
import { answer, assessment, assessmentAnswer } from "../db/schemas";
import { eq } from "drizzle-orm";
import { Answer } from "../models/Answer";
import { GraphQLError } from "graphql/error";

export class AssessmentService extends Service<Assessment> {
  constructor() {
    super();
  }

  override async getRelated(parentId: string | number): Promise<Assessment[]> {
    const assessments: Assessment[] = [];

    const res = await this.db
      .select()
      .from(assessment)
      .where(eq(assessment.user_id, parentId.toString()));

    res.forEach((item) => {
      assessments.push(new Assessment(item));
    });

    return assessments;
  }

  override async create(item: Assessment): Promise<Assessment> {
    try {
      const res = await this.db.insert(assessment).values(item).returning();
      return new Assessment(res[0]);
    } catch (error) {
      if (error.code === "23503") {
        throw new GraphQLError("User with the specified does not exist");
      }
      throw new GraphQLError(error.message);
    }
  }

  async insertEndDateTime(assessmentId: number): Promise<Assessment> {
    const assessmentSelectQuery = await this.db
      .select()
      .from(assessment)
      .where(eq(assessment.assessment_id, assessmentId));

    if (assessmentSelectQuery.length === 0) {
      throw new GraphQLError(
        "Assessment with the provided id has not been found",
      );
    }

    const currentAssessment = new Assessment(assessmentSelectQuery[0]);

    if (currentAssessment.end_date_time === null) {
      const res = await this.db
        .update(assessment)
        .set({ end_date_time: new Date() })
        .where(eq(assessment.assessment_id, assessmentId))
        .returning();

      return new Assessment(res[0]);
    } else {
      throw new GraphQLError("The assessment is already finished");
    }
  }

  async getAnswers(assessment_id: number): Promise<Answer[]> {
    interface IAssessmentAnswerJoin {
      assessment_answer: typeof assessmentAnswer.$inferSelect;
      answer: typeof answer.$inferSelect;
    }

    const answers: Answer[] = [];

    const res: IAssessmentAnswerJoin[] = await this.db
      .select()
      .from(assessmentAnswer)
      .leftJoin(answer, eq(assessmentAnswer.answer_id, answer.answer_id))
      .where(eq(assessmentAnswer.assessment_id, assessment_id));

    res.forEach((item) => {
      answers.push(new Answer(item.answer));
    });

    return answers;
  }
}
