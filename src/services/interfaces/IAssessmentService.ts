import { AnswerRequestDTO } from "../../dto/answer/AnswerRequestDTO";
import { LevelResponseDTO } from "../../dto/level/LevelResponseDTO";
import { AnswerResponseDTO } from "../../dto/answer/AnswerResponseDTO";
import { AssessmentResponseDTO } from "../../dto/assessment/AssessmentResponseDTO";
import { NoteResponseDTO } from "../../dto/note/NoteResponseDTO";

export interface IAssessmentService {
  /**
   * Retrieves assessment with the specified assessmentId from the database.
   * @param assessmentId Assessment id for retrieval
   * @returns ```Promise<AssessmentResponseDTO>``` or ```Promise<null>``` if the assessment does not exist
   */
  getAssessmentById(
    assessmentId: number,
  ): Promise<AssessmentResponseDTO | null>;

  /**
   * Retrieves all assessments related to the specified user.
   * @param userId
   * @returns ```Promise<AssessmentResponseDTO[]>```
   */
  getUserAssessments(userId: string): Promise<AssessmentResponseDTO[]>;

  /**
   * Deletes all pending assessments and initializes a new assessment.
   * @param userId Owner of the assessments
   * @throws ```BadRequest``` if the user does not exist
   * @returns ```Promise<AssessmentResponseDTO>```
   */
  addAssessment(userId: string): Promise<AssessmentResponseDTO>;

  /**
   * Checks if the specified assessment has all categories completed, inserts end_date_time, and returns levels for all categories
   * @param assessmentId
   * @returns ```Promise<LevelResponseDTO[]>```
   */
  endAssessment(assessmentId: number): Promise<LevelResponseDTO[]>;

  /**
   * Retrieves all answers related to the specified assessment
   * @param assessmentId
   * @returns ```Promise<AnswerRequestDTO[]>```
   */
  getAssessmentAnswers(assessmentId: number): Promise<AnswerResponseDTO[]>;

  /**
   * Retrieves all levels related to the specified assessment
   * @param assessmentId
   * @returns ```Promise<LevelResponseDTO[]>```
   */
  getAssessmentLevels(assessmentId: number): Promise<LevelResponseDTO[]>;

  /**
   * Retrieves all notes related to the specified assessment
   * @param assessmentId
   * @returns ```Promise<NoteResponseDTO[]>```
   */
  getNotes(assessmentId: number): Promise<NoteResponseDTO[]>;

  /**
   * Inserts a note
   * @param assessmentId
   * @param categoryId
   * @param text
   * @throws ```BadRequest``` if the specified categoryId or assessmentId does not exist
   * @returns ```Promise<NoteResponseDTO>```
   */
  insertNote(
    assessmentId: number,
    categoryId: number,
    text: string,
  ): Promise<NoteResponseDTO>;

  /**
   * Calculates a level based on the provided answers without saving any data (guest user flow)
   * @param answers An array of objects containing answer data
   * @param categoryId
   * @throws ```BadRequest``` if not all non-followup questions of the specified category have been provided
   * @returns ````Promise<LevelResponseDTO>``
   */
  calculateLevel(
    answers: AnswerRequestDTO[],
    categoryId: number,
  ): Promise<LevelResponseDTO>;

  /**
   * Calculates a level based on the provided answers. Saves the answers and the calculated level to the database.
   * @param assessmentId
   * @param categoryId
   * @param answers
   * @throws ```BadRequest``` if not all non-followup questions of the specified category have been provided.
   * @throws ```BadRequest``` if the specified category is not available for calculation (it does not exist or does not have non-followup questions)
   * @returns ```Promise<LevelResponseDTO>```
   */
  completeCategory(
    categoryId: number,
    assessmentId: number,
    answers: AnswerRequestDTO[],
  ): Promise<LevelResponseDTO>;
}
