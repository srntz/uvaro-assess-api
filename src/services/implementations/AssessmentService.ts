import { IAssessmentService } from "../interfaces/IAssessmentService";
import { IAssessmentRepository } from "../../repositories/interfaces/IAssessmentRepository";
import { Assessment } from "../../models/Assessment";
import { Answer } from "../../models/Answer";
import { Note } from "../../models/Note";
import { AssessmentAnswer } from "../../models/AssessmentAnswer";
import { Level } from "../../models/Level";
import { AssessmentLevel } from "../../models/AssessmentLevel";
import { ILevelRepository } from "../../repositories/interfaces/ILevelRepository";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { User } from "../../models/User";
import { AnswerInsertDTO } from "../../dto/AnswerInsertDTO";
import { ICategoryRepository } from "../../repositories/interfaces/ICategoryRepository";
import { GraphQLError } from "graphql/error";
import { IAnswerRepository } from "../../repositories/interfaces/IAnswerRepository";
import { mapAll } from "../../dto/mappers/mapAll";
import { mapAnswerSelectToAnswerInsertDTO } from "../../dto/mappers/mapAnswerSelectToAnswerInsertDTO";

export class AssessmentService implements IAssessmentService {
  constructor(
    private readonly assessmentRepository: IAssessmentRepository,
    private readonly levelRepository: ILevelRepository,
    private readonly userRepository: IUserRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly answerRepository: IAnswerRepository,
  ) {}

  async addAssessment(userId: string): Promise<Assessment> {
    const assessment = new Assessment({ user_id: userId });
    return await this.assessmentRepository.addAssessment(assessment);
  }

  async endAssessment(assessmentId: number): Promise<Assessment> {
    const assessment =
      await this.assessmentRepository.getAssessmentById(assessmentId);

    if (assessment.end_date_time) {
      throw new GraphQLError("The assessment is already finished");
    }

    const assessmentLevels =
      await this.assessmentRepository.getAssessmentLevels(assessmentId);

    if (assessmentLevels.length !== 4) {
      throw new GraphQLError(
        "You can't end an assessment until levels for all categories are calculated",
      );
    }

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

  async getAssessmentLevels(assessmentId: number): Promise<Level[]> {
    return await this.assessmentRepository.getAssessmentLevels(assessmentId);
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

  async insertBatchedAnswers(
    assessmentId: number,
    answers: AnswerInsertDTO[],
  ): Promise<AssessmentAnswer[]> {
    const insertedAnswers = [];

    for (let i = 0; i < answers.length; i++) {
      insertedAnswers.push(
        await this.assessmentRepository.insertAnswer(
          new AssessmentAnswer(
            assessmentId,
            answers[i].questionId,
            answers[i].answerId,
          ),
        ),
      );
    }

    return insertedAnswers;
  }

  async calculateLevelsFromDatabaseAnswers(
    assessmentId: number,
  ): Promise<Level[]> {
    const calculatedLevels = [];

    const categoryIds = await this.categoryRepository.getAllIds();

    for (let i = 0; i < categoryIds.length; i++) {
      const availableLevels = await this.levelRepository.getLevelsByCategory(
        categoryIds[i].category_id,
      );
      const answers =
        await this.assessmentRepository.getAssessmentAnswersByCategoryId(
          assessmentId,
          categoryIds[i].category_id,
        );

      const calculatedLevel = this.calculateLevel(
        answers as Answer[],
        availableLevels,
      );

      await this.assessmentRepository.insertLevel({
        level_id: calculatedLevel.level_id,
        assessment_id: assessmentId,
        category_id: categoryIds[i].category_id,
      });

      calculatedLevels.push(calculatedLevel);
    }

    return calculatedLevels;
  }

  private calculateLevel(answers: Answer[], levels: Level[]): Level {
    let totalScore = 0;
    levels.sort((a, b) => a.required_weighting - b.required_weighting);

    // Iterating the answers to calculate the total score
    for (let i = 0; i < answers.length; i++) {
      totalScore += answers[i].weighting;
    }

    /*
      Iterating the sorted levels array to find the correct level.

      The array is accessed with i-1 because the if condition is checked after the incrementation
      which makes the index jump over the correct level.
    */
    for (let i = 0; i < levels.length; i++) {
      if (totalScore < levels[i].required_weighting) {
        return levels[i - 1];
      } else if (totalScore === levels[i].required_weighting) {
        return levels[i];
      }
    }
  }

  async addAssessmentAsGuest(): Promise<Assessment> {
    const guestUser = new User("GUEST", "GUEST", "guest@guest.com");
    const insertedUser = await this.userRepository.insertUser(guestUser);
    return await this.addAssessment(insertedUser.user_id);
  }

  async getCalculatedLevel(
    categoryId: number,
    answers: AnswerInsertDTO[],
  ): Promise<Level> {
    if (
      !(await this.verifyRequiredQuestionsPresence(
        categoryId,
        answers.map((item) => item.questionId),
      ))
    ) {
      throw new GraphQLError(
        "Please provide answers for all non follow-up question for the specified category to get a level.",
      );
    }

    const availableLevels =
      await this.levelRepository.getLevelsByCategory(categoryId);

    const dbAnswers = [];
    for (let i = 0; i < answers.length; i++) {
      dbAnswers.push(await this.answerRepository.getById(answers[i].answerId));
    }

    return this.calculateLevel(dbAnswers, availableLevels);
  }

  async calculateAndSaveLevel(
    assessmentId: number,
    categoryId: number,
  ): Promise<Level> {
    const answers =
      await this.assessmentRepository.getAssessmentAnswersByCategoryId(
        assessmentId,
        categoryId,
      );

    if (
      !(await this.verifyRequiredQuestionsPresence(
        categoryId,
        answers.map((item) => item.question_id),
      ))
    ) {
      throw new GraphQLError(
        "Please provide answers for all non follow-up question for the specified category to get a level.",
      );
    }
    const availableLevels =
      await this.levelRepository.getLevelsByCategory(categoryId);

    const calculatedLevel = this.calculateLevel(
      answers as Answer[],
      availableLevels,
    );

    await this.assessmentRepository.insertLevel({
      assessment_id: assessmentId,
      category_id: categoryId,
      level_id: calculatedLevel.level_id,
    });

    return calculatedLevel;
  }

  private async verifyRequiredQuestionsPresence(
    categoryId: number,
    answers: number[],
  ): Promise<boolean> {
    const requiredQuestionIds =
      await this.assessmentRepository.getQuestionIdsByCategoryId(
        categoryId,
        false,
      );

    for (let i = 0; i < requiredQuestionIds.length; i++) {
      let match = false;
      for (let j = 0; j < answers.length; j++) {
        if (requiredQuestionIds[i] === answers[j]) {
          match = true;
        }
      }
      if (!match) {
        return false;
      }
    }

    return true;
  }
}
