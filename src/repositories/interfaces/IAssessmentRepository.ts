import { Assessment } from "../../models/Assessment.js";
import { Answer } from "../../models/Answer.js";
import { Note } from "../../models/Note.js";
import { AssessmentAnswer } from "../../models/AssessmentAnswer.js";
import { AssessmentLevel } from "../../models/AssessmentLevel.js";
import { ICalculateLevelAnswer } from "../../interfaces/ICalculateLevelAnswer.js";
import { Level } from "../../models/Level.js";
import { AssessmentAnswerInsertDTO } from "../../dto/assessmentAnswer/AssessmentAnswerInsertDTO.js";
import { Question } from "../../models/Question.js";

export interface IAssessmentRepository {
  getAssessmentById(assessmentId: number): Promise<Assessment>;
  getUserAssessments(userId: string): Promise<Assessment[]>;
  addAssessment(userId: string): Promise<Assessment>;
  endAssessment(assessmentId: number): Promise<Assessment>;
  getAssessmentAnswers(assessmentId: number): Promise<Answer[]>;
  getAssessmentAnswerQuestionPairs(
    assessmentId: number,
  ): Promise<{ answer: Answer; question: Question }[]>;
  getAssessmentLevels(assessmentId: number): Promise<Level[]>;
  getNotes(assessmentId: number): Promise<Note[]>;
  insertNote(item: Note): Promise<Note>;
  insertAnswer(item: AssessmentAnswer): Promise<AssessmentAnswer>;
  insertAnswersInBatch(
    answers: AssessmentAnswerInsertDTO[],
  ): Promise<AssessmentAnswer[]>;
  getAnswersForLevelCalculation(
    item: AssessmentLevel,
  ): Promise<ICalculateLevelAnswer[]>;
  insertLevel(item: AssessmentLevel): Promise<AssessmentLevel>;
}
