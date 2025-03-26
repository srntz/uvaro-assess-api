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

export class AssessmentService implements IAssessmentService {
  constructor(
    private readonly assessmentRepository: IAssessmentRepository,
    private readonly levelRepository: ILevelRepository,
    private readonly userRepository: IUserRepository,
    private readonly answerRepository: IAnswerRepository,
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

  async getLevel(
    answers: AnswerRequestDTO[],
    categoryId: number,
  ): Promise<LevelResponseDTO> {
    const availableLevels =
      await this.levelRepository.getLevelsWithWeightingByCategoryId(categoryId);

    const answersWithWeightingsAndCoefficients =
      await this.answerRepository.getAnswersWithWeightingsAndCoefficientsByIds(
        answers.map((item) => item.answerId),
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
}
