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
import { JWTManager } from "../utils/jwtManager/JWTManager.js";
import { NotificationService } from "../services/implementations/NotificationService.js";

export class ContextBuilder {
  static Build(): IContext {
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

  static ParseTokens(
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

    const jwt = new JWTManager();

    if (!req.cookies.accessToken && !req.cookies.refreshToken) {
      return extendedContext;
    }

    if (!req.cookies.accessToken) {
      const parsedRefreshToken = jwt.verify(req.cookies.refreshToken);
      const newAccessToken = jwt.sign(
        {
          user_id: parsedRefreshToken.payload.user_id,
          email: parsedRefreshToken.payload.email,
        },
        120000,
      );

      extendedContext.AuthenticatedUser.userId =
        parsedRefreshToken.payload.user_id;
      extendedContext.AuthenticatedUser.email =
        parsedRefreshToken.payload.email;

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        maxAge: 120000,
      });

      return extendedContext;
    }

    const parsedAccessToken = jwt.verify(req.cookies.accessToken);

    extendedContext.AuthenticatedUser.userId =
      parsedAccessToken.payload.user_id;
    extendedContext.AuthenticatedUser.email = parsedAccessToken.payload.email;

    return extendedContext;
  }
}
