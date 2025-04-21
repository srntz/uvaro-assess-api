import { Assessment } from "../../models/Assessment";
import { Answer } from "../../models/Answer";
import { Note } from "../../models/Note";
import { AssessmentAnswer } from "../../models/AssessmentAnswer";
import { AssessmentLevel } from "../../models/AssessmentLevel";
import { Level } from "../../models/Level";
import { AssessmentAnswerInsertDTO } from "../../dto/assessmentAnswer/AssessmentAnswerInsertDTO";
import { Question } from "../../models/Question";
import { NoteInsertDTO } from "../../dto/note/NoteInsertDTO";

export interface IAssessmentRepository {
  /**
   * Retrieves assessment with the specified assessmentId from the database.
   * @param assessmentId Assessment id for retrieval
   * @returns ```Promise<Assessment>``` or ```Promise<null>``` if the assessment does not exist
   * @throws ```Error``` if the database transaction failed
   */
  getAssessmentById(assessmentId: number): Promise<Assessment>;

  /**
   * Retrieves all assessments related to the specified user.
   * @param userId
   * @returns ```Promise<Assessment[]>```
   * @throws ```Error``` if the database transaction failed
   */
  getUserAssessments(userId: string): Promise<Assessment[]>;

  /**
   * Creates a new assessment in the database
   * @param userId
   * @returns ```Promise<Assessment>```
   * @throws ```Error``` if the database transaction failed
   */
  addAssessment(userId: string): Promise<Assessment>;

  /**
   * Deletes all assessments with end_date_time = NULL related to the provided user id
   * @param userId
   * @returns ```Promise<Assessment[]>```
   * @throws ```Error``` if the database transaction failed
   */
  deletePendingAssessments(userId: string): Promise<Assessment[]>;

  /**
   * Sets the end datetime of the specified assessment to the current timestamp
   * @param assessmentId
   * @returns ```Promise<Assessment>``` of ```Promise<null>``` if the assessment does not exist
   * @throws ```Error``` if the database transaction failed
   */
  endAssessment(assessmentId: number): Promise<Assessment>;

  /**
   * Retrieves all answers related to the specified assessment
   * @param assessmentId
   * @returns ```Promise<Answer[]>```
   * @throws ```Error``` if the database transaction failed
   */
  getAssessmentAnswers(assessmentId: number): Promise<Answer[]>;

  /**
   * Retrieves all answers with their respective questions related to the provided assessment
   * @param assessmentId
   * @returns ```Promise<{answer: Answer; question: Question}[]>```
   * @throws ```Error``` if the database transaction failed
   */
  getAssessmentAnswerQuestionPairs(
    assessmentId: number,
  ): Promise<{ answer: Answer; question: Question }[]>;

  /**
   * Retrieves levels associated with the specified assessment
   * @param assessmentId
   * @returns ```Promise<Level[]>```
   * @throws ```Error``` if the database transaction failed
   */
  getAssessmentLevels(assessmentId: number): Promise<Level[]>;

  /**
   * Retrieves notes associated with the specified assessment
   * @param assessmentId
   * @returns ```Promise<Note[]>```
   * @throws ```Error``` if the database transaction failed
   */
  getNotes(assessmentId: number): Promise<Note[]>;

  /**
   * Inserts new note into the database
   * @param assessmentId
   * @param categoryId
   * @param note
   * @returns ```Promise<Note>```
   * @throws ```Error``` if the database transaction failed
   */
  insertNote(
    assessmentId: number,
    categoryId: number,
    note: NoteInsertDTO,
  ): Promise<Note>;

  /**
   * For each item in the "answers" argument, inserts the answer into the assessment
   * @param answers
   * @returns ```Promise<AssessmentAnswer[]>```
   * @throws ```Error``` if the database transaction failed
   */
  insertAnswersInBatch(
    answers: AssessmentAnswerInsertDTO[],
  ): Promise<AssessmentAnswer[]>;

  /**
   * Inserts level into the assessment
   * @param level
   * @returns ```Promise<AssessmentLevel>```
   * @throws ```Error``` if the database transaction failed
   */
  insertLevel(level: AssessmentLevel): Promise<AssessmentLevel>;
}
