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
  note,
} from "../../db/schemas";
import { and, eq, sql } from "drizzle-orm";
import { Answer } from "../../models/Answer";
import { Note } from "../../models/Note";
import { AssessmentAnswer } from "../../models/AssessmentAnswer";
import { AssessmentLevel } from "../../models/AssessmentLevel";
import { Level } from "../../models/Level";
import { ICalculateLevelAnswer } from "../../interfaces/ICalculateLevelAnswer";
import { AssessmentAnswerInsertDTO } from "../../dto/assessmentAnswer/AssessmentAnswerInsertDTO";
import { Question } from "../../models/Question";

export class AssessmentRepository
  extends Repository
  implements IAssessmentRepository {
  constructor() {
    super();
  }

  async addAssessment(userId: string): Promise<Assessment> {
    const data: (typeof assessment.$inferSelect)[] = await this.db
      .insert(assessment)
      .values({ user_id: userId })
      .returning();
    return Assessment.init(data[0]);
  }

  async deletePendingAssessments(userId: string): Promise<Assessment[]> {
    const deletedAssessments: Assessment[] = []
    const data: (typeof assessment.$inferSelect)[] = await this.db.delete(assessment).where(and(eq(assessment.user_id, userId), eq(assessment.end_date_time, null))).returning()

    data.forEach(item => {
      deletedAssessments.push(Assessment.init(item))
    })

    return deletedAssessments
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
    const data = await this.db
      .update(assessment)
      .set({ end_date_time: new Date() } as unknown)
      .where(eq(assessment.assessment_id, assessmentId))
      .returning();

    return Assessment.init(data[0]);
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

  async getAssessmentAnswerQuestionPairs(assessmentId: number) {
    const pairs: { answer: Answer; question: Question }[] = [];

    const data: {
      assessment_answer: typeof assessmentAnswer.$inferSelect;
      answer: typeof answer.$inferSelect;
      question: typeof question.$inferSelect;
    }[] = await this.db
      .select()
      .from(assessmentAnswer)
      .leftJoin(answer, eq(assessmentAnswer.answer_id, answer.answer_id))
      .leftJoin(
        question,
        eq(assessmentAnswer.question_id, question.question_id),
      )
      .where(eq(assessmentAnswer.assessment_id, assessmentId));

    data.forEach((item) => {
      pairs.push({
        answer: Answer.init(item.answer),
        question: Question.init(item.question),
      });
    });

    return pairs;
  }

  async getAssessmentLevels(assessmentId: number): Promise<Level[]> {
    const levels: Level[] = [];

    const data = await this.db
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

    const data = await this.db
      .select()
      .from(note)
      .where(eq(note.assessment_id, assessmentId));

    data.forEach((item) => {
      notes.push(Note.init(item));
    });

    return notes;
  }

  async insertNote(item: Note): Promise<Note> {
    const data = await this.db
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

    return AssessmentAnswer.init(data[0]);
  }

  async insertAnswersInBatch(
    answers: AssessmentAnswerInsertDTO[],
  ): Promise<AssessmentAnswer[]> {
    const insertedAnswers: AssessmentAnswer[] = [];

    const data = await this.db
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
    const data = await this.db
      .insert(assessmentLevel)
      .values({
        assessment_id: item.assessment_id,
        category_id: item.category_id,
        level_id: item.level_id as number,
      })
      .onConflictDoUpdate({
        target: [assessmentLevel.assessment_id, assessmentLevel.category_id],
        set: { level_id: item.level_id },
      })
      .returning();

    return AssessmentLevel.init(data[0]);
  }
}
