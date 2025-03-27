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
import { AnswerWithWeightingAndCoefficientDTO } from "../../dto/answer/AnswerWithWeightingAndCoefficientDTO";
import { LevelWithWeightingDTO } from "../../dto/level/LevelWithWeightingDTO";
import { AnswerRequestDTO } from "../../dto/answer/AnswerRequestDTO";
import { IAnswerRepository } from "../../repositories/interfaces/IAnswerRepository";
import { LevelResponseDTO } from "../../dto/level/LevelResponseDTO";
import { mapLevelWithWeightingDTOToLevelResponseDTO } from "../../mappers/level/mapLevelWithWeightingDTOToLevelResponseDTO";
import { AnswerWithCategoryIdDTO } from "../../dto/answer/AnswerWithCategoryIdDTO";
import { IQuestionRepository } from "../../repositories/interfaces/IQuestionRepository";
import { GraphQLError } from "graphql/error";
import { AssessmentAnswerInsertDTO } from "../../dto/assessmentAnswer/AssessmentAnswerInsertDTO";

export class AssessmentService implements IAssessmentService {
  constructor(
    private readonly assessmentRepository: IAssessmentRepository,
    private readonly levelRepository: ILevelRepository,
    private readonly userRepository: IUserRepository,
    private readonly answerRepository: IAnswerRepository,
    private readonly questionRepository: IQuestionRepository,
  ) {}

