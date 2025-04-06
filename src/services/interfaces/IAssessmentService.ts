import { AnswerRequestDTO } from "../../dto/answer/AnswerRequestDTO.js";
import { LevelResponseDTO } from "../../dto/level/LevelResponseDTO.js";
import { AnswerResponseDTO } from "../../dto/answer/AnswerResponseDTO.js";
import { AssessmentResponseDTO } from "../../dto/assessment/AssessmentResponseDTO.js";
import { NoteResponseDTO } from "../../dto/note/NoteResponseDTO.js";

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
