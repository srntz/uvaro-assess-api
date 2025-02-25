import { Assessment } from "../../models/Assessment";
import { Answer } from "../../models/Answer";
import { Note } from "../../models/Note";
import { AssessmentAnswer } from "../../models/AssessmentAnswer";
import { Level } from "../../models/Level";

export interface IAssessmentService {
  getAssessmentById(assessmentId: number): Promise<Assessment>;
  getUserAssessments(userId: string): Promise<Assessment[]>;
  addAssessment(userId: string): Promise<Assessment>;
  endAssessment(assessmentId: number): Promise<Assessment>;
  getAssessmentAnswers(assessmentId: number): Promise<Answer[]>;
  getNotes(assessmentId: number): Promise<Note[]>;
  insertNote(
    assessmentId: number,
    categoryId: number,
    text: string,
  ): Promise<Note>;
  insertAnswer(
    assessmentId: number,
    questionId: number,
    answer_id: number,
  ): Promise<AssessmentAnswer>;
  calculateLevel(assessmentId: number, categoryId: number): Promise<Level>;
}
