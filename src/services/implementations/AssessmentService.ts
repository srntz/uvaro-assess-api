import { IAssessmentService } from "../interfaces/IAssessmentService";
import { IAssessmentRepository } from "../../repositories/interfaces/IAssessmentRepository";
import { Assessment } from "../../models/Assessment";
import { Answer } from "../../models/Answer";
import { Note } from "../../models/Note";
import { AssessmentAnswer } from "../../models/AssessmentAnswer";
import { Level } from "../../models/Level";
import { AssessmentLevel } from "../../models/AssessmentLevel";
import { ILevelRepository } from "../../repositories/interfaces/ILevelRepository";

export class AssessmentService implements IAssessmentService {
  constructor(
    private assessmentRepository: IAssessmentRepository,
    private levelRepository: ILevelRepository,
  ) {}

  async addAssessment(userId: string): Promise<Assessment> {
    const assessment = new Assessment({ user_id: userId });
    return await this.assessmentRepository.addAssessment(assessment);
  }

  async endAssessment(assessmentId: number): Promise<Assessment> {
    return await this.assessmentRepository.endAssessment(assessmentId);
  }

  async getAssessmentById(assessmentId: number): Promise<Assessment> {
    return await this.assessmentRepository.getAssessmentById(assessmentId);
  }

  async getUserAssessments(userId: string): Promise<Assessment[]> {
    return await this.assessmentRepository.getUserAssessments(userId);
  }

  async getAssessmentAnswers(assessmentId: number): Promise<Answer[]> {
    return await this.assessmentRepository.getAssessmentAnswers(assessmentId);
  }

  async getNotes(assessmentId: number): Promise<Note[]> {
    return await this.assessmentRepository.getNotes(assessmentId);
  }

  async insertNote(
    assessmentId: number,
    categoryId: number,
    text: string,
  ): Promise<Note> {
    const note = new Note({
      assessment_id: assessmentId,
      category_id: categoryId,
      note_text: text,
    });
    return await this.assessmentRepository.insertNote(note);
  }

  async insertAnswer(
    assessmentId: number,
    questionId: number,
    answer_id: number,
  ): Promise<AssessmentAnswer> {
    const assessmentAnswer = new AssessmentAnswer(
      assessmentId,
      questionId,
      answer_id,
    );

    return await this.assessmentRepository.insertAnswer(assessmentAnswer);
  }

  async calculateLevel(
    assessmentId: number,
    categoryId: number,
  ): Promise<Level> {
    let totalScore = 0;

    const assessmentLevel = new AssessmentLevel(assessmentId, categoryId);

    // Answers from assessment_answer table related to the provided category
    const answers =
      await this.assessmentRepository.getAnswersForLevelCalculation(
        assessmentLevel,
      );

    // All levels related to the specified category
    const levels = await this.levelRepository.getLevelsByCategory(
      assessmentLevel.category_id,
    );
    levels.sort((a, b) => a.required_weighting - b.required_weighting);

    // Iterating the answers to calculate the total score
    for (let i = 0; i < answers.length; i++) {
      totalScore += answers[i].answer.weighting;
    }

    /*
      Iterating the sorted levels array to find the correct level.

      The array is accessed with i-1 because the if condition is checked after the incrementation
      which makes the index jump over the correct level.
    */
    for (let i = 0; i < levels.length; i++) {
      if (totalScore < levels[i].required_weighting) {
        assessmentLevel.level_id = levels[i - 1].level_id;
        break;
      }
    }

    // assessment_level record returned by the insert query
    const insertedLevel =
      await this.assessmentRepository.insertLevel(assessmentLevel);

    // Querying and returning the actual level.
    return this.levelRepository.getLevelById(insertedLevel.level_id);
  }
}
