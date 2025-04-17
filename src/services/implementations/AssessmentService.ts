import { IAssessmentService } from "../interfaces/IAssessmentService";
import { IAssessmentRepository } from "../../repositories/interfaces/IAssessmentRepository";
import { Note } from "../../models/Note";
import { AssessmentLevel } from "../../models/AssessmentLevel";
import { ILevelRepository } from "../../repositories/interfaces/ILevelRepository";
import { AnswerWithWeightingAndCoefficientDTO } from "../../dto/answer/AnswerWithWeightingAndCoefficientDTO";
import { LevelWithWeightingDTO } from "../../dto/level/LevelWithWeightingDTO";
import { AnswerRequestDTO } from "../../dto/answer/AnswerRequestDTO";
import { IAnswerRepository } from "../../repositories/interfaces/IAnswerRepository";
import { LevelResponseDTO } from "../../dto/level/LevelResponseDTO";
import { mapLevelWithWeightingDTOToLevelResponseDTO } from "../../mappers/level/mapLevelWithWeightingDTOToLevelResponseDTO";
import { AnswerWithCategoryIdDTO } from "../../dto/answer/AnswerWithCategoryIdDTO";
import { IQuestionRepository } from "../../repositories/interfaces/IQuestionRepository";
import { GraphQLError } from "graphql";
import { AssessmentAnswerInsertDTO } from "../../dto/assessmentAnswer/AssessmentAnswerInsertDTO";
import { ICategoryRepository } from "../../repositories/interfaces/ICategoryRepository";
import { mapLevelEntityToLevelResponseDTO } from "../../mappers/level/mapLevelEntityToLevelResponseDTO";
import { AnswerResponseDTO } from "../../dto/answer/AnswerResponseDTO";
import { mapAnswerEntityToAnswerResponseDTO } from "../../mappers/answer/mapAnswerEntityToAnswerResponseDTO";
import { AssessmentResponseDTO } from "../../dto/assessment/AssessmentResponseDTO";
import { mapAssessmentEntityToAssessmentResponseDTO } from "../../mappers/assessment/mapAssessmentEntityToAssessmentResponseDTO";
import { NoteResponseDTO } from "../../dto/note/NoteResponseDTO";
import { mapNoteEntityToNoteResponseDTO } from "../../mappers/note/mapNoteEntityToNoteResponseDTO";
import { BadRequest } from "../../errors/errors/BadRequest";

export class AssessmentService implements IAssessmentService {
  constructor(
    private readonly assessmentRepository: IAssessmentRepository,
    private readonly levelRepository: ILevelRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly answerRepository: IAnswerRepository,
    private readonly questionRepository: IQuestionRepository,
  ) {}

  async addAssessment(userId: string): Promise<AssessmentResponseDTO> {
    try {
      await this.assessmentRepository.deletePendingAssessments(userId);

      return mapAssessmentEntityToAssessmentResponseDTO(
        await this.assessmentRepository.addAssessment(userId),
      );
    } catch (error) {
      if (error.code === "23503") {
        throw new BadRequest("User does not exist");
      }
      throw new GraphQLError(error.message);
    }
  }

  async endAssessment(assessmentId: number): Promise<LevelResponseDTO[]> {
    const assessmentLevels =
      await this.assessmentRepository.getAssessmentLevels(assessmentId);
    const categories = await this.categoryRepository.getAll();

    if (assessmentLevels.length !== categories.length) {
      throw new BadRequest("All categories are required to be completed");
    }

    await this.assessmentRepository.endAssessment(assessmentId);

    return assessmentLevels.map((level) =>
      mapLevelEntityToLevelResponseDTO(level),
    );
  }

  async getAssessmentById(
    assessmentId: number,
  ): Promise<AssessmentResponseDTO> {
    return mapAssessmentEntityToAssessmentResponseDTO(
      await this.assessmentRepository.getAssessmentById(assessmentId),
    );
  }

  async getUserAssessments(userId: string): Promise<AssessmentResponseDTO[]> {
    return (await this.assessmentRepository.getUserAssessments(userId)).map(
      (assessment) => mapAssessmentEntityToAssessmentResponseDTO(assessment),
    );
  }

  async getAssessmentAnswers(
    assessmentId: number,
  ): Promise<AnswerResponseDTO[]> {
    return (
      await this.assessmentRepository.getAssessmentAnswers(assessmentId)
    ).map((answer) => mapAnswerEntityToAnswerResponseDTO(answer));
  }

