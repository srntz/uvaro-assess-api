import { Assessment } from "../../models/Assessment";
import { Answer } from "../../models/Answer";
import { Note } from "../../models/Note";

export interface IAssessmentRepository {
  getAssessmentById(assessmentId: number): Promise<Assessment>;
  getUserAssessments(userId: string): Promise<Assessment[]>;
  addAssessment(item: Assessment): Promise<Assessment>;
  endAssessment(assessmentId: number): Promise<Assessment>;
  getAssessmentAnswers(assessmentId: number): Promise<Answer[]>;
  getNotes(assessmentId: number): Promise<Note[]>;
  insertNote(item: Note): Promise<Note>;
}
