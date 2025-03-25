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

export class AssessmentService implements IAssessmentService {
  constructor(
    private readonly assessmentRepository: IAssessmentRepository,
    private readonly levelRepository: ILevelRepository,
    private readonly userRepository: IUserRepository,
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