  async addAssessment(userId: string): Promise<Assessment> {
    return await this.assessmentRepository.addAssessment(userId);
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
    const note = new Note(text, assessmentId, categoryId);
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

  async completeCategory(
    categoryId: number,
    assessmentId: number,
    answers: AnswerRequestDTO[],
  ): Promise<LevelResponseDTO> {
    /**
     * Takes an array of answers and returns a question-answer map with entries relevant only to the specified `categoryId`.
     * @param answers Array of answers from input
     */
    const processInputAnswers = async (
      answers: AnswerRequestDTO[],
    ): Promise<Map<number, AnswerWithCategoryIdDTO>> => {
      const answersWithCategoryIdRaw =
        await this.answerRepository.getAnswersWithCategoryIdsByIds(
          answers.map((item) => item.answerId),
        );
      const answersWithCategoryIdFilteredByCategoryId =
        answersWithCategoryIdRaw.filter(
          (item) => item.category_id === categoryId,
        );
      return removeDuplicateAnswers(answersWithCategoryIdFilteredByCategoryId);
    };

    /**
     * Reduces answers with duplicate `questionId` fields down to the last entry
     * @param answers - Answer array to process
     */
    function removeDuplicateAnswers(
      answers: AnswerWithCategoryIdDTO[],
    ): Map<number, AnswerWithCategoryIdDTO> {
      const map = new Map<number, AnswerWithCategoryIdDTO>();

      answers.forEach((answer) => {
        map.set(answer.question_id, answer);
      });

      return map;
    }

    const processedAnswersMap = await processInputAnswers(answers);

    /**
     * Hashset of `questionIds` of questions required to be answered to be eligible for level calculation
     */
    const requiredQuestionIds =
      await this.questionRepository.getRequiredQuestionIdsByCategory(
        categoryId,
      );
    if (requiredQuestionIds.size <= 0) {
      throw new GraphQLError(
        "The provided category is not available for level calculation",
      );
    }

    /**
     * Hashset of `answerIds` of answers processed from input in previous steps
     */
    const answerIds = new Set(processedAnswersMap.keys());
    if (
      requiredQuestionIds.intersection(answerIds).size !==
      requiredQuestionIds.size
    ) {
      throw new GraphQLError("not enough answers");
    }

    /**
     * Insert answers into the assessment_answer table
     */
    const insertedAnswers =
      await this.assessmentRepository.insertAnswersInBatch(
        processedAnswersMap
          .values()
          .toArray()
          .map(
            (item) =>
              new AssessmentAnswerInsertDTO(
                assessmentId,
                item.question_id,
                item.answer_id,
              ),
          ),
      );

    const { answersWithWeightingsAndCoefficients, availableLevels } =
      await this.getDataForLevelCalculation(
        insertedAnswers.map((item) => item.answer_id),
        categoryId,
      );

    const chosenLevel = this.calculateLevel(
      answersWithWeightingsAndCoefficients,
      availableLevels,
      answersWithWeightingsAndCoefficients.reduce(
        (acc, cur) => acc + cur.weighting_coefficient,
        0,
      ),
    );

    /**
     * Insert the chosen level into the assessment_level table
     */
    await this.assessmentRepository.insertLevel(
      new AssessmentLevel(
        assessmentId,
        chosenLevel.category_id,
        chosenLevel.level_id,
      ),
    );

    return new LevelResponseDTO(
      chosenLevel.level_id,
      chosenLevel.level_name,
      chosenLevel.level_statement,
      chosenLevel.weighting,
      chosenLevel.category_id,
    );
  }

  async getLevel(
    answers: AnswerRequestDTO[],
    categoryId: number,
  ): Promise<LevelResponseDTO> {
    const { answersWithWeightingsAndCoefficients, availableLevels } =
      await this.getDataForLevelCalculation(
        answers.map((item) => item.answerId),
        categoryId,
      );

    return mapLevelWithWeightingDTOToLevelResponseDTO(
      this.calculateLevel(
        answersWithWeightingsAndCoefficients,
        availableLevels,
        answersWithWeightingsAndCoefficients.reduce(
          (acc, cur) => acc + cur.weighting_coefficient,
          0,
        ),
      ),
    );
  }

  calculateLevel(
    answers: AnswerWithWeightingAndCoefficientDTO[],
    levels: LevelWithWeightingDTO[],
    totalCoefficient: number,
  ): LevelWithWeightingDTO {
    /**
     *
     * @param answer Answer to process
     */
    function normalizeAndProcessAnswer(
      answer: AnswerWithWeightingAndCoefficientDTO,
    ) {
      const currentCoefficientPercentage = Number(
        (answer.weighting_coefficient / totalCoefficient).toFixed(10),
      );
      totalNormalizedPercentage += currentCoefficientPercentage;
      totalWeighting += answer.weighting * currentCoefficientPercentage;
    }

    /*
    The percentage of level score needed to be reached in order for the level to be assigned
    */
    const MARGIN_OF_ERROR = 0.95;

    let totalNormalizedPercentage = 0;
    let totalWeighting = 0;
    let chosenLevel: LevelWithWeightingDTO = null;

    answers.forEach((answer) => {
      normalizeAndProcessAnswer(answer);
    });

    totalWeighting = totalWeighting / totalNormalizedPercentage;

    /*
      Iterate the levels and choose the closest level with required score <= total weighting
     */
    for (let i = 0; i < levels.length; i++) {
      if (totalWeighting < levels[i].weighting * MARGIN_OF_ERROR) {
        chosenLevel = levels[i - 1];
        break;
      }
      if (i === levels.length - 1) {
        chosenLevel = levels[i];
        break;
      }
    }

    return chosenLevel;
  }

  async addAssessmentAsGuest(): Promise<Assessment> {
    const guestUser = new User(
      "GUEST",
      "GUEST",
      "guest@guest.com",
      Math.floor(Math.random() * 1000000).toString(),
    );
    const insertedUser = await this.userRepository.insertUser(guestUser);
    return await this.addAssessment(insertedUser.user_id);
  }

  private async getDataForLevelCalculation(
    answerIds: number[],
    categoryId: number,
  ): Promise<{
    answersWithWeightingsAndCoefficients: AnswerWithWeightingAndCoefficientDTO[];
    availableLevels: LevelWithWeightingDTO[];
  }> {
    const answersWithWeightingsAndCoefficients =
      await this.answerRepository.getAnswersWithWeightingsAndCoefficientsByIds(
        answerIds,
      );
    const availableLevels =
      await this.levelRepository.getLevelsWithWeightingByCategoryId(categoryId);

    return { answersWithWeightingsAndCoefficients, availableLevels };
  }
}
