import { Service } from "./Service";
import { Assessment } from "../models/Assessment";
import { assessment } from "../db/schemas";
import { eq } from "drizzle-orm";
import { GraphQLError } from "graphql/error";

export class AssessmentService extends Service<Assessment> {
  constructor() {
    super();
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
}
