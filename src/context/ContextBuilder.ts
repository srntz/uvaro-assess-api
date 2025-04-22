import { IContext, IContextWithAuth } from "./IContext";
import { AssessmentService } from "../services/implementations/AssessmentService";
import { AssessmentRepository } from "../repositories/implementations/AssessmentRepository";
import { LevelRepository } from "../repositories/implementations/LevelRepository";
import { LevelService } from "../services/implementations/LevelService";
import { UserRepository } from "../repositories/implementations/UserRepository";
import { UserService } from "../services/implementations/UserService";
import { QuestionService } from "../services/implementations/QuestionService";
import { QuestionRepository } from "../repositories/implementations/QuestionRepository";
import { AnswerService } from "../services/implementations/AnswerService";
import { AnswerRepository } from "../repositories/implementations/AnswerRepository";
import { CategoryService } from "../services/implementations/CategoryService";
import { CategoryRepository } from "../repositories/implementations/CategoryRepository";
import express from "express";
import { NotificationService } from "../services/implementations/NotificationService";
import { TokenParser } from "../utils/jwt/TokenParser";

/**
 * This class is responsible for managing dependency injection.
 * The context produced by the Build() method is fed to Apollo Server and consumed from field resolvers,
 * providing a single source of truth for services across the application.
 */
export class ContextBuilder {
  static build(): IContext {
    return {
      AssessmentService: new AssessmentService(
        new AssessmentRepository(),
        new LevelRepository(),
        new CategoryRepository(),
        new AnswerRepository(),
        new QuestionRepository(),
      ),
      LevelService: new LevelService(new LevelRepository()),
      UserService: new UserService(new UserRepository()),
      QuestionService: new QuestionService(new QuestionRepository()),
      AnswerService: new AnswerService(new AnswerRepository()),
      CategoryService: new CategoryService(new CategoryRepository()),
      NotificationService: new NotificationService(
        new AssessmentRepository(),
        new CategoryRepository(),
        new UserRepository(),
      ),
    };
  }

  static injectAuthenticatedUser(
    req: express.Request,
    res: express.Response,
    context: IContext,
  ): IContextWithAuth {
    const extendedContext: IContextWithAuth = {
      ...context,
      AuthenticatedUser: {
        userId: null,
        email: null,
        assessments: null,
      },
    };

    const { payload } = TokenParser.Parse(req, res);

    if (!payload) {
      return extendedContext;
    }

    try {
      return {
        ...extendedContext,
        AuthenticatedUser: {
          ...extendedContext.AuthenticatedUser,
          userId: payload.user_id,
          email: payload.email,
        },
      };
    } catch {
      return extendedContext;
    }
  }
}
