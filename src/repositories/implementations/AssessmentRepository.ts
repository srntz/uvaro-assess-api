import { IAssessmentRepository } from "../interfaces/IAssessmentRepository";
import { Repository } from "../base/Repository";
import { Assessment } from "../../models/Assessment";
import {
  answer,
  assessment,
  assessmentAnswer,
  assessmentLevel,
  level,
  question,
} from "../../db/schemas";
import { and, eq, sql } from "drizzle-orm";
import { GraphQLError } from "graphql/error";
import { Answer } from "../../models/Answer";
import { Note } from "../../models/Note";
import { note } from "../../db/schemas/note";
import { AssessmentAnswer } from "../../models/AssessmentAnswer";
import { AssessmentLevel } from "../../models/AssessmentLevel";
import { Level } from "../../models/Level";
import { ICalculateLevelAnswer } from "../../interfaces/ICalculateLevelAnswer";
import { AssessmentAnswerInsertDTO } from "../../dto/assessmentAnswer/AssessmentAnswerInsertDTO";

export class AssessmentRepository
  extends Repository
  implements IAssessmentRepository
{
  constructor() {
    super();
  }

  async addAssessment(userId: string): Promise<Assessment> {
    try {
      const data: (typeof assessment.$inferSelect)[] = await this.db
        .insert(assessment)
        .values({ user_id: userId })
        .returning();
      return Assessment.init(data[0]);
    } catch (error) {
      if (error.code === "23503") {
        throw new GraphQLError("User with the specified does not exist");
      }
      throw new GraphQLError(error.message);
    }
  }

  async getAssessmentById(assessmentId: number): Promise<Assessment> {
    const data: (typeof assessment.$inferSelect)[] = await this.db
      .select()
      .from(assessment)
      .where(eq(assessment.assessment_id, assessmentId));

    if (data.length > 0) {
      return Assessment.init(data[0]);
    } else {
      return null;
    }
  }

  async getUserAssessments(userId: string): Promise<Assessment[]> {
    const assessments: Assessment[] = [];

    const data: (typeof assessment.$inferSelect)[] = await this.db
      .select()
      .from(assessment)
      .where(eq(assessment.user_id, userId));

    data.forEach((item) => {
      assessments.push(Assessment.init(item));
    });

    return assessments;
  }

  async endAssessment(assessmentId: number): Promise<Assessment> {
    const selectedAssessmentData: (typeof assessment.$inferSelect)[] =
      await this.db
        .select()
        .from(assessment)
        .where(eq(assessment.assessment_id, assessmentId));

    if (selectedAssessmentData.length === 0) {
      throw new GraphQLError(
        "Assessment with the provided id has not been found",
      );
    }

    const currentAssessment = Assessment.init(selectedAssessmentData[0]);

    if (currentAssessment.end_date_time === null) {
      const data: (typeof assessment.$inferSelect)[] = await this.db
        .update(assessment)
        .set({ end_date_time: new Date() })
        .where(eq(assessment.assessment_id, assessmentId))
        .returning();

      return Assessment.init(data[0]);
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
      answers.push(Answer.init(item.answer));
    });

    return answers;
  }

  async getAssessmentLevels(assessmentId: number): Promise<Level[]> {
    interface IData {
      assessmentLevel: typeof assessmentLevel.$inferSelect;
      level: typeof level.$inferSelect;
    }

    const levels: Level[] = [];

    const data: IData[] = await this.db
      .select()
      .from(assessmentLevel)
      .leftJoin(level, eq(assessmentLevel.level_id, level.level_id))
      .where(eq(assessmentLevel.assessment_id, assessmentId));

    data.forEach((item) => {
      levels.push(Level.init(item.level));
    });

    return levels;
  }

  async getNotes(assessmentId: number): Promise<Note[]> {
    const notes: Note[] = [];

    const data: (typeof note.$inferSelect)[] = await this.db
      .select()
      .from(note)
      .where(eq(note.assessment_id, assessmentId));

    data.forEach((item) => {
      notes.push(Note.init(item));
    });

    return notes;
  }

  async insertNote(item: Note): Promise<Note> {
    const data: (typeof note.$inferSelect)[] = await this.db
      .insert(note)
      .values(item)
      .onConflictDoUpdate({
        target: [note.assessment_id, note.category_id],
        set: { note_text: item.note_text },
      })
      .returning();

    return Note.init(data[0]);
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

  async insertAnswersInBatch(
    answers: AssessmentAnswerInsertDTO[],
  ): Promise<AssessmentAnswer[]> {
    const insertedAnswers: AssessmentAnswer[] = [];

    const data: (typeof assessmentAnswer.$inferSelect)[] = await this.db
      .insert(assessmentAnswer)
      .values(
        (() => {
          return answers.map<typeof assessmentAnswer.$inferInsert>((answer) => {
            return {
              assessment_id: answer.assessmentId,
              question_id: answer.questionId,
              answer_id: answer.answerId,
            };
          });
        })(),
      )
      .onConflictDoUpdate({
        target: [assessmentAnswer.assessment_id, assessmentAnswer.question_id],
        set: { answer_id: sql`excluded.answer_id` },
      })
      .returning();

    data.forEach((item) => {
      insertedAnswers.push(
        new AssessmentAnswer(
          item.assessment_id,
          item.question_id,
          item.answer_id,
        ),
      );
    });

    return insertedAnswers;
  }

  async getAnswersForLevelCalculation(
    item: AssessmentLevel,
  ): Promise<ICalculateLevelAnswer[]> {
    const answers: ICalculateLevelAnswer[] = await this.db
      .select()
      .from(assessmentAnswer)
      .leftJoin(answer, eq(assessmentAnswer.answer_id, answer.answer_id))
      .leftJoin(
        question,
        eq(assessmentAnswer.question_id, question.question_id),
      )
      .where(
        and(
          eq(question.category_id, item.category_id),
          eq(assessmentAnswer.assessment_id, item.assessment_id),
        ),
      );

    return answers;
  }

  async insertLevel(item: AssessmentLevel): Promise<AssessmentLevel> {
    const data: AssessmentLevel = await this.db
      .insert(assessmentLevel)
      .values(item)
      .onConflictDoUpdate({
        target: [assessmentLevel.assessment_id, assessmentLevel.category_id],
        set: { level_id: item.level_id },
      })
      .returning();

    return AssessmentLevel.init(data[0]);
  }
}
