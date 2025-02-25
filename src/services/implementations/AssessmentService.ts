import { IAssessmentService } from "../interfaces/IAssessmentService";
import { IAssessmentRepository } from "../../repositories/interfaces/IAssessmentRepository";
import { Assessment } from "../../models/Assessment";
import { Answer } from "../../models/Answer";
import { Note } from "../../models/Note";
import { assessment } from "../../db/schemas";
import { text } from "drizzle-orm/pg-core";
import { note } from "../../db/schemas/note";
import { AssessmentAnswer } from "../../models/AssessmentAnswer";

export class AssessmentService implements IAssessmentService {
  constructor(private repository: IAssessmentRepository) {}

  async addAssessment(userId: string): Promise<Assessment> {
    const assessment = new Assessment({ user_id: userId });
    return await this.repository.addAssessment(assessment);
  }

  async endAssessment(assessmentId: number): Promise<Assessment> {
    return await this.repository.endAssessment(assessmentId);
  }

  async getAssessmentById(assessmentId: number): Promise<Assessment> {
    return await this.repository.getAssessmentById(assessmentId);
  }

  async getUserAssessments(userId: string): Promise<Assessment[]> {
    return await this.repository.getUserAssessments(userId);
  }

  async getAssessmentAnswers(assessmentId: number): Promise<Answer[]> {
    return await this.repository.getAssessmentAnswers(assessmentId);
  }

  async getNotes(assessmentId: number): Promise<Note[]> {
    return await this.repository.getNotes(assessmentId);
  }

  async insertNote(
    assessmentId: number,
    categoryId: number,
    text: string,
  ): Promise<Note> {
    const note = new Note({
      assessment_id: assessmentId,
      category_id: categoryId,
      note_text: text,
    });
    return await this.repository.insertNote(note);
  }

  async insertAnswer(
    assessmentId: number,
    questionId: number,
    answer_id: number,
  ): Promise<AssessmentAnswer> {
    const assessmentAnswer = new AssessmentAnswer(
      assessmentId,
      questionId,
      answer_id,
    );

    return await this.repository.insertAnswer(assessmentAnswer);
  }
}
