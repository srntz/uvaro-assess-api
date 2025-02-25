import { IAssessmentRepository } from "../interfaces/IAssessmentRepository";
import { Repository } from "../base/Repository";
import { Assessment } from "../../models/Assessment";
import { answer, assessment, assessmentAnswer } from "../../db/schemas";
import { eq } from "drizzle-orm";
import { GraphQLError } from "graphql/error";
import { Answer } from "../../models/Answer";
import { Note } from "../../models/Note";
import { note } from "../../db/schemas/note";
import { AssessmentAnswer } from "../../models/AssessmentAnswer";

export class AssessmentRepository
  extends Repository
  implements IAssessmentRepository
{
  constructor() {
    super();
  }

  async addAssessment(item: Assessment): Promise<Assessment> {
    try {
      const res = await this.db
        .insert(assessment)
        .values({ user_id: item.user_id })
        .returning();
      return new Assessment(res[0]);
    } catch (error) {
      if (error.code === "23503") {
        throw new GraphQLError("User with the specified does not exist");
      }
      throw new GraphQLError(error.message);
    }
  }

  async getAssessmentById(assessmentId: number): Promise<Assessment> {
    const data = await this.db
      .select()
      .from(assessment)
      .where(eq(assessment.assessment_id, assessmentId));

    if (data.length > 0) {
      return new Assessment(data[0]);
    } else {
      return null;
    }
  }

  async getUserAssessments(userId: string): Promise<Assessment[]> {
    const assessments: Assessment[] = [];

    const res = await this.db
      .select()
      .from(assessment)
      .where(eq(assessment.user_id, userId));

    res.forEach((item) => {
      assessments.push(new Assessment(item));
    });

    return assessments;
  }

  async endAssessment(assessmentId: number): Promise<Assessment> {
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

  async getAssessmentAnswers(assessmentId: number): Promise<Answer[]> {
    interface IAssessmentAnswerJoin {
      assessment_answer: typeof assessmentAnswer.$inferSelect;
      answer: typeof answer.$inferSelect;
    }

    const answers: Answer[] = [];

    const res: IAssessmentAnswerJoin[] = await this.db
      .select()
      .from(assessmentAnswer)
      .leftJoin(answer, eq(assessmentAnswer.answer_id, answer.answer_id))
      .where(eq(assessmentAnswer.assessment_id, assessmentId));

    res.forEach((item) => {
      answers.push(new Answer(item.answer));
    });

    return answers;
  }

  async getNotes(assessmentId: number): Promise<Note[]> {
    const res: Note[] = [];
    const data = await this.db
      .select()
      .from(note)
      .where(eq(note.assessment_id, assessmentId));

    data.forEach((item) => {
      res.push(new Note(item));
    });

    return res;
  }

  async insertNote(item: Note): Promise<Note> {
    const res = await this.db
      .insert(note)
      .values(item)
      .onConflictDoUpdate({
        target: [note.assessment_id, note.category_id],
        set: { note_text: item.note_text },
      })
      .returning();
    return new Note(res[0]);
  }

  async insertAnswer(item: AssessmentAnswer): Promise<AssessmentAnswer> {
    const data = await this.db
      .insert(assessmentAnswer)
      .values(item)
      .onConflictDoUpdate({
        target: [assessmentAnswer.assessment_id, assessmentAnswer.question_id],
        set: { answer_id: item.answer_id },
      })
      .returning();

    console.log(data);
    return AssessmentAnswer.init(data[0]);
  }
}
