import { Assessment } from "../../models/Assessment";
import { Answer } from "../../models/Answer";
import { Note } from "../../models/Note";
import { AssessmentAnswer } from "../../models/AssessmentAnswer";
import { AssessmentLevel } from "../../models/AssessmentLevel";
import { ICalculateLevelAnswer } from "../../interfaces/ICalculateLevelAnswer";
import { Level } from "../../models/Level";
import { answer } from "../../db/schemas";

export interface IAssessmentRepository {
  getAssessmentById(assessmentId: number): Promise<Assessment>;
  getUserAssessments(userId: string): Promise<Assessment[]>;
  addAssessment(item: Assessment): Promise<Assessment>;
  endAssessment(assessmentId: number): Promise<Assessment>;
  getAssessmentAnswers(assessmentId: number): Promise<Answer[]>;
  getAssessmentLevels(assessmentId: number): Promise<Level[]>;
  getNotes(assessmentId: number): Promise<Note[]>;
  insertNote(item: Note): Promise<Note>;
  insertAnswer(item: AssessmentAnswer): Promise<AssessmentAnswer>;
  getAssessmentAnswersByCategoryId(
    assessmentId: number,
    categoryId: number,
  ): Promise<(typeof answer.$inferSelect)[]>;
  insertLevel(item: AssessmentLevel): Promise<AssessmentLevel>;
  getQuestionIdsByCategoryId(
    categoryId: number,
    followUp: boolean,
  ): Promise<number[]>;
}