  async getAssessmentLevels(assessmentId: number): Promise<LevelResponseDTO[]> {
    return (
      await this.assessmentRepository.getAssessmentLevels(assessmentId)
    ).map((level) => mapLevelEntityToLevelResponseDTO(level));
  }

  async getNotes(assessmentId: number): Promise<NoteResponseDTO[]> {
    return (await this.assessmentRepository.getNotes(assessmentId)).map(
      (note) => mapNoteEntityToNoteResponseDTO(note),
    );
  }

  async insertNote(
    assessmentId: number,
    categoryId: number,
    text: string,
  ): Promise<NoteResponseDTO> {
    const note = new Note(text, assessmentId, categoryId);
    return mapNoteEntityToNoteResponseDTO(
      await this.assessmentRepository.insertNote(note),
    );
  }

  /**
   * Takes an array of answers and returns a question-answer map with entries relevant only to the specified `categoryId`.
   * @param answers Array of answers from input
   */
  private processInputAnswers = async (
    answers: AnswerRequestDTO[],
    categoryId: number,
  ): Promise<Map<number, AnswerWithCategoryIdDTO>> => {
    const inputAnswerIds = answers.map((item) => item.answerId);

    if (inputAnswerIds.length <= 0) {
      throw new BadRequest(
        "Please provide answers for all required questions of the specified category",
      );
    }

    const answersWithCategoryIdRaw =
      await this.answerRepository.getAnswersWithCategoryIdsByIds(
        inputAnswerIds,
      );
    const answersWithCategoryIdFilteredByCategoryId =
      answersWithCategoryIdRaw.filter(
        (item) => item.category_id === categoryId,
      );
    return this.removeDuplicateAnswers(
      answersWithCategoryIdFilteredByCategoryId,
    );
  };

  /**
   * Reduces answers with duplicate `questionId` fields down to the last entry
   * @param answers - Answer array to process
   */
  private removeDuplicateAnswers(
    answers: AnswerWithCategoryIdDTO[],
  ): Map<number, AnswerWithCategoryIdDTO> {
    const map = new Map<number, AnswerWithCategoryIdDTO>();

    answers.forEach((answer) => {
      map.set(answer.question_id, answer);
    });

    return map;
  }

  async completeCategory(
    categoryId: number,
    assessmentId: number,
    answers: AnswerRequestDTO[],
  ): Promise<LevelResponseDTO> {
    const processedAnswersMap = await this.processInputAnswers(
      answers,
      categoryId,
    );

    /**
     * Hashset of `questionIds` of questions required to be answered to be eligible for level calculation
     */
    const requiredQuestionIds =
      await this.questionRepository.getRequiredQuestionIdsByCategory(
        categoryId,
      );
    if (requiredQuestionIds.size <= 0) {
      throw new BadRequest(
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
      throw new BadRequest(
        "Please provide answers for all required questions of the specified category",
      );
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

    const chosenLevel = this.determineLevel(
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
      chosenLevel.level_image,
      chosenLevel.weighting_id,
      chosenLevel.category_id,
    );
  }

  async calculateLevel(
    answers: AnswerRequestDTO[],
    categoryId: number,
  ): Promise<LevelResponseDTO> {
    const requiredQuestions =
      await this.questionRepository.getRequiredQuestionIdsByCategory(
        categoryId,
      );

    if (requiredQuestions.size <= 0) {
      throw new BadRequest(
        "The provided category is not available for level calculation",
      );
    }

    const processedAnswersMap = await this.processInputAnswers(
      answers,
      categoryId,
    );

    if (
      new Set(processedAnswersMap.keys()).intersection(requiredQuestions)
        .size !== requiredQuestions.size
    ) {
      throw new BadRequest(
        "Please provide answers for all required questions of the specified category",
      );
    }

    const { answersWithWeightingsAndCoefficients, availableLevels } =
      await this.getDataForLevelCalculation(
        Array.from(processedAnswersMap.values()).map((item) => item.answer_id),
        categoryId,
      );

    return mapLevelWithWeightingDTOToLevelResponseDTO(
      this.determineLevel(
        answersWithWeightingsAndCoefficients,
        availableLevels,
        answersWithWeightingsAndCoefficients.reduce(
          (acc, cur) => acc + cur.weighting_coefficient,
          0,
        ),
      ),
    );
  }

  private determineLevel(
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

    return {
      answersWithWeightingsAndCoefficients,
      availableLevels,
    };
  }
}
