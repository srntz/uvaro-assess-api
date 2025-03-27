import { Assessment } from "../../models/Assessment";
import { Answer } from "../../models/Answer";
import { Note } from "../../models/Note";
import { AssessmentAnswer } from "../../models/AssessmentAnswer";
import { AssessmentLevel } from "../../models/AssessmentLevel";
import { ICalculateLevelAnswer } from "../../interfaces/ICalculateLevelAnswer";
import { Level } from "../../models/Level";
import { AssessmentAnswerInsertDTO } from "../../dto/assessmentAnswer/AssessmentAnswerInsertDTO";

export interface IAssessmentRepository {
  getAssessmentById(assessmentId: number): Promise<Assessment>;
  getUserAssessments(userId: string): Promise<Assessment[]>;
  addAssessment(userId: string): Promise<Assessment>;
  endAssessment(assessmentId: number): Promise<Assessment>;
  getAssessmentAnswers(assessmentId: number): Promise<Answer[]>;
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
