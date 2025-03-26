import { Assessment } from "../../models/Assessment";
import { Answer } from "../../models/Answer";
import { Note } from "../../models/Note";
import { AssessmentAnswer } from "../../models/AssessmentAnswer";
import { Level } from "../../models/Level";
import { AnswerWithWeightingAndCoefficientDTO } from "../../dto/answer/AnswerWithWeightingAndCoefficientDTO";
import { AnswerRequestDTO } from "../../dto/answer/AnswerRequestDTO";
import { LevelResponseDTO } from "../../dto/level/LevelResponseDTO";

export interface IAssessmentService {
  getAssessmentById(assessmentId: number): Promise<Assessment>;
  getUserAssessments(userId: string): Promise<Assessment[]>;
  addAssessment(userId: string): Promise<Assessment>;
  addAssessmentAsGuest(): Promise<Assessment>;
  endAssessment(assessmentId: number): Promise<Assessment>;
  getAssessmentAnswers(assessmentId: number): Promise<Answer[]>;
  getAssessmentLevels(assessmentId: number): Promise<Level[]>;
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
  calculateLevel(
    answers: AnswerWithWeightingAndCoefficientDTO[],
    levels: Level[],
    totalCoefficient: number,
  ): Level;
  getLevel(
    answers: AnswerRequestDTO[],
    categoryId: number,
  ): Promise<LevelResponseDTO>;
}
