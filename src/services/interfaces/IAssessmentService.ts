import { Assessment } from "../../models/Assessment";
import { Answer } from "../../models/Answer";
import { Note } from "../../models/Note";
import { AssessmentAnswer } from "../../models/AssessmentAnswer";
import { AnswerRequestDTO } from "../../dto/answer/AnswerRequestDTO";
import { LevelResponseDTO } from "../../dto/level/LevelResponseDTO";
import { AnswerResponseDTO } from "../../dto/answer/AnswerResponseDTO";
import { AssessmentResponseDTO } from "../../dto/assessment/AssessmentResponseDTO";
import { NoteResponseDTO } from "../../dto/note/NoteResponseDTO";

export interface IAssessmentService {
  getAssessmentById(assessmentId: number): Promise<AssessmentResponseDTO>;
  getUserAssessments(userId: string): Promise<AssessmentResponseDTO[]>;
  addAssessment(userId: string): Promise<AssessmentResponseDTO>;
  endAssessment(assessmentId: number): Promise<LevelResponseDTO[]>;
  getAssessmentAnswers(assessmentId: number): Promise<AnswerResponseDTO[]>;
  getAssessmentLevels(assessmentId: number): Promise<LevelResponseDTO[]>;
  getNotes(assessmentId: number): Promise<NoteResponseDTO[]>;
  insertNote(
    assessmentId: number,
    categoryId: number,
    text: string,
  ): Promise<NoteResponseDTO>;
  calculateLevel(
    answers: AnswerRequestDTO[],
    categoryId: number,
  ): Promise<LevelResponseDTO>;
  completeCategory(
    categoryId: number,
    assessmentId: number,
    answers: AnswerRequestDTO[],
  ): Promise<LevelResponseDTO>;
}
